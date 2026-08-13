import { searchEngine } from '@compareall/engine';
import { ProviderAdapter, NormalizedResult } from '@compareall/shared-types';

describe('Comparison Engine Edge Cases', () => {
  it('should ignore negative and missing prices', async () => {
    const dummyProvider: ProviderAdapter = {
      config: { id: 'test1', name: 'Test 1', supportedCategories: ['electronics'], requiresAuth: false },
      search: async () => [
        {
          id: '1', providerId: 'test1', providerName: 'Test 1', title: 'iphone', category: 'electronics', status: 'LIVE',
          price: { basePrice: 100, finalPayablePrice: 100, currency: 'INR' },
          isAvailable: true, deepLinkUrl: '#'
        },
        {
          id: '2', providerId: 'test1', providerName: 'Test 1', title: 'iphone', category: 'electronics', status: 'LIVE',
          price: { basePrice: -50, finalPayablePrice: -50, currency: 'INR' }, // Negative price
          isAvailable: true, deepLinkUrl: '#'
        },
        {
          id: '3', providerId: 'test1', providerName: 'Test 1', title: 'iphone', category: 'electronics', status: 'LIVE',
          price: { basePrice: NaN, finalPayablePrice: NaN, currency: 'INR' }, // Missing/NaN price
          isAvailable: true, deepLinkUrl: '#'
        },
        {
          id: '4', providerId: 'test1', providerName: 'Test 1', title: 'iphone', category: 'electronics', status: 'LIVE',
          price: { basePrice: 200, finalPayablePrice: 200, currency: 'INR' },
          isAvailable: true, deepLinkUrl: '#'
        }
      ] as NormalizedResult[]
    };

    const res = await searchEngine.search('iphone', [dummyProvider]);
    console.log(JSON.stringify(res, null, 2));
    expect(res.length).toBe(1);
    expect(res[0].lowestPrice).toBe(100);
    expect(res[0].highestPrice).toBe(200);
    expect(res[0].savings).toBe(100);
    expect(res[0].offers.length).toBe(2); // Only 2 valid offers
  });

  it('should have 0 savings if only one result', async () => {
    const dummyProvider: ProviderAdapter = {
      config: { id: 'test1', name: 'Test 1', supportedCategories: ['electronics'], requiresAuth: false },
      search: async () => [
        {
          id: '1', providerId: 'test1', providerName: 'Test 1', title: 'iphone', category: 'electronics', status: 'LIVE',
          price: { basePrice: 100, finalPayablePrice: 100, currency: 'INR' },
          isAvailable: true, deepLinkUrl: '#'
        }
      ] as NormalizedResult[]
    };

    const res = await searchEngine.search('iphone', [dummyProvider]);
    expect(res[0].savings).toBe(0);
  });

  it('should not crash if no valid prices', async () => {
    const dummyProvider: ProviderAdapter = {
      config: { id: 'test1', name: 'Test 1', supportedCategories: ['electronics'], requiresAuth: false },
      search: async () => [
        {
          id: '2', providerId: 'test1', providerName: 'Test 1', title: 'iphone', category: 'electronics', status: 'LIVE',
          price: { basePrice: -50, finalPayablePrice: -50, currency: 'INR' }, // Negative price
          isAvailable: true, deepLinkUrl: '#'
        }
      ] as NormalizedResult[]
    };

    const res = await searchEngine.search('iphone', [dummyProvider]);
    // The engine might group it but with 0 offers because they are filtered out
    expect(res.length).toBe(0);
  });
});


