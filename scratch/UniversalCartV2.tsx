// @ts-nocheck
import React, { useState } from 'react';
import { Modal, View, Text, TouchableOpacity, ScrollView, StyleSheet, SafeAreaView } from 'react-native';

export const UniversalCartModal = ({ visible, onClose, cartItems, onUpdateQuantity, onCheckout, connectedProviders }) => {
    const [detailBreakdown, setDetailBreakdown] = useState(null);

    const swiggyTotal = cartItems.reduce((acc, item) => {
        const o = item.offers.find(o => o.providerName === 'Swiggy');
        return acc + ((o?.price?.finalPayablePrice || o?.price?.basePrice || 0) * item.quantity);
    }, 0);

    const zomatoTotal = cartItems.reduce((acc, item) => {
        const o = item.offers.find(o => o.providerName === 'Zomato');
        return acc + ((o?.price?.finalPayablePrice || o?.price?.basePrice || 0) * item.quantity);
    }, 0);

    const renderDetailPopup = () => {
        if (!detailBreakdown) return null;
        const total = detailBreakdown === 'Swiggy' ? swiggyTotal : zomatoTotal;
        return (
            <Modal transparent visible={!!detailBreakdown} animationType="fade">
                <View style={styles.overlay}>
                    <View style={styles.detailBox}>
                        <View style={styles.detailHeader}>
                            <Text style={styles.detailTitle}>{detailBreakdown} Price Breakdown</Text>
                            <TouchableOpacity onPress={() => setDetailBreakdown(null)}><Text style={{fontSize: 20}}>?</Text></TouchableOpacity>
                        </View>
                        <View style={styles.detailRow}><Text>Item Total</Text><Text>?{total}</Text></View>
                        <View style={styles.detailRow}><Text>Delivery Fee</Text><Text>?30</Text></View>
                        <View style={styles.detailRow}><Text style={{color: '#16a34a'}}>Extra Discount</Text><Text style={{color: '#16a34a'}}>-?30</Text></View>
                        <View style={styles.detailRow}><Text>GST & Charges</Text><Text>?15</Text></View>
                        <View style={[styles.detailRow, {borderTopWidth: 1, borderColor: '#e2e8f0', paddingTop: 10, marginTop: 10}]}>
                            <Text style={{fontWeight: 'bold'}}>To Pay</Text>
                            <Text style={{fontWeight: 'bold'}}>?{total + 15}</Text>
                        </View>
                    </View>
                </View>
            </Modal>
        );
    };

    return (
        <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
            <SafeAreaView style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.title}>Cart comparison</Text>
                    <TouchableOpacity onPress={onClose}><Text style={styles.close}>?</Text></TouchableOpacity>
                </View>
                
                <ScrollView contentContainerStyle={{padding: 16}}>
                    <Text style={styles.sectionTitle}>Selected items</Text>
                    {cartItems.map((item, idx) => (
                        <View key={idx} style={styles.cartItem}>
                            <View style={{flex: 1}}>
                                <Text style={styles.itemName}>{item.title}</Text>
                            </View>
                            <View style={styles.stepper}>
                                <TouchableOpacity onPress={() => onUpdateQuantity(item.id, item.quantity - 1)} style={styles.stepBtn}><Text>-</Text></TouchableOpacity>
                                <Text style={styles.stepVal}>{item.quantity}</Text>
                                <TouchableOpacity onPress={() => onUpdateQuantity(item.id, item.quantity + 1)} style={styles.stepBtn}><Text>+</Text></TouchableOpacity>
                            </View>
                        </View>
                    ))}

                    <Text style={[styles.sectionTitle, {marginTop: 24}]}>Price comparison</Text>
                    
                    {/* Swiggy Card */}
                    <View style={styles.priceCard}>
                        <View style={styles.cardHeader}>
                            <Text style={styles.providerName}>Swiggy</Text>
                            <Text style={styles.timeTag}>? 30-40 MINS</Text>
                        </View>
                        <View style={styles.priceRow}>
                            <Text style={styles.finalPrice}>?{swiggyTotal + 15}</Text>
                            <TouchableOpacity style={styles.detailBtn} onPress={() => setDetailBreakdown('Swiggy')}>
                                <Text style={styles.detailBtnText}>Detail</Text>
                            </TouchableOpacity>
                        </View>
                        <TouchableOpacity style={styles.transferBtn} onPress={() => onCheckout('Swiggy')}>
                            <Text style={styles.transferText}>Transfer to Swiggy cart</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Zomato Card */}
                    <View style={styles.priceCard}>
                        <View style={styles.cardHeader}>
                            <Text style={styles.providerName}>Zomato</Text>
                            <Text style={styles.timeTag}>? 35-40 MINS</Text>
                        </View>
                        <View style={styles.priceRow}>
                            <Text style={styles.finalPrice}>?{zomatoTotal + 15}</Text>
                            <TouchableOpacity style={styles.detailBtn} onPress={() => setDetailBreakdown('Zomato')}>
                                <Text style={styles.detailBtnText}>Detail</Text>
                            </TouchableOpacity>
                        </View>
                        <TouchableOpacity style={styles.transferBtn} onPress={() => onCheckout('Zomato')}>
                            <Text style={styles.transferText}>Transfer to Zomato cart</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
                {renderDetailPopup()}
            </SafeAreaView>
        </Modal>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f8fafc' },
    header: { flexDirection: 'row', justifyContent: 'space-between', padding: 16, backgroundColor: '#fff', borderBottomWidth: 1, borderColor: '#e2e8f0' },
    title: { fontSize: 18, fontWeight: 'bold' },
    close: { fontSize: 20 },
    sectionTitle: { fontSize: 14, color: '#64748b', marginBottom: 12 },
    cartItem: { flexDirection: 'row', backgroundColor: '#fff', padding: 16, borderRadius: 12, marginBottom: 8, alignItems: 'center' },
    itemName: { fontSize: 16, fontWeight: '600' },
    stepper: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f1f5f9', borderRadius: 8 },
    stepBtn: { paddingHorizontal: 12, paddingVertical: 6 },
    stepVal: { fontWeight: 'bold' },
    
    priceCard: { backgroundColor: '#fff', padding: 16, borderRadius: 12, marginBottom: 16, borderWidth: 1, borderColor: '#e2e8f0' },
    cardHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
    providerName: { fontSize: 16, fontWeight: 'bold', color: '#0f172a' },
    timeTag: { fontSize: 12, color: '#dc2626', backgroundColor: '#fee2e2', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 4, fontWeight: 'bold' },
    priceRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
    finalPrice: { fontSize: 28, fontWeight: 'bold', color: '#000', marginRight: 12 },
    detailBtn: { backgroundColor: '#f1f5f9', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 12 },
    detailBtnText: { fontSize: 12, fontWeight: '600', color: '#3b82f6' },
    transferBtn: { backgroundColor: '#000', paddingVertical: 14, borderRadius: 8, alignItems: 'center' },
    transferText: { color: '#fff', fontWeight: 'bold', fontSize: 14 },
    
    overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
    detailBox: { width: '85%', backgroundColor: '#fff', borderRadius: 16, padding: 20 },
    detailHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 },
    detailTitle: { fontSize: 18, fontWeight: 'bold' },
    detailRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }
});
