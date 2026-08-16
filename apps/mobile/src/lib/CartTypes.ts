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
  finalTotal: number;
  promoText?: string;
}
