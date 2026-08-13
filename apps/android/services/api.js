import { API_URL } from '../constants/platforms';

export const ApiService = {
  // Compare via backend (groups and sorts results)
  compareResults: async (query, rawResults) => {
    try {
      const res = await fetch(`${API_URL}/api/compare/live`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, results: rawResults })
      });
      const json = await res.json();
      if (json.success) return json.results;
      return [];
    } catch(e) {
      console.error('API compare error:', e);
      // If backend is sleeping, group locally
      return groupLocally(query, rawResults);
    }
  },

  // Health check
  ping: async () => {
    try {
      const res = await fetch(`${API_URL}/api/health`, { signal: AbortSignal.timeout(5000) });
      return res.ok;
    } catch { return false; }
  }
};

// Local fallback grouping when backend is sleeping
function groupLocally(query, results) {
  if (!results || results.length === 0) return [];
  
  const sorted = [...results].sort((a, b) => 
    (a.price?.finalPayablePrice || 0) - (b.price?.finalPayablePrice || 0)
  );
  
  const prices = sorted.map(r => r.price?.finalPayablePrice || 0).filter(p => p > 0);
  const lowestPrice = prices.length ? Math.min(...prices) : 0;
  const highestPrice = prices.length ? Math.max(...prices) : 0;
  
  return [{
    title: query,
    category: results[0]?.category || 'general',
    offers: sorted,
    lowestPrice,
    highestPrice,
    savings: highestPrice - lowestPrice
  }];
}
