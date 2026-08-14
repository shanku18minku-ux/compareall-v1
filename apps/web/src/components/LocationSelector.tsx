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
      async (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        
        let label = 'Current GPS Location';
        try {
          // Changed zoom to 18 for building/street level precision
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18`);
          if (res.ok) {
            const data = await res.json();
            if (data && data.address) {
              const a = data.address;
              // Extract the most granular details available
              const exactPoint = a.amenity || a.building || a.shop || a.house_number || a.house_name || '';
              const localArea = a.road || a.neighbourhood || a.suburb || a.residential || '';
              const city = a.city || a.town || a.village || a.county || a.state_district || '';
              
              const parts = [];
              if (exactPoint) parts.push(exactPoint);
              if (localArea) parts.push(localArea);
              if (city) parts.push(city);
              if (!city && a.state) parts.push(a.state); // fallback
              
              if (parts.length > 0) {
                label = parts.join(', ');
              } else if (data.display_name) {
                // Fallback to a truncated display name
                label = data.display_name.split(',').slice(0, 3).join(', ');
              }
            }
          }
        } catch (e) {
          console.error("Reverse geocoding failed", e);
        }

        setIsLocating(false);
        onLocationChange({
          lat,
          lng,
          label
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
    <div className="location-selector" style={{ background: '#ffffff', padding: '1rem 0.5rem', marginBottom: '1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{color: '#ef4444', fontSize: '1.5rem'}}>📍</span>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <strong style={{fontSize: '1.1rem', fontWeight: 800, color: '#171717'}}>Deliver At</strong>
              <span style={{fontSize: '0.8rem', color: '#171717'}}>▼</span>
            </div>
            <span style={{ color: 'var(--muted)', fontWeight: '500', fontSize: '0.85rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '200px' }}>
              {location ? location.label : 'Select your location...'}
            </span>
          </div>
        </div>
        
        <button onClick={requestGPS} disabled={isLocating} style={{ background: '#f3f4f6', color: '#171717', padding: '0.6rem', borderRadius: '50%', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '40px', height: '40px' }}>
          <span style={{fontSize: '1.2rem'}}>{isLocating ? '⌛' : '🧭'}</span>
        </button>
      </div>

      {/* Manual Input (only shows if they tap on location, but for now we keep it visible as a small bar or hide it behind a state. Actually, let's just make it a clean secondary bar below) */}
      <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
        <input 
          type="text" 
          placeholder="Enter Pincode or City manually"
          value={manualQuery}
          onChange={e => setManualQuery(e.target.value)}
          style={{ flex: 1, padding: '0.8rem 1rem', borderRadius: '12px', border: '1px solid #e5e7eb', background: '#ffffff', fontSize: '0.9rem', outline: 'none' }}
        />
        <button onClick={handleManualSet} style={{ background: '#171717', color: '#ffffff', padding: '0.8rem 1.25rem', borderRadius: '12px', border: 'none', cursor: 'pointer', fontWeight: 600 }}>
          Set
        </button>
      </div>
      
      {error && <div style={{ color: 'red', fontSize: '0.8rem', marginTop: '0.5rem' }}>{error}</div>}
    </div>
  );
}
