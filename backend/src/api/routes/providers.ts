import { Router } from "express";
import { providerManager } from "../../providers/provider-manager";
const router = Router();
router.get("/", (req, res) => {
  const providers = providerManager.getAllProviders().map(p => ({
    id: p.config.id,
    name: p.config.name,
    category: p.config.supportedCategories,
    dataSource: "demo",
    enabled: true
  }));
  res.json({ success: true, providers });
});
export default router;
