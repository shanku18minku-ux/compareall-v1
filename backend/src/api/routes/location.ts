import { Router } from "express";
const router = Router();
router.post("/", (req, res) => {
  const { city, pincode } = req.body;
  if (!city && !pincode) {
    return res.status(400).json({ success: false, data: null, error: { code: "INVALID_REQUEST", message: "City or pincode required" } });
  }
  res.json({ success: true, data: { city, pincode, valid: true }, error: null });
});
export default router;
