"use client";

import React, { useMemo } from 'react';
import Navigation from '../../components/Navigation';
import { useStorage } from '../../hooks/useStorage';
import Link from 'next/link';

export default function CartPage() {
  const { cart, actions, isHydrated } = useStorage();

  // Group cart items by provider
  const groupedCart = useMemo(() => {
    return cart.reduce((acc, item) => {
      if (!acc[item.providerName]) {
        acc[item.providerName] = {
          providerId: item.providerId,
          items: [],
          total: 0
        };
      }
      acc[item.providerName].items.push(item);
      acc[item.providerName].total += (item.price * item.quantity);
      return acc;
    }, {} as Record<string, { providerId: string, items: typeof cart, total: number }>);
  }, [cart]);

  if (!isHydrated) return null;

  return (
    <div className="container" style={{ paddingBottom: '6rem' }}>
      <Navigation />
      
      <main style={{ marginTop: '2rem', maxWidth: '800px', margin: '2rem auto 0 auto' }}>
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem'}}>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, margin: 0, color: 'var(--foreground)' }}>
            Universal Cart
          </h1>
          {cart.length > 0 && (
            <button 
              onClick={actions.clearCart}
              style={{background: 'none', border: 'none', color: '#ef4444', fontWeight: 600, cursor: 'pointer'}}
            >
              Clear All
            </button>
          )}
        </div>

        {cart.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem 1rem', background: 'white', borderRadius: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
            <div style={{fontSize: '3rem', marginBottom: '1rem'}}>🛒</div>
            <h2 style={{fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem'}}>Your cart is empty</h2>
            <p style={{color: 'var(--muted)', marginBottom: '1.5rem'}}>Search for food or groceries and add them to your universal cart.</p>
            <Link href="/" style={{
              display: 'inline-block',
              background: 'var(--primary)',
              color: 'white',
              padding: '0.75rem 2rem',
              borderRadius: '99px',
              fontWeight: 600,
              textDecoration: 'none'
            }}>
              Start Shopping
            </Link>
          </div>
        ) : (
          <div style={{display: 'flex', flexDirection: 'column', gap: '1.5rem'}}>
            {Object.entries(groupedCart).map(([providerName, group]) => (
              <div key={providerName} style={{ background: 'white', borderRadius: '16px', padding: '1.5rem', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                <h2 style={{fontSize: '1.25rem', fontWeight: 700, margin: '0 0 1rem 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem'}}>
                  <span>{providerName}</span>
                  <span style={{fontSize: '0.9rem', color: 'var(--muted)', fontWeight: 500}}>{group.items.length} items</span>
                </h2>
                
                <div style={{display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem'}}>
                  {group.items.map(item => (
                    <div key={item.id} style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                      <div style={{flex: 1}}>
                        <div style={{fontWeight: 600, fontSize: '0.95rem'}}>{item.title}</div>
                        <div style={{color: 'var(--muted)', fontSize: '0.85rem'}}>₹{item.price} each</div>
                      </div>
                      
                      <div style={{display: 'flex', alignItems: 'center', gap: '1rem'}}>
                        <div style={{display: 'flex', alignItems: 'center', background: 'var(--muted-bg)', borderRadius: '99px'}}>
                          <button 
                            onClick={() => actions.updateCartQuantity(item.id, item.providerId, item.quantity - 1)}
                            style={{width: '28px', height: '28px', borderRadius: '50%', border: 'none', background: 'white', margin: '2px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 1px 3px rgba(0,0,0,0.1)'}}
                          >-</button>
                          <span style={{padding: '0 0.5rem', fontWeight: 600, fontSize: '0.9rem', minWidth: '20px', textAlign: 'center'}}>{item.quantity}</span>
                          <button 
                            onClick={() => actions.updateCartQuantity(item.id, item.providerId, item.quantity + 1)}
                            style={{width: '28px', height: '28px', borderRadius: '50%', border: 'none', background: 'white', margin: '2px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 1px 3px rgba(0,0,0,0.1)'}}
                          >+</button>
                        </div>
                        <div style={{fontWeight: 700, minWidth: '60px', textAlign: 'right'}}>
                          ₹{item.price * item.quantity}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px dotted var(--border)', paddingTop: '1rem'}}>
                  <div>
                    <div style={{fontSize: '0.85rem', color: 'var(--muted)'}}>Subtotal</div>
                    <div style={{fontSize: '1.25rem', fontWeight: 800, color: 'var(--foreground)'}}>₹{group.total}</div>
                  </div>
                  <button 
                    onClick={() => {
                       // Demo checkout alert since we can't do cross-platform native checkout yet without real APIs
                       alert(`Proceeding to checkout at ${providerName}...\nIn a real app, this would open ${providerName} with these items pre-added, or use their order API.`);
                    }}
                    style={{
                      background: 'var(--primary)',
                      color: 'white',
                      border: 'none',
                      padding: '0.75rem 1.5rem',
                      borderRadius: '99px',
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                  >
                    Checkout at {providerName}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
