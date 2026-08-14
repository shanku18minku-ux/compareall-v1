"use client";

import React, { useState } from 'react';

interface OTPModalProps {
  providerName: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function OTPModal({ providerName, isOpen, onClose, onSuccess }: OTPModalProps) {
  const [step, setStep] = useState<1 | 2>(1);
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.length < 10) {
      alert("Please enter a valid 10-digit phone number.");
      return;
    }
    setIsLoading(true);
    // Simulate network delay
    setTimeout(() => {
      setIsLoading(false);
      setStep(2);
    }, 1000);
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length < 4) {
      alert("Please enter the OTP.");
      return;
    }
    setIsLoading(true);
    // Simulate network delay
    setTimeout(() => {
      setIsLoading(false);
      onSuccess();
      onClose();
      // Reset for next time
      setStep(1);
      setPhone('');
      setOtp('');
    }, 1500);
  };

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      display: 'flex', justifyContent: 'center', alignItems: 'center',
      zIndex: 1000,
      padding: '1rem'
    }}>
      <div style={{
        background: 'var(--card-bg)',
        width: '100%', maxWidth: '400px',
        borderRadius: '12px',
        padding: '2rem',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        position: 'relative',
        color: 'var(--foreground)'
      }}>
        <button 
          onClick={onClose}
          style={{
            position: 'absolute', top: '1rem', right: '1rem',
            background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer',
            color: 'var(--muted)'
          }}
        >
          &times;
        </button>

        <h2 style={{marginTop: 0, marginBottom: '0.5rem'}}>Connect {providerName}</h2>
        <p style={{color: 'var(--muted)', fontSize: '0.875rem', marginBottom: '1.5rem'}}>
          We use your number to fetch {providerName} specific discounts. <strong>Your credentials will only be saved locally on this device.</strong>
        </p>

        {step === 1 ? (
          <form onSubmit={handleSendOtp}>
            <div style={{marginBottom: '1.5rem'}}>
              <label style={{display: 'block', fontSize: '0.875rem', fontWeight: 'bold', marginBottom: '0.5rem'}}>Phone Number</label>
              <div style={{display: 'flex'}}>
                <span style={{
                  padding: '0.75rem', background: 'var(--background)', 
                  border: '1px solid var(--border)', borderRight: 'none', 
                  borderRadius: '6px 0 0 6px', color: 'var(--muted)'
                }}>+91</span>
                <input 
                  type="tel" 
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                  placeholder="Enter your registered number"
                  style={{
                    flex: 1, padding: '0.75rem', 
                    border: '1px solid var(--border)', borderRadius: '0 6px 6px 0',
                    fontSize: '1rem', background: 'var(--background)', color: 'var(--foreground)'
                  }}
                  autoFocus
                />
              </div>
            </div>
            <button 
              type="submit" 
              disabled={isLoading || phone.length !== 10}
              style={{
                width: '100%', padding: '0.75rem', 
                background: 'var(--primary)', color: 'white', 
                border: 'none', borderRadius: '6px', 
                fontSize: '1rem', fontWeight: 'bold',
                cursor: isLoading || phone.length !== 10 ? 'not-allowed' : 'pointer',
                opacity: isLoading || phone.length !== 10 ? 0.7 : 1
              }}
            >
              {isLoading ? 'Sending OTP...' : 'Get OTP'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp}>
            <div style={{marginBottom: '1.5rem'}}>
              <label style={{display: 'block', fontSize: '0.875rem', fontWeight: 'bold', marginBottom: '0.5rem'}}>Enter OTP</label>
              <input 
                type="text" 
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="Enter 6-digit OTP"
                style={{
                  width: '100%', padding: '0.75rem', 
                  border: '1px solid var(--border)', borderRadius: '6px',
                  fontSize: '1rem', textAlign: 'center', letterSpacing: '0.5rem',
                  background: 'var(--background)', color: 'var(--foreground)'
                }}
                autoFocus
              />
              <p style={{fontSize: '0.75rem', color: 'var(--muted)', marginTop: '0.5rem', textAlign: 'center'}}>
                OTP sent to +91 {phone}. <button type="button" onClick={() => setStep(1)} style={{background:'none', border:'none', color:'var(--primary)', textDecoration:'underline', cursor:'pointer'}}>Change</button>
              </p>
            </div>
            <button 
              type="submit" 
              disabled={isLoading || otp.length < 4}
              style={{
                width: '100%', padding: '0.75rem', 
                background: 'var(--primary)', color: 'white', 
                border: 'none', borderRadius: '6px', 
                fontSize: '1rem', fontWeight: 'bold',
                cursor: isLoading || otp.length < 4 ? 'not-allowed' : 'pointer',
                opacity: isLoading || otp.length < 4 ? 0.7 : 1
              }}
            >
              {isLoading ? 'Verifying & Connecting...' : 'Verify & Connect (Locally)'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
