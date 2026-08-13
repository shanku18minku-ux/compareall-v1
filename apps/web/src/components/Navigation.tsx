export default function Navigation() {
  const links = [
    { name: 'Home', path: '/' },
    { name: 'Search', path: '/' },
    { name: 'Categories', path: '/categories' },
    { name: 'Compare', path: '/' },
    { name: 'Connected Services', path: '/connected-services' },
    { name: 'Wishlist', path: '/wishlist' },
    { name: 'History', path: '/history' },
    { name: 'Alerts', path: '/alerts' },
    { name: 'Profile', path: '/profile' },
    { name: 'Settings', path: '/settings' },
  ];

  return (
    <header className="header-nav" style={{flexWrap: 'wrap', gap: '1rem'}}>
      <div className="logo" style={{fontWeight: 'bold', fontSize: '1.5rem', color: 'var(--primary)'}}>
        CompareAll
      </div>
      <nav className="header-links" style={{display: 'flex', gap: '1rem', flexWrap: 'wrap', fontSize: '0.875rem'}}>
        {links.map(link => (
          <a key={link.name} href={link.path} style={{color: 'var(--muted)'}}>
            {link.name}
          </a>
        ))}
      </nav>
    </header>
  );
}
