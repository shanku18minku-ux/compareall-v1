const fs = require('fs');

const content = `// @ts-nocheck
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
  connectedProviders: string[];
}

export const UniversalCartModal: React.FC<UniversalCartModalProps> = ({
  visible,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onCheckout,
  onClose,
  connectedProviders,
}) => {
  const handleQtyChange = (id: string, delta: number, currentQty: number) => {
    Vibration.vibrate(10);
    const newQty = currentQty + delta;
    if (newQty <= 0) {
      onRemoveItem(id);
    } else {
      onUpdateQuantity(id, newQty);
    }
  };

  const handleCheckoutPress = async (providerId: string, finalPrice: number, items: any[]) => {
    Vibration.vibrate(20);
    // Use first item's restaurantName/Url for the checkout fallback
    const firstItem = items[0];
    onCheckout(providerId, firstItem?.providerItemDetails?.[providerId]?.restaurantName || 'Unknown', '', firstItem?.providerItemDetails?.[providerId]?.restaurantUrl || '', items);
  };

  // Compile unique providers that have prices for the items in cart
  const providerStats = {};
  cartItems.forEach(item => {
    if(item.offers) {
      item.offers.forEach(o => {
          if (!providerStats[o.providerName]) providerStats[o.providerName] = { total: 0, itemsCount: 0, id: o.providerId || (o.providerName.toLowerCase() === 'swiggy' ? 'food-a' : 'food-b') };
          providerStats[o.providerName].total += (o.price?.finalPayablePrice || 0) * item.quantity;
          providerStats[o.providerName].itemsCount += item.quantity;
      });
    }
  });

  const providers = Object.keys(providerStats).map(k => ({name: k, ...providerStats[k]}));
  
  // Sort providers by total price asc
  providers.sort((a, b) => a.total - b.total);

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Cart comparison</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeBtn} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
            <Text style={styles.closeText}>X</Text>
          </TouchableOpacity>
        </View>

        {cartItems.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={{fontSize: 16, color: '#64748b', textAlign: 'center'}}>Your Cart is Empty</Text>
          </View>
        ) : (
          <ScrollView style={styles.scrollArea} contentContainerStyle={{ paddingBottom: 120 }}>
            {/* Selected Items Section */}
            <View style={{padding: 16}}>
                <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: 12}}>
                    <View style={{width: 8, height: 8, borderRadius: 4, backgroundColor: '#16a34a', marginRight: 8}} />
                    <Text style={{fontSize: 16, fontWeight: 'bold', color: '#334155'}}>Selected items</Text>
                </View>

                {cartItems.map((item, idx) => (
                    <View key={idx} style={{marginBottom: 16, borderBottomWidth: 1, borderBottomColor: '#f1f5f9', paddingBottom: 16}}>
                        <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start'}}>
                            <Text style={{fontSize: 16, fontWeight: 'bold', color: '#1e293b', flex: 1}}>{item.dishName}</Text>
                            <View style={styles.stepperContainer}>
                                <TouchableOpacity onPress={() => handleQtyChange(item.id, -1, item.quantity)} style={styles.stepperBtn}><Text style={styles.stepperBtnText}>-</Text></TouchableOpacity>
                                <Text style={styles.stepperQtyText}>{item.quantity}</Text>
                                <TouchableOpacity onPress={() => handleQtyChange(item.id, 1, item.quantity)} style={styles.stepperBtn}><Text style={styles.stepperBtnText}>+</Text></TouchableOpacity>
                            </View>
                        </View>
                        <View style={{flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', marginTop: 12, gap: 12}}>
                            {item.offers && item.offers.map((o: any, oIdx: number) => (
                                <View key={oIdx} style={{flexDirection: 'row', alignItems: 'center'}}>
                                    <View style={{width: 4, height: 4, borderRadius: 2, backgroundColor: '#cbd5e1', marginRight: 6}} />
                                    <Text style={{fontSize: 13, color: '#475569'}}>{o.providerName} <Text style={{fontWeight: 'bold', color: '#1e293b'}}>Rs {o.price?.finalPayablePrice}</Text></Text>
                                </View>
                            ))}
                        </View>
                        <View style={{backgroundColor: '#fffbeb', borderWidth: 1, borderColor: '#fde68a', padding: 10, borderRadius: 8, marginTop: 12}}>
                            <Text style={{fontSize: 12, color: '#b45309'}}>This item may not be eligible for all platform coupons or discounts.</Text>
                        </View>
                    </View>
                ))}
            </View>

            {/* Price Comparison Section */}
            <View style={{paddingHorizontal: 16, paddingBottom: 16}}>
                <Text style={{fontSize: 18, fontWeight: 'bold', color: '#1e293b', marginBottom: 12}}>Price comparison</Text>

                {providers.map((prov, pIdx) => (
                    <View key={pIdx} style={{backgroundColor: '#fff', borderRadius: 12, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: '#e2e8f0'}}>
                        <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12}}>
                            <Text style={{fontSize: 16, fontWeight: 'bold', color: '#334155'}}>{prov.name}</Text>
                            <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                <View style={{backgroundColor: '#f1f5f9', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4, marginRight: 8}}>
                                    <Text style={{fontSize: 12, color: '#16a34a', fontWeight: 'bold'}}>Final price</Text>
                                </View>
                                <Text style={{fontSize: 12, color: '#64748b'}}>15-20 mins</Text>
                            </View>
                        </View>
                        <Text style={{fontSize: 28, fontWeight: 'bold', color: '#1e293b', marginBottom: 8}}>Rs {prov.total}</Text>
                        <Text style={{fontSize: 13, color: '#64748b', marginBottom: 16, lineHeight: 20}}>This total already includes delivery, taxes, fees, and any active savings. {prov.itemsCount} item{prov.itemsCount > 1 ? "s" : ""} can be moved to your {prov.name} cart.</Text>
                        
                        <TouchableOpacity 
                            style={{backgroundColor: prov.name.toLowerCase() === 'swiggy' ? '#1e293b' : prov.name.toLowerCase() === 'zomato' ? '#ef4444' : '#1e293b', paddingVertical: 14, borderRadius: 8, alignItems: 'center'}}
                            onPress={() => handleCheckoutPress(prov.id, prov.total, cartItems)}
                        >
                            <Text style={{color: '#fff', fontSize: 16, fontWeight: 'bold'}}>Transfer to {prov.name} cart</Text>
                        </TouchableOpacity>
                    </View>
                ))}
            </View>
          </ScrollView>
        )}
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  closeBtn: {
    backgroundColor: '#f1f5f9',
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeText: {
    fontSize: 16,
    color: '#64748b',
    fontWeight: 'bold',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  scrollArea: {
    flex: 1,
  },
  stepperContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  stepperBtn: {
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  stepperBtnText: {
    fontSize: 18,
    color: '#16a34a',
    fontWeight: 'bold',
  },
  stepperQtyText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1e293b',
    paddingHorizontal: 4,
  },
});
`;

fs.writeFileSync('apps/mobile/src/lib/UniversalCartModal.tsx', content);
console.log('Cart refactored!');
