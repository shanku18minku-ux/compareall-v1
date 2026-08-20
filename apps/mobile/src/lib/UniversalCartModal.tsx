import React, { useState, useMemo } from 'react';
import { Modal, View, Text, TouchableOpacity, ScrollView, StyleSheet, SafeAreaView, Linking } from 'react-native';

export const UniversalCartModal = ({ visible, onClose, cartItems, onUpdateQuantity, onCheckout, connectedProviders }) => {
    const [detailBreakdown, setDetailBreakdown] = useState<string | null>(null);

    const formatETA = (dt) => {
      if (!dt) return '~30 mins';
      const s = String(dt).replace(/[?]/g, '').trim();
      return s || '~30 mins';
    };

    // Get all unique providers that have an offer for any item in the cart
    const availableProviders = useMemo(() => {
        const providers = new Set();
        cartItems.forEach(item => {
            if (item.offers) {
                item.offers.forEach(o => providers.add(o.providerName));
            }
        });
        return Array.from(providers);
    }, [cartItems]);

    // Calculate totals dynamically for each provider
    const providerTotals = useMemo(() => {
        const totals = {};
        availableProviders.forEach(p => {
            const providerName = String(p);
            const total = cartItems.reduce((acc, item) => {
                const o = item.offers ? item.offers.find(offer => offer.providerName === providerName) : null;
                // If the provider doesn't have this item, we should probably penalize or just add 0. 
                // For a proper UX, if an item is missing, it's 0 but we should ideally show a warning.
                return acc + ((o?.price?.finalPayablePrice || o?.price?.basePrice || 0) * item.quantity);
            }, 0);
            
            // Calculate base total (before discounts) to show savings
            const baseTotal = cartItems.reduce((acc, item) => {
                const o = item.offers ? item.offers.find(offer => offer.providerName === providerName) : null;
                return acc + ((o?.price?.basePrice || o?.price?.finalPayablePrice || 0) * item.quantity);
            }, 0);
            
            totals[providerName] = { 
                total, 
                baseTotal, 
                discount: baseTotal - total,
                deliveryFee: 30, // Mock generic fee
                taxes: 15      // Mock generic taxes
            };
        });
        return totals;
    }, [cartItems, availableProviders]);

    const renderDetailPopup = () => {
        if (!detailBreakdown || !providerTotals[detailBreakdown]) return null;
        
        const data = providerTotals[detailBreakdown];
        const finalToPay = data.total + data.deliveryFee + data.taxes;
        
        return (
            <Modal transparent visible={!!detailBreakdown} animationType="fade">
                <View style={styles.overlay}>
                    <View style={styles.detailBox}>
                        <View style={styles.detailHeader}>
                            <Text style={styles.detailTitle}>{detailBreakdown} Price Breakdown</Text>
                            <TouchableOpacity onPress={() => setDetailBreakdown(null)}>
                                <Text style={{fontSize: 20}}>✕</Text>
                            </TouchableOpacity>
                        </View>
                        
                        <View style={styles.detailRow}>
                            <Text>Item Total (Base)</Text>
                            <Text>₹{data.baseTotal}</Text>
                        </View>
                        <View style={styles.detailRow}>
                            <Text>Delivery Fee</Text>
                            <Text>₹{data.deliveryFee}</Text>
                        </View>
                        <View style={styles.detailRow}>
                            <Text style={{color: '#16a34a', fontWeight: '500'}}>Extra Discount</Text>
                            <Text style={{color: '#16a34a', fontWeight: '500'}}>-₹{data.discount}</Text>
                        </View>
                        <View style={styles.detailRow}>
                            <Text>GST & Charges</Text>
                            <Text>₹{data.taxes}</Text>
                        </View>
                        
                        <View style={[styles.detailRow, {borderTopWidth: 1, borderColor: '#e2e8f0', paddingTop: 10, marginTop: 10}]}>
                            <Text style={{fontWeight: 'bold'}}>To Pay</Text>
                            <Text style={{fontWeight: 'bold'}}>₹{finalToPay}</Text>
                        </View>
                    </View>
                </View>
            </Modal>
        );
    };

    return (
        <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
            <SafeAreaView style={styles.container}>
                <View style={{ flexDirection: 'row', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: '#f1f5f9', backgroundColor: '#fff' }}>
                  <TouchableOpacity onPress={onClose} style={{ marginRight: 12 }}>
                    <Text style={{ fontSize: 22, fontWeight: '300', color: '#000' }}>&#x2190;</Text>
                  </TouchableOpacity>
                  <Text style={{ fontSize: 20, fontWeight: '800', color: '#000', flex: 1 }}>Cart Compare</Text>
                  <TouchableOpacity onPress={onClose}>
                    <Text style={{ fontSize: 16, color: '#64748b' }}>Close</Text>
                  </TouchableOpacity>
                </View>
                
                <ScrollView contentContainerStyle={{padding: 16}}>
                    <Text style={styles.sectionTitle}>Selected items</Text>
                    {cartItems.map((item, idx) => (
                        <View key={idx} style={styles.cartItem}>
                            <View style={{flex: 1}}>
                                <Text style={styles.itemName}>{item.title}</Text>
                            </View>
                            <View style={styles.stepper}>
                                <TouchableOpacity onPress={() => onUpdateQuantity(item.id, item.quantity - 1)} style={styles.stepBtn}>
                                    <Text style={{fontSize: 16, fontWeight: 'bold'}}>-</Text>
                                </TouchableOpacity>
                                <Text style={styles.stepVal}>{item.quantity}</Text>
                                <TouchableOpacity onPress={() => onUpdateQuantity(item.id, item.quantity + 1)} style={styles.stepBtn}>
                                    <Text style={{fontSize: 16, fontWeight: 'bold'}}>+</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    ))}

                    <Text style={[styles.sectionTitle, {marginTop: 24}]}>Price comparison</Text>
                    
                    {availableProviders.map((providerName) => {
                        const data = providerTotals[String(providerName)];
                          if (!data) return null;
                          const finalToPay = data.total + data.deliveryFee + data.taxes;
                          let providerEta = "30 mins";
                          for (let i=0; i<cartItems.length; i++) {
                              let off = (cartItems[i].offers || []).find(o => String(o.providerName) === String(providerName));
                              if (off && off.deliveryTime) { providerEta = off.deliveryTime; break; }
                          }
                        
                        return (
                            <View key={String(providerName)} style={styles.priceCard}>
                                <View style={styles.cardHeader}>
                                    <Text style={styles.providerName}>{String(providerName)}</Text>
                                    <Text style={styles.timeTag}>🕒 {formatETA(providerEta)}</Text>
                                </View>
                                <View style={styles.priceRow}>
                                    <Text style={styles.finalPrice}>₹{finalToPay}</Text>
                                    <TouchableOpacity style={styles.detailBtn} onPress={() => setDetailBreakdown(String(providerName))}>
                                        <Text style={styles.detailBtnText}>Detail</Text>
                                    </TouchableOpacity>
                                </View>
                                <TouchableOpacity 
                                    style={styles.transferBtn} 
                                    onPress={() => onCheckout(String(providerName))}
                                >
                                    <Text style={styles.transferText}>Transfer to {String(providerName)} cart</Text>
                                </TouchableOpacity>
                            </View>
                        );
                    })}
                </ScrollView>
                {renderDetailPopup()}
            </SafeAreaView>
        </Modal>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f8fafc' },
    header: { flexDirection: 'row', justifyContent: 'space-between', padding: 16, backgroundColor: '#fff', borderBottomWidth: 1, borderColor: '#e2e8f0', alignItems: 'center' },
    title: { fontSize: 18, fontWeight: 'bold', color: '#0f172a' },
    close: { fontSize: 20, color: '#64748b', paddingHorizontal: 4 },
    sectionTitle: { fontSize: 14, fontWeight: '600', color: '#64748b', marginBottom: 12, textTransform: 'uppercase', letterSpacing: 0.5 },
    cartItem: { flexDirection: 'row', backgroundColor: '#fff', padding: 16, borderRadius: 12, marginBottom: 8, alignItems: 'center', shadowColor: '#000', shadowOffset: {width:0,height:1}, shadowOpacity: 0.05, shadowRadius: 2, elevation: 1 },
    itemName: { fontSize: 15, fontWeight: '600', color: '#1e293b' },
    stepper: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f1f5f9', borderRadius: 8, borderWidth: 1, borderColor: '#e2e8f0' },
    stepBtn: { paddingHorizontal: 12, paddingVertical: 6 },
    stepVal: { fontWeight: 'bold', fontSize: 15, color: '#0f172a', width: 24, textAlign: 'center' },
    
    priceCard: { backgroundColor: '#fff', padding: 16, borderRadius: 12, marginBottom: 16, borderWidth: 1, borderColor: '#e2e8f0', shadowColor: '#000', shadowOffset: {width:0,height:2}, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 },
    cardHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12, alignItems: 'center' },
    providerName: { fontSize: 18, fontWeight: 'bold', color: '#0f172a' },
    timeTag: { fontSize: 11, color: '#dc2626', backgroundColor: '#fee2e2', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, fontWeight: 'bold', overflow: 'hidden' },
    priceRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
    finalPrice: { fontSize: 28, fontWeight: '900', color: '#000', marginRight: 12 },
    detailBtn: { backgroundColor: '#f8fafc', paddingHorizontal: 14, paddingVertical: 6, borderRadius: 12, borderWidth: 1, borderColor: '#e2e8f0' },
    detailBtnText: { fontSize: 13, fontWeight: '700', color: '#3b82f6' },
    transferBtn: { backgroundColor: '#0f172a', paddingVertical: 14, borderRadius: 8, alignItems: 'center', shadowColor: '#000', shadowOffset: {width:0,height:2}, shadowOpacity: 0.1, shadowRadius: 3, elevation: 2 },
    transferText: { color: '#fff', fontWeight: 'bold', fontSize: 15, letterSpacing: 0.3 },
    
    overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', alignItems: 'center' },
    detailBox: { width: '85%', backgroundColor: '#fff', borderRadius: 16, padding: 24, shadowColor: '#000', shadowOffset: {width:0,height:10}, shadowOpacity: 0.25, shadowRadius: 15, elevation: 10 },
    detailHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20, alignItems: 'center' },
    detailTitle: { fontSize: 18, fontWeight: 'bold', color: '#0f172a' },
    detailRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 }
});
