import React from 'react';
import Navigation from '../../components/Navigation';
import QuickConnect from '../../components/QuickConnect';

export default function ConnectedServicesPage() {
  return (
    <div>
      <Navigation />
      <div style={{ width: '100%', height: 'calc(100vh - 120px)' }}>
        <main style={{ height: '100%' }}>
          <QuickConnect />
        </main>
      </div>
    </div>
  );
}
