import { NormalizedResult, PriceBreakdown } from '@compareall/shared-types';

export function calculateFinalPrice(
  basePrice: number,
  deliveryFee: number = 0,
  platformFee: number = 0,
  taxes: number = 0,
  discount: number = 0,
  packagingFee: number = 0,
  otherCredits: number = 0
): PriceBreakdown {
  const finalPrice = basePrice + deliveryFee + platformFee + packagingFee + taxes - discount - otherCredits;
  return {
    basePrice,
    deliveryFee,
    platformFee,
    packagingFee,
    taxes,
    discount,
    otherCredits,
    finalPayablePrice: Math.max(0, finalPrice), // prevent negative prices
    currency: 'INR'
  };
}

export function createMockResult(
  providerId: string,
  providerName: string,
  id: string, 
  data: Partial<NormalizedResult>
): NormalizedResult {
  return {
    id: `${providerId}-${id}`,
    providerId,
    providerName,
    title: data.title || 'Unknown Item',
    category: data.category || 'other',
    status: 'LIVE',
    price: data.price || calculateFinalPrice(0),
    isAvailable: data.isAvailable !== undefined ? data.isAvailable : true,
    deepLinkUrl: data.deepLinkUrl || `https://www.google.com/search?q=${encodeURIComponent(providerName + ' ' + (data.title || ''))}`,
    ...data
  };
}

