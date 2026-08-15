"use client";

import React, { useState, useEffect } from 'react';
import { GroupedResult, SortOrder } from '@compareall/engine';
import { SearchFilters } from '@compareall/shared-types';
import LocationSelector from './LocationSelector';
import { useStorage } from '../hooks/useStorage';
import { motion, AnimatePresence } from 'framer-motion';

const CATEGORIES = [
  { id: 'all', label: 'All', icon: '🔍' },
  { id: 'food', label: 'Food', icon: '🍔' },
  { id: 'grocery', label: 'Groceries', icon: '🛒' },
  { id: 'shopping', label: 'Shopping', icon: '🛍️' },
  { id: 'medicine', label: 'Medicine', icon: '💊' },
  { id: 'services', label: 'Local Services', icon: '🔧' },
  { id: 'travel', label: 'Tour and Travel', icon: '✈️' },
  { id: 'cabs', label: 'Cabs', icon: '🚕' }
];

export default function SearchInterface() {
  const { isHydrated, history, location, wishlist, connections, actions } = useStorage();
  
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState<GroupedResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [sortOrder, setSortOrder] = useState<SortOrder>('price_asc');
  const [dataSource, setDataSource] = useState<string>('demo');
  const [isLive, setIsLive] = useState(false);
  
  // Filters state
  const [filters, setFilters] = useState<SearchFilters>({});
  
  // Compare state
  const [compareTray, setCompareTray] = useState<any[]>([]);
  const [showCompareModal, setShowCompareModal] = useState(false);

  const [expandedOfferId, setExpandedOfferId] = useState<string | null>(null);
  
  // Extension state
  const [extensionReady, setExtensionReady] = useState(false);
  const [wishlistIds, setWishlistIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    setWishlistIds(new Set(wishlist.map((item: any) => item.id)));
  }, [wishlist]);

  useEffect(() => {
    // Check if extension was injected before React mounted
    if (document.documentElement.getAttribute('data-compareall-extension') === 'true') {
      setExtensionReady(true);
    }
    
    // Listen for extension readiness and search results
    const handleMessage = async (event: MessageEvent) => {
      if (event.data?.type === "COMPAREALL_EXTENSION_READY") {
        console.log("Extension detected and ready!");
        setExtensionReady(true);
      }
      
      if (event.data?.type === "COMPAREALL_LIVE_SEARCH_RESULT") {
        const rawResults = event.data.results;
        
        // Send these raw results to backend /live endpoint for grouping
        try {
          const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
          const res = await fetch(`${API_URL}/api/compare/live`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query: searchTerm, results: rawResults })
          });
          const json = await res.json();
          if (json.success) {
            setResults(json.results);
            setDataSource(json.dataSource);
            setIsLive(json.isLive);
          }
        } catch (e) {
          console.error("Failed to process live results:", e);
        } finally {
          setIsSearching(false);
        }
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [searchTerm]);

  const handleSearch = async (e?: React.FormEvent, termToSearch?: string, newSortOrder?: SortOrder, newFilters?: SearchFilters) => {
    if (e) e.preventDefault();
    const query = (termToSearch !== undefined ? termToSearch : searchTerm).trim();
    if (!query) return;
    
    setSearchTerm(query);
    actions.addSearchHistory(query);
    
    setIsSearching(true);
    try {
      if (extensionReady) {
        window.postMessage({
          type: "COMPAREALL_LIVE_SEARCH",
          payload: { query: termToSearch || searchTerm }
        }, "*");
      } else {
        const connectedIds: string[] = connections.filter((c: any) => c.status === 'connected').map((c: any) => c.providerId);
        const res = await fetch(`/api/compare`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            query: termToSearch || searchTerm, 
            sortOrder: newSortOrder || sortOrder,
            filters: { ...newFilters, ...filters, category: activeTab !== 'all' ? activeTab : undefined }, // Pass activeTab hint
            location: location,
            connectedProviders: connectedIds
          })
        });
        
        const json = await res.json();
        if (json.success) {
          setResults(json.results);
          setDataSource(json.dataSource);
          setIsLive(json.isLive);
          
          connectedIds.forEach(id => {
            actions.disconnectProvider(id);
          });
        }
        setIsSearching(false);
      }
    } catch (error) {
      setIsSearching(false);
    }
  };

  const toggleWishlist = (offer: any) => {
    actions.toggleWishlist(offer);
  };

  const toggleCompare = (offer: any) => {
    if (compareTray.find(o => o.id === offer.id)) {
      setCompareTray(compareTray.filter(o => o.id !== offer.id));
    } else {
      if (compareTray.length >= 4) {
        alert("You can only compare up to 4 items at a time.");
        return;
      }
      setCompareTray([...compareTray, offer]);
    }
  };

  const applyFilters = (updates: Partial<SearchFilters>) => {
    const newFilters = { ...filters, ...updates };
    setFilters(newFilters);
    handleSearch(undefined, searchTerm, sortOrder, newFilters);
  };
  
  const getPlaceholder = () => {
    switch (activeTab) {
      case 'food': return 'Search for food (e.g. Chicken Biryani)';
      case 'grocery': return 'Search groceries (e.g. Milk, Bread)';
      case 'shopping': return 'Search products (e.g. iPhone 16)';
      case 'medicine': return 'Search medicines (e.g. Paracetamol)';
      case 'services': return 'Search local services (e.g. Plumber, AC Repair)';
      case 'travel': return 'Search flights or hotels (e.g. Delhi to Mumbai)';
      case 'cabs': return 'Search cabs (e.g. Airport cab)';
      default: return 'What do you want? (e.g. Biryani, Flights)';
    }
  }

  return (
    <div>
      <LocationSelector 
        location={location} 
        onLocationChange={actions.saveLocation} 
      />

      <div style={{ marginBottom: '2rem' }}>
        <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#171717', marginBottom: '1rem' }}>Search Deals</h3>
        <form onSubmit={(e) => handleSearch(e)} className="search-box" style={{ background: '#ffffff', padding: '0.5rem', borderRadius: '16px', border: '1px solid #e5e7eb', boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}>
          <div className="search-input-wrapper" style={{display: 'flex', gap: '0.5rem', alignItems: 'center'}}>
            <span style={{paddingLeft: '1rem', color: '#9ca3af', fontSize: '1.25rem'}}>🔍</span>
            <input 
              type="text" 
              className="search-input"
              style={{flex: 1, padding: '1rem 0.5rem', border: 'none', background: 'transparent', fontSize: '1.1rem', outline: 'none', color: '#171717', fontWeight: 500} }
              placeholder={getPlaceholder()}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button type="submit" className="search-button" disabled={isSearching} style={{
              background: '#171717', color: 'white', padding: '1rem 1.5rem', borderRadius: '12px', fontWeight: 600, border: 'none', cursor: isSearching ? 'not-allowed' : 'pointer', fontSize: '1.05rem', whiteSpace: 'nowrap'
            }}>
              {isSearching ? '...' : 'Search'}
            </button>
          </div>
        </form>
      </div>

      {/* Category Slabs */}
      <div style={{ marginBottom: '1.5rem' }}>
        <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#171717', marginBottom: '1rem' }}>Compare & Save</h3>
        <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '2rem'}}>
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => { setActiveTab(cat.id); setResults([]); }}
              style={{
                padding: '1.5rem 1rem',
                borderRadius: '16px',
                border: activeTab === cat.id ? '2px solid #171717' : '1px solid #e5e7eb',
                background: activeTab === cat.id ? '#f3f4f6' : '#ffffff',
                color: '#171717',
                fontWeight: 700,
                fontSize: '0.95rem',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.75rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
              }}
            >
              <span style={{fontSize: '2rem'}}>{cat.icon}</span>
              {cat.label}
            </button>
          ))}
        </div>
      </div>



      {/* Compare Tray */}
      {compareTray.length > 0 && (
        <div style={{position: 'fixed', bottom: 0, left: 0, right: 0, background: 'var(--foreground)', color: 'white', padding: '1rem', zIndex: 50, display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
          <div>
            <strong>{compareTray.length} items selected for comparison</strong>
          </div>
          <div style={{display: 'flex', gap: '1rem'}}>
            <button onClick={() => setCompareTray([])} style={{color: '#9ca3af', textDecoration: 'underline'}}>Clear</button>
            <button 
              onClick={() => setShowCompareModal(true)}
              style={{background: 'var(--primary)', color: 'white', padding: '0.5rem 1.5rem', borderRadius: '8px', fontWeight: 'bold'}}
            >
              Compare Now
            </button>
          </div>
        </div>
      )}

      {/* Compare Modal */}
      {showCompareModal && (
        <div style={{position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem'}}>
          <div style={{background: 'white', width: '100%', maxWidth: '1000px', maxHeight: '90vh', overflowY: 'auto', borderRadius: '12px', padding: '2rem'}}>
            <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem'}}>
              <h2>Side-by-Side Comparison</h2>
              <button onClick={() => setShowCompareModal(false)} style={{fontSize: '1.5rem', fontWeight: 'bold'}}>&times;</button>
            </div>
            
            <div style={{display: 'flex', gap: '1rem', overflowX: 'auto', paddingBottom: '1rem'}}>
              {compareTray.map(offer => (
                <div key={offer.id} style={{flex: '1', minWidth: '200px', border: '1px solid var(--border)', borderRadius: '8px', padding: '1rem'}}>
                  <h3 style={{fontSize: '1.1rem', marginBottom: '0.5rem'}}>{offer.providerName}</h3>
                  <div style={{color: 'var(--muted)', fontSize: '0.875rem', marginBottom: '1rem'}}>{offer.title}</div>
                  
                  <div style={{fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--success)', marginBottom: '1rem'}}>
                    â‚¹{offer.price.finalPayablePrice}
                  </div>
                  
                  <div style={{display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.875rem', marginBottom: '1.5rem'}}>
                    <div><strong>Base Price:</strong> â‚¹{offer.price.basePrice}</div>
                    <div><strong>Fees & Taxes:</strong> â‚¹{(offer.price.deliveryFee || 0) + (offer.price.platformFee || 0) + (offer.price.taxes || 0)}</div>
                    <div><strong>Discount:</strong> <span style={{color: 'var(--success)'}}>-â‚¹{offer.price.discount || 0}</span></div>
                    <div><strong>Rating:</strong> {offer.rating ? `â­ ${offer.rating}` : 'N/A'}</div>
                    <div><strong>ETA:</strong> {offer.estimatedTimeMins ? `${offer.estimatedTimeMins} mins` : 'N/A'}</div>
                    {offer.distanceKm && <div><strong>Distance:</strong> {offer.distanceKm} km</div>}
                  </div>
                  
                  <a href={offer.deepLinkUrl} target="_blank" rel="noreferrer" style={{display: 'block', textAlign: 'center', background: 'var(--primary)', color: 'white', padding: '0.75rem', borderRadius: '6px', fontWeight: 'bold'}}>
                    Book / Order
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {results.length > 0 && (
        <div style={{display: 'flex', flexDirection: 'column', gap: '1rem', margin: '1.5rem 0', padding: '1rem', background: 'white', borderRadius: '8px', border: '1px solid var(--border)'}}>
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem'}}>
            <strong style={{fontSize: '1.1rem'}}>Filters & Sorting</strong>
            <select 
              value={sortOrder} 
              onChange={(e) => {
                 const val = e.target.value as SortOrder;
                 setSortOrder(val);
                 handleSearch(undefined, searchTerm, val, filters);
              }}
              style={{padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border)'}}
            >
              <option value="price_asc">Lowest Price First</option>
              <option value="price_desc">Highest Price First</option>
              <option value="time_asc">Fastest Delivery/Arrival</option>
              <option value="availability_desc">Highest Availability</option>
              <option value="rating_desc">Highest Rating</option>
              <option value="discount_desc">Highest Discount</option>
            </select>
          </div>
          
          <div style={{display: 'flex', gap: '1rem', flexWrap: 'wrap'}}>
            <div>
              <label style={{fontSize: '0.75rem', color: 'var(--muted)', display: 'block'}}>Max Price (â‚¹)</label>
              <input 
                type="number" 
                placeholder="Any" 
                value={filters.maxPrice || ''} 
                onChange={e => applyFilters({ maxPrice: e.target.value ? Number(e.target.value) : undefined })}
                style={{padding: '0.4rem', borderRadius: '4px', border: '1px solid var(--border)', width: '100px'}}
              />
            </div>
            <div>
              <label style={{fontSize: '0.75rem', color: 'var(--muted)', display: 'block'}}>Min Rating</label>
              <select 
                value={filters.minRating || 0} 
                onChange={e => applyFilters({ minRating: Number(e.target.value) })}
                style={{padding: '0.4rem', borderRadius: '4px', border: '1px solid var(--border)'}}
              >
                <option value={0}>Any</option>
                <option value={3}>3+ Stars</option>
                <option value={4}>4+ Stars</option>
                <option value={4.5}>4.5+ Stars</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {results.length > 0 && connections.length === 0 && (
        <div style={{ margin: '1rem 0', padding: '1rem', background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ flex: '1 1 300px' }}>
            <h4 style={{ margin: 0, color: '#1e3a8a', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span>💡</span> Get Cheaper Prices!
            </h4>
            <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.875rem', color: '#1e40af' }}>
              Connect your Swiggy, Zomato, or Uber accounts to automatically apply your memberships (like Zomato Gold) and see your personalized cheaper prices. Data stays on your device.
            </p>
          </div>
          <a href="/connected-services" style={{ background: '#2563eb', color: 'white', padding: '0.5rem 1rem', borderRadius: '6px', fontSize: '0.875rem', fontWeight: 'bold', textDecoration: 'none', whiteSpace: 'nowrap' }}>
            Connect Accounts
          </a>
        </div>
      )}

      <div className="results-container" style={{paddingBottom: compareTray.length > 0 ? '5rem' : '0'}}>
        {results.length > 0 ? (
          results.map((group, idx) => (
            <div key={idx} className="grouped-result">
              <div className="grouped-result-header">
                <span className="grouped-result-category">{group.category}</span>
                <h2 className="grouped-result-title">{group.title}</h2>
                {group.description && <p style={{color: 'var(--muted)'}}>{group.description}</p>}
              </div>

              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '1rem', padding: '0.75rem', backgroundColor: 'var(--card-bg)', borderRadius: '8px', border: '1px solid var(--border)' }}>
                  {group.lowestPrice !== undefined && (
                    <div style={{ flex: 1 }}>
                      <span style={{ fontSize: '0.85rem', color: 'var(--muted)', display: 'block' }}>Best Price</span>
                      <strong style={{ fontSize: '1.25rem', color: 'var(--primary)' }}>₹{group.lowestPrice}</strong>
                    </div>
                  )}
                  {group.savings !== undefined && group.savings > 0 && (
                    <div style={{ flex: 1 }}>
                      <span style={{ fontSize: '0.85rem', color: 'var(--success)', display: 'block' }}>You Save</span>
                      <strong style={{ fontSize: '1.25rem', color: '#10b981' }}>₹{group.savings}</strong>
                    </div>
                  )}
                  <div style={{ flex: 1 }}>
                    <span style={{ fontSize: '0.85rem', color: 'var(--muted)', display: 'block' }}>Data Source</span>
                    {isLive ? (
                      <strong style={{ fontSize: '1rem', color: '#047857', backgroundColor: '#d1fae5', padding: '2px 6px', borderRadius: '4px' }}>{dataSource.toUpperCase()} - LIVE</strong>
                    ) : (
                      <strong style={{ fontSize: '1rem', color: '#b45309', backgroundColor: '#fef3c7', padding: '2px 6px', borderRadius: '4px' }}>{dataSource.toUpperCase()} - MOCK</strong>
                    )}
                  </div>
                </div>
                <div className="provider-list">
                {group.offers
                  .filter((offer: any) => offer.status !== 'UNAVAILABLE' && offer.isAvailable !== false)
                  .map((offer: any, offerIdx: number) => {
                  const isExpanded = expandedOfferId === offer.id;
                  const isWishlisted = wishlistIds.has(offer.id);
                  const isBest = offerIdx === 0 && offer.status !== 'UNAVAILABLE' && sortOrder === 'price_asc';
                  const inCompare = compareTray.some(o => o.id === offer.id);
                  
                  return (
                  <div key={offer.id} className={`provider-card ${isBest ? 'best-price' : ''} ${offer.status === 'UNAVAILABLE' ? 'opacity-50' : ''}`}>
                    <div className="provider-info">
                      <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
                        <input 
                           type="checkbox" 
                           checked={inCompare} 
                           onChange={() => toggleCompare(offer)} 
                           disabled={offer.status === 'UNAVAILABLE'}
                           style={{width: '1.25rem', height: '1.25rem', cursor: 'pointer'}} 
                           title="Add to comparison"
                        />
                        <div style={{flex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start'}}>
                          <h4 style={{margin: 0, paddingRight: '10px'}}>
                            {offer.title} <span style={{fontSize: '0.8rem', color: 'var(--muted)', fontWeight: 'normal'}}>via {offer.providerName}</span>
                            <span className="status-badge" style={{background: offer.status === 'LIVE' ? '#dbeafe' : '#fef3c7', color: offer.status === 'LIVE' ? '#1e3a8a' : '#92400e'}}>{offer.status}</span>
                            {isBest && <span className="status-badge" style={{background: '#dcfce7', color: '#166534'}}>BEST</span>}
                          </h4>
                          <button onClick={() => toggleWishlist(offer)} style={{background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.25rem'}}>
                            {isWishlisted ? '❤️' : '♡'}
                          </button>
                        </div>
                      </div>
                      
                      <div className="provider-meta" style={{flexDirection: 'column', gap: '0.25rem', marginTop: '0.5rem', marginLeft: '1.75rem'}}>
                        {offer.isAvailable ? <span style={{color: 'var(--success)', fontWeight: '500'}}>Available</span> : <span style={{color: 'var(--warning)'}}>Unavailable</span>}
                        
                        {offer.accountBenefits && offer.accountBenefits.length > 0 && (
                          <div style={{marginTop: '0.25rem'}}>
                            {offer.accountBenefits.map((benefit: string, bIdx: number) => {
                               const isDemo = benefit.includes('[DEMO]');
                               return (
                                 <span key={bIdx} style={{
                                   display: 'inline-block', 
                                   background: isDemo ? '#f3f4f6' : '#dcfce7', 
                                   color: isDemo ? '#4b5563' : '#166534', 
                                   border: isDemo ? '1px dashed #9ca3af' : '1px solid #166534',
                                   padding: '0.25rem 0.5rem', 
                                   borderRadius: '4px', 
                                   fontSize: '0.75rem', 
                                   fontWeight: 'bold', 
                                   marginRight: '0.5rem'
                                 }}>
                                   {isDemo && <span style={{marginRight: '4px'}}>⚠</span>}
                                   {benefit}
                                 </span>
                               )
                            })}
                          </div>
                        )}

                        {offer.estimatedTimeMins ? <span>ETA: {offer.estimatedTimeMins} min</span> : null}
                        {offer.distanceKm ? <span>Distance: {offer.distanceKm} km</span> : null}
                        {offer.brand && <span>Brand: {offer.brand}</span>}
                        {offer.size && <span>Size: {offer.size}</span>}
                        {offer.quantity && <span>Qty: {offer.quantity}</span>}
                        {offer.rating && <span>Reputation: ⭐ {offer.rating} ({offer.reviewCount || 0} reviews)</span>}
                        {offer.error && <span style={{color: 'red', fontWeight: 'bold'}}>{offer.error}</span>}
                      </div>
                    </div>

                    <div className="provider-price">
                      <div style={{textAlign: 'right'}}>
                        <button 
                          onClick={() => setExpandedOfferId(isExpanded ? null : offer.id)}
                          style={{fontSize: '0.75rem', background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', marginBottom: '0.5rem'}}
                        >
                          {isExpanded ? 'Hide Details ▲' : 'Show Details ▼'}
                        </button>
                      </div>

                      {isExpanded && (
                        <div className="price-breakdown" style={{textAlign: 'right', display: 'flex', flexDirection: 'column', gap: '0.25rem'}}>
                          <span>Base price: ₹{offer.price.basePrice}</span>
                          {(offer.price.deliveryFee || 0) > 0 && <span>Delivery fee: ₹{offer.price.deliveryFee}</span>}
                          {(offer.price.platformFee || 0) > 0 && <span>Platform fee: ₹{offer.price.platformFee}</span>}
                          {(offer.price.taxes || 0) > 0 && <span>Taxes: ₹{offer.price.taxes}</span>}
                          {(offer.price.discount || 0) > 0 && <span style={{color: 'var(--success)'}}>Discount: -₹{offer.price.discount}</span>}
                        </div>
                      )}
                      
                      <div className="final-price" style={{marginTop: '0.5rem', borderTop: isExpanded ? '1px solid var(--border)' : 'none', paddingTop: isExpanded ? '0.5rem' : '0'}}>
                        {offer.originalPrice && offer.originalPrice > offer.price.finalPayablePrice && (
                           <span style={{textDecoration: 'line-through', color: 'var(--muted)', fontSize: '0.875rem', marginRight: '0.5rem'}}>₹{offer.originalPrice}</span>
                        )}
                        ₹{offer.price.finalPayablePrice}
                      </div>
                      
                      <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem', opacity: offer.status === 'UNAVAILABLE' ? 0.5 : 1, pointerEvents: offer.status === 'UNAVAILABLE' ? 'none' : 'auto' }}>
                        <a 
                          href={offer.status === 'UNAVAILABLE' ? '#' : offer.deepLinkUrl} 
                          target={offer.status === 'UNAVAILABLE' ? '_self' : "_blank"} 
                          rel="noreferrer"
                          className="continue-btn"
                          style={{ flex: 1, textAlign: 'center', padding: '0.5rem', fontSize: '0.85rem' }}
                        >
                          View App
                        </a>
                        <button
                          onClick={() => actions.addToCart({
                            id: offer.id,
                            providerId: offer.providerId || offer.providerName.toLowerCase(),
                            providerName: offer.providerName,
                            title: offer.title,
                            price: offer.price.finalPayablePrice,
                            originalPrice: offer.originalPrice || offer.price.finalPayablePrice,
                            category: activeTab,
                            deepLinkUrl: offer.deepLinkUrl
                          })}
                          className="continue-btn"
                          style={{ flex: 1, padding: '0.5rem', fontSize: '0.85rem', background: '#10b981', border: 'none', color: 'white', cursor: 'pointer' }}
                        >
                          + Cart
                        </button>
                      </div>
                    </div>
                  </div>
                )})}
              </div>
            </div>
          ))
        ) : (
          !isSearching && searchTerm && <p>No results found.</p>
        )}
      </div>
    </div>
  );
}








