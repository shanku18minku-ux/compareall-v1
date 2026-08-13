import express from "express";
import cors from "cors";
import helmet from "helmet";
import * as dotenvPkg from "dotenv";

import healthRoutes from "./api/routes/health";
import providerRoutes from "./api/routes/providers";
import compareRoutes from "./api/routes/compare";
import searchRoutes from "./api/routes/search";
import locationRoutes from "./api/routes/location";
import { providerManager } from "./providers/provider-manager";
import { demoProviders } from "./providers/demo";
import { config } from "./config";

dotenvPkg.config();

if (config.apiMode === 'mock') {
  demoProviders.forEach(p => providerManager.register(p));
  console.log(`[INIT] MOCK Mode Enabled: Registered ${demoProviders.length} mock providers.`);
} else {
  console.log(`[INIT] LIVE Mode Enabled: Awaiting live provider integrations.`);
}

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(helmet());
app.use(cors({ origin: "*" })); // In production, restrict this
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Routes
app.use("/api/health", healthRoutes);
app.use("/api/providers", providerRoutes);
app.use("/api/compare", compareRoutes);
app.use("/api/search", searchRoutes);
app.use("/api/location", locationRoutes);

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error("Unhandled error:", err);
  res.status(500).json({
    success: false,
    data: null,
    error: {
      code: "INTERNAL_SERVER_ERROR",
      message: "An unexpected error occurred"
    }
  });
});

export default app;

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`CompareAll Backend running on port ${PORT}`);
  });
}
