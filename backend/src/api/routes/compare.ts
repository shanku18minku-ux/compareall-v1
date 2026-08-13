import { Router } from "express";
import { providerManager } from "../../providers/provider-manager";
import { searchEngine } from "@compareall/engine";
import { config } from "../../config";

const router = Router();

router.post("/", async (req, res) => {
  try {
    const { query, category, location } = req.body;
    
    if (!query) {
      return res.status(400).json({
        success: false,
        data: null,
        error: { code: "INVALID_REQUEST", message: "Search query is required" }
      });
    }

    const providers = providerManager.getAllProviders();
    
    // Perform search via engine
    // Engine Signature: search(rawTerm, providers, location, sortOrder, filters, connectedProviderIds)
    const results = await searchEngine.search(
      query,
      providers,
      location,
      "price_asc",
      undefined, // filters
      [] // connected providers logic can be passed by client later
    );

    res.json({
      success: true,
      dataSource: config.apiMode === 'live' ? "official" : "demo",
      isLive: config.apiMode === 'live',
      query,
      results,
      comparison: results.length > 0 ? {
        lowestPrice: results[0].lowestPrice ?? null,
        highestPrice: results[0].highestPrice ?? null,
        savings: results[0].savings ?? null,
        recommended: results[0].offers[0]?.providerId ?? null
      } : {
        lowestPrice: null,
        highestPrice: null,
        savings: null,
        recommended: null
      }
    });

  } catch (err: any) {
    console.error("Compare error:", err);
    res.status(500).json({
      success: false,
      data: null,
      error: { code: "INTERNAL_ERROR", message: "Failed to compare" }
    });
  }
});

router.post("/live", async (req, res) => {
  try {
    const { query, results: rawResults } = req.body;
    
    if (!rawResults || !Array.isArray(rawResults)) {
      return res.status(400).json({
        success: false,
        error: { code: "INVALID_REQUEST", message: "Results array is required" }
      });
    }

    // Pass the raw normalized results through our grouping and sorting engine
    const grouped = searchEngine.groupAndSortResults(rawResults, "price_asc");

    res.json({
      success: true,
      dataSource: "extension",
      isLive: true,
      query,
      results: grouped,
      comparison: grouped.length > 0 ? {
        lowestPrice: grouped[0].lowestPrice ?? null,
        highestPrice: grouped[0].highestPrice ?? null,
        savings: grouped[0].savings ?? null,
        recommended: grouped[0].offers[0]?.providerId ?? null
      } : {
        lowestPrice: null,
        highestPrice: null,
        savings: null,
        recommended: null
      }
    });

  } catch (err: any) {
    console.error("Live compare error:", err);
    res.status(500).json({
      success: false,
      error: { code: "INTERNAL_ERROR", message: "Failed to process live results" }
    });
  }
});

export default router;
