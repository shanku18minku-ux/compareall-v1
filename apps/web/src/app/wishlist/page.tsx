"use client";

import React, { useState, useEffect } from 'react';
import Navigation from '../../components/Navigation';
import { LocalStorageManager, WishlistItem } from '@compareall/storage';

export default function WishlistPage() {
  const [items, setItems] = useState<WishlistItem[]>([]);

  useEffect(() => {
    setItems(LocalStorageManager.getWishlist());
  }, []);

  const handleRemove = (id: string) => {
    LocalStorageManager.toggleWishlist({ id, title: '', category: '' }); // Toggle removes it if exists
    setItems(LocalStorageManager.getWishlist());
  };

  return (
    <div className="container">
      <Navigation />
      <main style={{marginTop: '2rem'}}>
        <h2>Your Wishlist</h2>
        <p style={{color: 'var(--muted)', marginBottom: '2rem'}}>Saved comparisons for later.</p>

        {items.length === 0 ? (
          <p>Your wishlist is empty.</p>
        ) : (
          <div className="provider-list">
            {items.map(item => (
              <div key={item.id} className="provider-card" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                <div>
                  <span className="status-badge" style={{marginBottom: '0.5rem'}}>{item.category}</span>
                  <h4>{item.title}</h4>
                  <p style={{fontSize: '0.75rem', color: 'var(--muted)'}}>Saved on: {new Date(item.addedAt).toLocaleDateString()}</p>
                </div>
                <div>
                  <button onClick={() => handleRemove(item.id)} style={{background: 'var(--danger)', color: 'white', padding: '0.5rem 1rem', borderRadius: '4px', border: 'none', cursor: 'pointer'}}>
                    Remove
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

