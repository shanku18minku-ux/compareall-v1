import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  Vibration,
} from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { CartItem, CartGroup } from './CartTypes';

interface UniversalCartModalProps {
  visible: boolean;
  cartItems: CartItem[];
  onUpdateQuantity: (id: string, newQuantity: number) => void;
  onRemoveItem: (id: string) => void;
  onClearCart: () => void;
  onCheckout: (providerId: string, restaurantName: string, couponCode?: string, restaurantUrl?: string, items?: CartItem[]) => void;
  onClose: () => void;
}

export const UniversalCartModal: React.FC<UniversalCartModalProps> = ({
  visible,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onCheckout,
  onClose,
}) => {
  // Group cart items by Provider + Restaurant & Calculate Best Applied Coupon
  const cartGroups: CartGroup[] = React.useMemo(() => {
    const groupMap: { [key: string]: CartGroup } = {};

    cartItems.forEach(item => {
      const groupKey = `${item.providerId}__${item.restaurantName || 'General'}`;
      if (!groupMap[groupKey]) {
        groupMap[groupKey] = {
          providerId: item.providerId,
          providerName: item.providerName,
          restaurantName: item.restaurantName || 'Restaurant Order',
          restaurantUrl: item.restaurantUrl,
          items: [],
          subtotal: 0,
          itemDiscounts: 0,
          couponCode: item.couponCode,
          couponDescription: item.couponDescription,
          couponSavings: 0,
          additionalOffers: item.additionalOffers || [],
          finalTotal: 0,
          promoText: item.offerText,
        };
      }

      groupMap[groupKey].items.push(item);
      const itemSubtotal = (item.basePrice || item.price) * item.quantity;
      const itemFinal = item.price * item.quantity;
      groupMap[groupKey].subtotal += itemFinal;
      groupMap[groupKey].itemDiscounts += Math.max(0, itemSubtotal - itemFinal);
      if (item.restaurantUrl && !groupMap[groupKey].restaurantUrl) {
        groupMap[groupKey].restaurantUrl = item.restaurantUrl;
      }
      if (item.couponCode && !groupMap[groupKey].couponCode) {
        groupMap[groupKey].couponCode = item.couponCode;
        groupMap[groupKey].couponDescription = item.couponDescription;
      }
      if (item.additionalOffers && item.additionalOffers.length > 0 && (!groupMap[groupKey].additionalOffers || groupMap[groupKey].additionalOffers.length === 0)) {
        groupMap[groupKey].additionalOffers = item.additionalOffers;
      }
    });

    // Calculate Best Coupon Savings for each Restaurant Group
    Object.values(groupMap).forEach(group => {
      const firstItem = group.items[0];
      let couponDiscount = 0;
      if (firstItem) {
        if (firstItem.couponPercent && firstItem.couponPercent > 0) {
          const raw = Math.round((group.subtotal * firstItem.couponPercent) / 100);
          couponDiscount = firstItem.couponMaxCap ? Math.min(raw, firstItem.couponMaxCap) : raw;
        } else if (firstItem.couponFlat && firstItem.couponFlat > 0) {
          couponDiscount = firstItem.couponFlat;
        }
      }
      group.couponSavings = couponDiscount;
      group.finalTotal = Math.max(1, group.subtotal - couponDiscount);
    });

    return Object.values(groupMap);
  }, [cartItems]);

  const grandSubtotal = cartGroups.reduce((sum, g) => sum + g.subtotal, 0);
  const grandCouponSavings = cartGroups.reduce((sum, g) => sum + g.couponSavings, 0);
  const grandPayable = cartGroups.reduce((sum, g) => sum + g.finalTotal, 0);
  const totalItemsCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const handleQtyChange = (id: string, delta: number, currentQty: number) => {
    Vibration.vibrate(20);
    const newQty = currentQty + delta;
    if (newQty <= 0) {
      onRemoveItem(id);
    } else {
      onUpdateQuantity(id, newQty);
    }
  };

  const handleCheckoutPress = async (group: CartGroup) => {
    Vibration.vibrate(30);
    if (group.couponCode) {
      try {
        await Clipboard.setStringAsync(group.couponCode);
      } catch (_) {}
    }
    onCheckout(group.providerId, group.restaurantName, group.couponCode, group.restaurantUrl, group.items);
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.headerTitle}>Universal Cart</Text>
            <Text style={styles.headerSub}>
              {totalItemsCount > 0 ? `${totalItemsCount} items across connected apps` : 'Your basket is empty'}
            </Text>
          </View>
          <TouchableOpacity onPress={onClose} style={styles.closeBtn} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
            <Text style={styles.closeText}>✕</Text>
          </TouchableOpacity>
        </View>

        {cartItems.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>🛒</Text>
            <Text style={styles.emptyTitle}>Your Cart is Empty</Text>
            <Text style={styles.emptySub}>
              Search for dishes or products and tap "+ ADD" to compare and build your universal basket.
            </Text>
            <TouchableOpacity style={styles.startShoppingBtn} onPress={onClose}>
              <Text style={styles.startShoppingText}>Start Searching</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={{ flex: 1 }}>
            <ScrollView style={styles.scrollArea} contentContainerStyle={{ paddingBottom: 120 }}>
              {cartGroups.map((group, gIdx) => (
                <View key={gIdx} style={styles.groupCard}>
                  {/* Group Header */}
                  <View style={styles.groupHeader}>
                    <View style={styles.groupHeaderTitleBox}>
                      <Text style={styles.groupProviderBadge}>{group.providerName}</Text>
                      <Text style={styles.groupRestaurantName}>{group.restaurantName}</Text>
                    </View>
                    {group.couponCode ? (
                      <View style={styles.couponBadgeBox}>
                        <Text style={styles.groupPromoBadge}>
                          🏷️ Best Coupon: <Text style={{ fontWeight: 'bold' }}>{group.couponCode}</Text>
                        </Text>
                        {group.couponDescription ? (
                          <Text style={styles.couponDescText}>{group.couponDescription}</Text>
                        ) : null}
                      </View>
                    ) : null}
                  </View>

                  {/* Items List */}
                  <View style={styles.itemsList}>
                    {group.items.map(item => (
                      <View key={item.id} style={styles.itemRow}>
                        <View style={styles.itemInfo}>
                          <Text style={styles.itemDishName} numberOfLines={2}>{item.dishName}</Text>
                          <Text style={styles.itemPriceText}>
                            ₹{item.price * item.quantity}
                            {item.quantity > 1 && (
                              <Text style={styles.itemUnitPrice}> (₹{item.price} each)</Text>
                            )}
                          </Text>
                        </View>

                        {/* Quantity Stepper */}
                        <View style={styles.stepperContainer}>
                          <TouchableOpacity
                            style={styles.stepperBtn}
                            onPress={() => handleQtyChange(item.id, -1, item.quantity)}
                          >
                            <Text style={styles.stepperBtnText}>−</Text>
                          </TouchableOpacity>
                          <Text style={styles.stepperQtyText}>{item.quantity}</Text>
                          <TouchableOpacity
                            style={styles.stepperBtn}
                            onPress={() => handleQtyChange(item.id, 1, item.quantity)}
                          >
                            <Text style={styles.stepperBtnText}>+</Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    ))}
                  </View>

                  {/* Extra Bank & Payment Offers */}
                  {group.additionalOffers && group.additionalOffers.length > 0 && (
                    <View style={styles.groupOffersContainer}>
                      <Text style={styles.groupOffersHeading}>🎁 Platform & Bank Offers Available</Text>
                      {group.additionalOffers.map((offer, oIdx) => (
                        <View key={oIdx} style={styles.groupOfferRow}>
                          <Text style={styles.groupOfferIcon}>{offer.icon}</Text>
                          <View style={styles.groupOfferContent}>
                            <Text style={styles.groupOfferTitle}>{offer.title}</Text>
                            <Text style={styles.groupOfferDesc}>{offer.description}</Text>
                          </View>
                        </View>
                      ))}
                    </View>
                  )}

                  {/* Group Subtotal & Applied Coupon Savings */}
                  <View style={styles.groupFooter}>
                    <View>
                      <Text style={styles.groupTotalLabel}>Item Total: ₹{group.subtotal}</Text>
                      {group.couponSavings > 0 && (
                        <Text style={styles.couponSavingsText}>
                          Coupon Discount ({group.couponCode}): -₹{group.couponSavings}
                        </Text>
                      )}
                      <Text style={styles.groupTotalValue}>Final Payable: ₹{group.finalTotal}</Text>
                    </View>
                    <TouchableOpacity
                      style={styles.orderOnProviderBtn}
                      onPress={() => handleCheckoutPress(group)}
                    >
                      <Text style={styles.orderOnProviderText}>Order on {group.providerName} →</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))}

              {/* Bill Details Card */}
              <View style={styles.billCard}>
                <Text style={styles.billTitle}>Bill Summary</Text>
                <View style={styles.billRow}>
                  <Text style={styles.billLabel}>Item Total</Text>
                  <Text style={styles.billValue}>₹{grandSubtotal}</Text>
                </View>
                {grandCouponSavings > 0 && (
                  <View style={styles.billRow}>
                    <Text style={[styles.billLabel, { color: '#16a34a', fontWeight: '600' }]}>🏷️ Best Coupon Savings</Text>
                    <Text style={[styles.billValue, { color: '#16a34a', fontWeight: 'bold' }]}>-₹{grandCouponSavings}</Text>
                  </View>
                )}
                <View style={styles.billRow}>
                  <Text style={styles.billLabel}>Platform Comparison Fee</Text>
                  <Text style={[styles.billValue, { color: '#00875A', fontWeight: 'bold' }]}>FREE</Text>
                </View>
                <View style={styles.billDivider} />
                <View style={styles.billRow}>
                  <Text style={styles.billGrandTotalLabel}>Total To Pay</Text>
                  <Text style={styles.billGrandTotalValue}>₹{grandPayable}</Text>
                </View>
              </View>

              {/* Clear Cart Button */}
              <TouchableOpacity style={styles.clearCartBtn} onPress={onClearCart}>
                <Text style={styles.clearCartText}>🗑️ Clear Entire Basket</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        )}
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerLeft: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111',
  },
  headerSub: {
    fontSize: 13,
    color: '#666',
    marginTop: 2,
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#444',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 8,
  },
  emptySub: {
    fontSize: 14,
    color: '#777',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  startShoppingBtn: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
  },
  startShoppingText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: 'bold',
  },
  scrollArea: {
    flex: 1,
    padding: 16,
  },
  groupCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  groupHeader: {
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f2f2f2',
    marginBottom: 12,
  },
  groupHeaderTitleBox: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  groupProviderBadge: {
    backgroundColor: '#ff6d00',
    color: '#fff',
    fontSize: 11,
    fontWeight: 'bold',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    marginRight: 8,
    overflow: 'hidden',
  },
  groupRestaurantName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111',
    flex: 1,
  },
  couponBadgeBox: {
    marginTop: 6,
  },
  groupPromoBadge: {
    fontSize: 12,
    color: '#15803d',
    fontWeight: '600',
    backgroundColor: '#f0fdf4',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#bbf7d0',
    alignSelf: 'flex-start',
  },
  couponDescText: {
    fontSize: 11,
    color: '#64748b',
    marginTop: 2,
  },
  couponSavingsText: {
    fontSize: 12,
    color: '#16a34a',
    fontWeight: 'bold',
    marginVertical: 2,
  },
  itemsList: {
    marginBottom: 12,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f9f9f9',
  },
  itemInfo: {
    flex: 1,
    paddingRight: 12,
  },
  itemDishName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#222',
    lineHeight: 18,
  },
  itemPriceText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111',
    marginTop: 4,
  },
  itemUnitPrice: {
    fontSize: 12,
    fontWeight: 'normal',
    color: '#888',
  },
  stepperContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0fdf4',
    borderWidth: 1,
    borderColor: '#bbf7d0',
    borderRadius: 8,
    paddingHorizontal: 4,
    paddingVertical: 2,
  },
  stepperBtn: {
    width: 28,
    height: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepperBtnText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#16a34a',
  },
  stepperQtyText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#16a34a',
    paddingHorizontal: 8,
  },
  groupOffersContainer: {
    backgroundColor: '#f8fafc',
    borderRadius: 10,
    padding: 10,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  groupOffersHeading: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 6,
  },
  groupOfferRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 4,
  },
  groupOfferIcon: {
    fontSize: 14,
    marginRight: 6,
    marginTop: 1,
  },
  groupOfferContent: {
    flex: 1,
  },
  groupOfferTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1e293b',
  },
  groupOfferDesc: {
    fontSize: 11,
    color: '#64748b',
    marginTop: 1,
  },
  groupFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f2f2f2',
    marginTop: 4,
  },
  groupTotalLabel: {
    fontSize: 12,
    color: '#888',
  },
  groupTotalValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111',
  },
  orderOnProviderBtn: {
    backgroundColor: '#111',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
  },
  orderOnProviderText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: 'bold',
  },
  billCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  billTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111',
    marginBottom: 12,
  },
  billRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
  },
  billLabel: {
    fontSize: 14,
    color: '#666',
  },
  billValue: {
    fontSize: 14,
    color: '#222',
    fontWeight: '600',
  },
  billDivider: {
    height: 1,
    backgroundColor: '#eee',
    marginVertical: 10,
  },
  billGrandTotalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111',
  },
  billGrandTotalValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#16a34a',
  },
  clearCartBtn: {
    alignItems: 'center',
    paddingVertical: 14,
    marginBottom: 30,
  },
  clearCartText: {
    color: '#ef4444',
    fontSize: 14,
    fontWeight: '600',
  },
});
