"use client";

import React, { useState, useEffect } from 'react';
import Navigation from '../../components/Navigation';
import { LocalStorageManager, SearchHistoryItem } from '@compareall/storage';

export default function HistoryPage() {
  const [history, setHistory] = useState<SearchHistoryItem[]>([]);

  useEffect(() => {
    setHistory(LocalStorageManager.getHistory());
  }, []);

  const handleClear = () => {
    LocalStorageManager.clearHistory();
    setHistory([]);
  };

  return (
    <div className="container">
      <Navigation />
      <main style={{marginTop: '2rem'}}>
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem'}}>
          <div>
            <h2>Search History</h2>
            <p style={{color: 'var(--muted)'}}>Your recent searches.</p>
          </div>
          {history.length > 0 && (
            <button onClick={handleClear} style={{background: 'var(--danger)', color: 'white', padding: '0.5rem 1rem', borderRadius: '4px', border: 'none', cursor: 'pointer'}}>
              Clear History
            </button>
          )}
        </div>

        {history.length === 0 ? (
          <p>Your search history is empty.</p>
        ) : (
          <div className="provider-list">
            {history.map(item => (
              <div key={item.id} className="provider-card" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                <div>
                  <h4 style={{fontSize: '1.25rem'}}>{item.term}</h4>
                  <p style={{fontSize: '0.75rem', color: 'var(--muted)'}}>Searched on: {new Date(item.timestamp).toLocaleString()}</p>
                </div>
                <div>
                  <a href={`/?q=${encodeURIComponent(item.term)}`} style={{display: 'inline-block', background: 'var(--primary)', color: 'white', padding: '0.5rem 1rem', borderRadius: '4px', textDecoration: 'none'}}>
                    Repeat Search
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

