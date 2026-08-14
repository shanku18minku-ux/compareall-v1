"use client";

export default function OfflinePage() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'system-ui, sans-serif',
      background: '#f8fafc',
      gap: '1rem',
      textAlign: 'center',
      padding: '2rem'
    }}>
      <div style={{ fontSize: '4rem' }}>📡</div>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1e293b' }}>You're offline</h1>
      <p style={{ color: '#64748b', maxWidth: '300px' }}>
        Please check your internet connection and try again.
      </p>
      <button
        onClick={() => window.location.reload()}
        style={{
          background: '#3b82f6',
          color: 'white',
          border: 'none',
          padding: '0.75rem 1.5rem',
          borderRadius: '12px',
          fontWeight: 600,
          cursor: 'pointer',
          fontSize: '0.95rem'
        }}
      >
        Try Again
      </button>
    </div>
  );
}
