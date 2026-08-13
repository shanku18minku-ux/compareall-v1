/**
 * CompareAll Environment Configuration Layer
 * 
 * This file centralizes access to environment variables.
 * In a real-world scenario with Zod/Joi, we would validate these at startup.
 * 
 * NOTE: NEVER expose server-side secrets (without NEXT_PUBLIC_) to the client.
 */

export const env = {
  // App Configuration
  APP_URL: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  NODE_ENV: process.env.NODE_ENV || 'development',

  // Database (Server-side only)
  DATABASE_URL: process.env.DATABASE_URL,

  // Location / Geocoding API (Client-side safe if restricted by domain, but prefer server-side proxy)
  GOOGLE_MAPS_API_KEY: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,

  // --- Mock Provider Toggles ---
  // If true, the engine will use mock providers instead of hitting real APIs
  USE_MOCK_PROVIDERS: process.env.NEXT_PUBLIC_USE_MOCK_PROVIDERS !== 'false',

  // --- Real Provider API Keys (Server-side only) ---
  providers: {
    // Food
    SWIGGY_API_KEY: process.env.SWIGGY_API_KEY,
    ZOMATO_API_KEY: process.env.ZOMATO_API_KEY,
    
    // Grocery
    BLINKIT_API_KEY: process.env.BLINKIT_API_KEY,
    
    // Shopping
    AMAZON_AFFILIATE_ID: process.env.AMAZON_AFFILIATE_ID,
    FLIPKART_AFFILIATE_ID: process.env.FLIPKART_AFFILIATE_ID,
    
    // Cabs
    UBER_API_KEY: process.env.UBER_API_KEY,
    OLA_API_KEY: process.env.OLA_API_KEY,
  }
};
