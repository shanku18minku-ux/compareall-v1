# CompareAll

CompareAll is a privacy-conscious, extensible comparison aggregator. Users can connect supported services, search for a product/service, and the application compares available live/account-specific information across multiple providers without tracking or storing third-party passwords.

## Architecture

- **Provider-Agnostic Core**: Every external service is integrated via an independent `ProviderAdapter`. The core engine contains NO provider-specific logic.
- **Privacy By Design**: All third-party authentication sessions (where permitted) are maintained securely on the user's local device (`packages/storage`), completely separated from our backend. We NEVER store third-party credentials.
- **Universal Search**: Unified interface handling location contexts, varied categories, and natural language query intent parsing.
- **Comparison Engine**: Consolidates pricing, delivery estimates, taxes, base prices, discounts, and ratings to calculate an accurate `finalPayablePrice`.
- **Match Engine**: Identifies identical variants/SKUs and merges them into a side-by-side comparison.

## Running Locally

1. `npm install`
2. `npx prisma generate` (in `apps/web`)
3. `npx prisma db push` (in `apps/web`)
4. `npm run dev:all` (Starts both the Next.js frontend and Express backend)

## Testing

Backend test suite ensures all engine comparisons and edge cases run securely:
```bash
npm run test --workspace=@compareall/backend
```

## Adding a Provider

1. Implement the `ProviderAdapter` interface in `@compareall/shared-types`.
2. Map your data to the `NormalizedResult` format, explicitly providing `basePrice`, `fees`, and `finalPayablePrice`.
3. Add the adapter instance to the `ProviderManager` or `mockProviders`.
