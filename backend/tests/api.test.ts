import request from 'supertest';
import app from '../src/server';
import { providerManager } from '../src/providers/provider-manager';
import { ProviderAdapter } from '@compareall/shared-types';

describe('CompareAll Backend API', () => {
  describe('GET /api/health', () => {
    it('should return health status', async () => {
      const res = await request(app).get('/api/health');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.status).toBe('healthy');
    });
  });

  describe('GET /api/providers', () => {
    it('should list all demo providers and label them correctly', async () => {
      const res = await request(app).get('/api/providers');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.providers)).toBe(true);
      
      const p = res.body.providers[0];
      expect(p.dataSource).toBe('demo');
    });
  });

  describe('POST /api/compare', () => {
    it('should validate inputs', async () => {
      const res = await request(app).post('/api/compare').send({});
      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.error.code).toBe('INVALID_REQUEST');
    });

    it('should calculate savings and best price for electronics', async () => {
      const res = await request(app).post('/api/compare').send({
        query: 'iphone',
        category: 'electronics'
      });
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.dataSource).toBe('demo');
      expect(res.body.isLive).toBe(false);

      expect(res.body.comparison).toBeDefined();
      // Even if random offset applies, savings must be >= 0
      expect(res.body.comparison.savings).toBeGreaterThanOrEqual(0);
    });

    it('should calculate for food category properly', async () => {
      const res = await request(app).post('/api/compare').send({
        query: 'pizza',
        category: 'food'
      });
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      
      const results = res.body.results;
      if (results.length > 0) {
        expect(results[0].category).toBe('food');
      }
    });

    it('should handle location context correctly', async () => {
      const location = { lat: 12.9716, lng: 77.5946, pincode: "560001", label: "Bengaluru" };
      const res = await request(app).post('/api/compare').send({
        query: 'pizza',
        category: 'food',
        location
      });
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });

    it('should not fail the request when one provider fails', async () => {
      // Inject a failing provider dynamically for this test
      const failingProvider: ProviderAdapter = {
        config: { id: 'fail-1', name: 'Fail Provider', supportedCategories: ['electronics'], requiresAuth: false },
        search: async () => { throw new Error('Simulated failure'); }
      };
      providerManager.register(failingProvider);

      const res = await request(app).post('/api/compare').send({
        query: 'iphone',
        category: 'electronics'
      });
      
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      // The good providers should still return results
      expect(res.body.results.length).toBeGreaterThan(0);
    });
  });

  describe('POST /api/search', () => {
    it('should return un-grouped / raw results properly', async () => {
      const res = await request(app).post('/api/search').send({
        query: 'iphone',
        category: 'electronics'
      });
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
    });
  });
});

