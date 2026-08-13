import SearchInterface from '../components/SearchInterface';
import Navigation from '../components/Navigation';

export default function Home() {
  return (
    <div className="container">
      <Navigation />

      <main>
        <div style={{textAlign: 'center', margin: '3rem 0'}}>
          <h1 style={{fontSize: '2.5rem', fontWeight: 800, color: 'var(--primary)', marginBottom: '0.5rem'}}>
            CompareAll
          </h1>
          <p style={{fontSize: '1.25rem', color: 'var(--muted)', marginBottom: '2rem'}}>
            Search once. Compare everywhere. Choose better.
          </p>
        </div>

        <SearchInterface />

        <div className="categories-section" style={{marginTop: '3rem'}}>
          <h3 style={{marginBottom: '1rem'}}>Categories</h3>
          <div className="categories-grid">
            {['Food', 'Grocery', 'Shopping', 'Electronics', 'Fashion', 'Travel', 'Cabs', 'Jobs', 'Education'].map(cat => (
              <div key={cat} className="category-chip">
                {cat}
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
