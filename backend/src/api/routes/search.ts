import { Router } from "express";
import { providerManager } from "../../providers/provider-manager";
import { searchEngine } from "@compareall/engine";

const router = Router();

router.post("/", async (req, res) => {
  try {
    const { query, category } = req.body;
    
    if (!query) {
      return res.status(400).json({
        success: false,
        data: null,
        error: { code: "INVALID_REQUEST", message: "Search query is required" }
      });
    }

    const providers = providerManager.getAllProviders();
    const results = await searchEngine.search(
      query,
      providers,
      undefined,
      "price_asc"
    );

    res.json({
      success: true,
      data: results,
      error: null
    });

  } catch (err: any) {
    console.error("Search error:", err);
    res.status(500).json({
      success: false,
      data: null,
      error: { code: "INTERNAL_ERROR", message: "Failed to search" }
    });
  }
});

export default router;
