export interface PlatformOffer {
  id: string;
  type: 'coupon' | 'bank' | 'wallet' | 'membership';
  icon: string;
  title: string;
  code?: string;
  description: string;
  discountAmount?: number;
}

export interface CartItem {
  id: string; // unique item id
  title: string; // full formatted title
  dishName: string;
  restaurantName: string;
  providerId: string;
  providerName: string;
  price: number;
  basePrice?: number;
  discount?: number;
  offerText?: string;
  couponCode?: string;
  couponDescription?: string;
  couponMaxCap?: number;
  couponPercent?: number;
  couponFlat?: number;
  additionalOffers?: PlatformOffer[];
  quantity: number;
}

export interface CartGroup {
  providerId: string;
  providerName: string;
  restaurantName: string;
  items: CartItem[];
  subtotal: number;
  itemDiscounts: number;
  couponCode?: string;
  couponDescription?: string;
  couponSavings: number;
  additionalOffers?: PlatformOffer[];
  finalTotal: number;
  promoText?: string;
}
