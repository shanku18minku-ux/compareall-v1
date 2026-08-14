"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useStorage } from "../hooks/useStorage";

export default function Navigation({ hideDesktopHeader = false }: { hideDesktopHeader?: boolean }) {
  const pathname = usePathname();
  const { cart } = useStorage();

  // Calculate total items in cart across all providers
  const cartItemCount = cart.reduce((total: number, item: any) => total + (item.quantity || 1), 0);

  const links = [
    { name: 'Home', path: '/', icon: '🏠' },
    { name: 'Connect', path: '/connected-services', icon: '🔗' },
    { name: 'Savings', path: '/savings', icon: '💸' },
    { name: 'Cart', path: '/cart', icon: '🛒', badge: cartItemCount > 0 ? cartItemCount : null }
  ];

  return (
    <>
      {/* Mobile Bottom Navigation */}
      <nav style={{
        display: 'flex',
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        background: '#ffffff',
        borderTop: '1px solid #e5e7eb',
        zIndex: 1000,
        padding: '0.8rem 1.5rem env(safe-area-inset-bottom, 1rem)',
        justifyContent: 'space-between'
      }} className="mobile-bottom-nav">
        {links.map(link => {
          const isActive = pathname === link.path;
          return (
            <Link key={link.name} href={link.path} style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '0.4rem',
              textDecoration: 'none',
              color: isActive ? '#171717' : '#9ca3af',
              fontSize: '0.8rem',
              fontWeight: isActive ? 800 : 600,
              padding: '0.6rem 1.2rem',
              background: isActive ? '#f3f4f6' : 'transparent',
              borderRadius: '24px',
              transition: 'all 0.2s ease',
              position: 'relative'
            }}>
              <span style={{ fontSize: '1.5rem', filter: isActive ? 'none' : 'grayscale(100%) opacity(0.7)' }}>
                {link.icon}
              </span>
              
              {link.badge && (
                <div style={{
                  position: 'absolute',
                  top: '0.2rem',
                  right: '0.8rem',
                  background: '#ef4444',
                  color: 'white',
                  fontSize: '0.65rem',
                  fontWeight: 'bold',
                  height: '18px',
                  minWidth: '18px',
                  borderRadius: '99px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '0 4px',
                  border: '2px solid #ffffff'
                }}>
                  {link.badge > 99 ? '99+' : link.badge}
                </div>
              )}
              
              <span>{link.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Spacer for mobile bottom nav */}
      <div className="mobile-bottom-spacer" style={{display: 'none', height: '64px'}} />
    </>
  );
}
