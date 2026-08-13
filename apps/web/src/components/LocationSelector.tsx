import React, { useState } from 'react';
import { LocationContext } from '@compareall/shared-types';

interface LocationSelectorProps {
  location: LocationContext | null;
  onLocationChange: (loc: LocationContext) => void;
}

export default function LocationSelector({ location, onLocationChange }: LocationSelectorProps) {
  const [isLocating, setIsLocating] = useState(false);
  const [manualQuery, setManualQuery] = useState('');
  const [error, setError] = useState('');

  const requestGPS = () => {
    if (typeof navigator === 'undefined' || !navigator.geolocation) {
      setError('Geolocation not supported by browser.');
      return;
    }
    
    setIsLocating(true);
    setError('');
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setIsLocating(false);
        onLocationChange({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          label: 'Current GPS Location'
        });
      },
      (err) => {
        setIsLocating(false);
        setError('Location access denied or failed.');
      }
    );
  };

  const handleManualSet = () => {
    if (!manualQuery.trim()) return;
    onLocationChange({
      pincode: manualQuery.trim(),
      label: manualQuery.trim()
    });
    setManualQuery('');
    setError('');
  };

  return (
    <div className="location-selector" style={{ background: 'var(--card-bg)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border)', marginBottom: '1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
        <div>
          <strong>Deliver/Search At: </strong>
          <span style={{ color: 'var(--primary)', fontWeight: '500' }}>{location ? location.label : 'Select location'}</span>
        </div>
        <button onClick={requestGPS} disabled={isLocating} style={{ background: 'var(--foreground)', color: 'white', padding: '0.4rem 0.8rem', borderRadius: '4px', border: 'none', cursor: 'pointer' }}>
          {isLocating ? 'Detecting...' : '📍 Use GPS'}
        </button>
      </div>
      
      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <input 
          type="text" 
          placeholder="Enter Pincode or City manually"
          value={manualQuery}
          onChange={e => setManualQuery(e.target.value)}
          style={{ flex: 1, padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border)' }}
        />
        <button onClick={handleManualSet} style={{ background: 'var(--border)', color: 'var(--foreground)', padding: '0.5rem 1rem', borderRadius: '4px', border: 'none', cursor: 'pointer' }}>
          Set
        </button>
      </div>
      
      {error && <div style={{ color: 'red', fontSize: '0.8rem', marginTop: '0.5rem' }}>{error}</div>}
    </div>
  );
}
