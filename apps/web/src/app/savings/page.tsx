"use client";

import React, { useMemo } from 'react';
import Navigation from '../../components/Navigation';
import { useStorage } from '../../hooks/useStorage';

export default function SavingsPage() {
  const { cart, isHydrated } = useStorage();

  const { totalSavings, categorySavings, activeDealsCount } = useMemo(() => {
    let total = 0;
    const catSavings: Record<string, number> = {};

    cart.forEach(item => {
      const savings = ((item.originalPrice || item.price) - item.price) * item.quantity;
      if (savings > 0) {
        total += savings;
        const cat = item.category || 'other';
        catSavings[cat] = (catSavings[cat] || 0) + savings;
      }
    });

    return { totalSavings: total, categorySavings: catSavings, activeDealsCount: cart.length };
  }, [cart]);

  const CATEGORY_ICONS: Record<string, string> = {
    'all': '🔍',
    'food': '🍔',
    'grocery': '🛒',
    'shopping': '🛍️',
    'medicine': '💊',
    'services': '🔧',
    'travel': '✈️',
    'cabs': '🚕',
    'other': '📦'
  };

  const CATEGORY_LABELS: Record<string, string> = {
    'all': 'All',
    'food': 'Food',
    'grocery': 'Groceries',
    'shopping': 'Shopping',
    'medicine': 'Medicine',
    'services': 'Local Services',
    'travel': 'Tour and Travel',
    'cabs': 'Cabs',
    'other': 'Other'
  };

  if (!isHydrated) return null;

  return (
    <div className="container" style={{ paddingBottom: '6rem' }}>
      <Navigation />
      
      <main style={{ paddingTop: '1rem', width: '100%', padding: '0 1rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, margin: '0 0 2rem 0', color: '#171717' }}>
          Your Savings Overview
        </h1>

        <div style={{ background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)', borderRadius: '16px', padding: '1.5rem', color: 'white', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <div>
              <p style={{ margin: 0, fontSize: '0.85rem', color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Total Savings</p>
              <h2 style={{ margin: '0.2rem 0 0 0', fontSize: '2.5rem', fontWeight: 800, color: '#4ade80' }}>₹{totalSavings.toLocaleString()}</h2>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.1)', padding: '0.75rem', borderRadius: '12px', textAlign: 'center' }}>
              <span style={{ fontSize: '1.5rem', display: 'block' }}>🎉</span>
              <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>{activeDealsCount} Active Deals</span>
            </div>
          </div>

          <p style={{ margin: '0 0 0.75rem 0', fontSize: '0.85rem', color: '#cbd5e1', fontWeight: 600 }}>Category wise breakdown</p>
          
          {Object.keys(categorySavings).length > 0 ? (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              {Object.entries(categorySavings).map(([cat, amount]) => (
                <div key={cat} style={{ background: 'rgba(255,255,255,0.05)', padding: '0.75rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                    <span style={{ fontSize: '1.2rem' }}>{CATEGORY_ICONS[cat] || '📦'}</span>
                    <span style={{ fontSize: '0.8rem', color: '#cbd5e1', fontWeight: 500 }}>{CATEGORY_LABELS[cat] || cat}</span>
                  </div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff' }}>₹{amount.toLocaleString()}</div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ background: 'rgba(255,255,255,0.05)', padding: '1rem', borderRadius: '12px', border: '1px dashed rgba(255,255,255,0.2)', textAlign: 'center', color: '#94a3b8' }}>
              No category savings yet. Add items to cart to start saving!
            </div>
          )}
        </div>

        <div style={{ marginTop: '2rem', padding: '1.5rem', background: '#f8fafc', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#334155', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '1.2rem' }}>💡</span> How it works
          </h3>
          <p style={{ fontSize: '0.85rem', color: '#64748b', lineHeight: 1.5, margin: 0 }}>
            Your savings are automatically calculated by comparing the original price across providers with the lowest price you actually pay when adding deals to your cart.
          </p>
        </div>
      </main>
    </div>
  );
}
