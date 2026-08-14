import React from 'react';
import Navigation from '../../components/Navigation';
import Link from 'next/link';

export default function ProfilePage() {
  return (
    <div className="container" style={{ paddingBottom: '6rem' }}>
      <Navigation />
      
      <main style={{ marginTop: '2rem', maxWidth: '600px', margin: '2rem auto 0 auto' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '2rem', color: 'var(--foreground)' }}>
          Profile
        </h1>

        <div style={{
          background: 'white',
          padding: '1.5rem',
          borderRadius: '16px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
          marginBottom: '2rem',
          display: 'flex',
          alignItems: 'center',
          gap: '1rem'
        }}>
          <div style={{width: '64px', height: '64px', borderRadius: '50%', background: 'var(--muted-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem'}}>
            👤
          </div>
          <div>
            <h2 style={{fontSize: '1.25rem', fontWeight: 700, margin: 0}}>Guest User</h2>
            <p style={{color: 'var(--muted)', margin: 0}}>Local Profile</p>
          </div>
        </div>

        <div style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
          <Link href="/wishlist" style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            padding: '1rem 1.5rem',
            background: 'white',
            borderRadius: '16px',
            textDecoration: 'none',
            color: 'var(--foreground)',
            fontWeight: 600,
            boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
          }}>
            <span style={{fontSize: '1.5rem'}}>❤️</span>
            <span style={{flex: 1}}>My Wishlist</span>
            <span style={{color: 'var(--muted)'}}>➔</span>
          </Link>

          <Link href="/history" style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            padding: '1rem 1.5rem',
            background: 'white',
            borderRadius: '16px',
            textDecoration: 'none',
            color: 'var(--foreground)',
            fontWeight: 600,
            boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
          }}>
            <span style={{fontSize: '1.5rem'}}>🕐</span>
            <span style={{flex: 1}}>Search History</span>
            <span style={{color: 'var(--muted)'}}>➔</span>
          </Link>
        </div>
      </main>
    </div>
  );
}
