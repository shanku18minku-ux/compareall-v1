import { Router } from "express";
const router = Router();
router.get("/", (req, res) => {
  res.json({
    success: true,
    service: "compareall-backend",
    status: "healthy",
    timestamp: new Date().toISOString()
  });
});
export default router;
