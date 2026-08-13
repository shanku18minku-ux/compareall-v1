"use client";

import React, { useState, useEffect } from 'react';
import Navigation from '../../components/Navigation';
import { LocalStorageManager, ProviderConnection } from '@compareall/storage';
import { MOCK_PROVIDERS } from '../../lib/providers/mocks';

export default function ConnectedServicesPage() {
  const [connections, setConnections] = useState<ProviderConnection[]>([]);

  useEffect(() => {
    setConnections(LocalStorageManager.getConnections());
  }, []);

  const handleConnect = (providerId: string) => {
    LocalStorageManager.connectProvider(providerId);
    setConnections(LocalStorageManager.getConnections());
  };

  const handleDisconnect = (providerId: string) => {
    LocalStorageManager.disconnectProvider(providerId);
    setConnections(LocalStorageManager.getConnections());
  };

  return (
    <div className="container">
      <Navigation />
      <main style={{marginTop: '2rem'}}>
        <h2>Connected Services</h2>
        <div style={{background: '#fef08a', color: '#854d0e', padding: '1rem', borderRadius: '4px', marginBottom: '2rem'}}>
          <strong>âš ï¸ DEVELOPMENT / DEMO MODE</strong>
          <p style={{margin: '0.5rem 0 0 0'}}>
            This feature is currently in mock/demo state for architectural testing. CompareAll does NOT have actual access to your external accounts. Future versions will use authorized official APIs/OAuth.
          </p>
        </div>

        <p style={{color: 'var(--muted)', marginBottom: '2rem'}}>
          (Future Flow) Connect your accounts to view personalized discounts, subscriptions, and better matches.<br/>
          <strong>Privacy Promise:</strong> We will only use official OAuth when available. Passwords will never be stored.
        </p>

        <div className="provider-list">
          {MOCK_PROVIDERS.map(p => {
            const connection = connections.find(c => c.providerId === p.config.id);
            const isConnected = connection?.status === 'connected';
            const isConnecting = connection?.status === 'connecting';
            
            return (
              <div key={p.config.id} className="provider-card" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                <div>
                  <h4>{p.config.name}</h4>
                  <p style={{fontSize: '0.875rem', color: 'var(--muted)'}}>Category: {p.config.supportedCategories.join(', ')}</p>
                  <span style={{fontSize: '0.75rem', padding: '0.1rem 0.4rem', background: '#e5e7eb', borderRadius: '4px'}}>MOCK PROVIDER</span>
                </div>
                <div>
                  {isConnecting ? (
                    <button disabled style={{background: 'var(--muted)', color: 'white', padding: '0.5rem 1rem', borderRadius: '4px', border: 'none'}}>
                      Connecting...
                    </button>
                  ) : isConnected ? (
                    <button onClick={() => handleDisconnect(p.config.id)} style={{background: 'var(--danger)', color: 'white', padding: '0.5rem 1rem', borderRadius: '4px', border: 'none', cursor: 'pointer'}}>
                      Disconnect Demo
                    </button>
                  ) : (
                    <button onClick={() => {
                      // Simulate connecting state
                      LocalStorageManager.connectProvider(p.config.id, 'connecting');
                      setConnections(LocalStorageManager.getConnections());
                      setTimeout(() => {
                        LocalStorageManager.connectProvider(p.config.id, 'connected');
                        setConnections(LocalStorageManager.getConnections());
                      }, 800);
                    }} style={{background: 'var(--primary)', color: 'white', padding: '0.5rem 1rem', borderRadius: '4px', border: 'none', cursor: 'pointer'}}>
                      Connect Demo Account
                    </button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </main>
    </div>
  );
}

