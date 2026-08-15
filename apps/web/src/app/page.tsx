import SearchInterface from '../components/SearchInterface';
import Navigation from '../components/Navigation';
import Link from 'next/link';

export default function Home() {

  return (
    <div className="container" style={{ paddingBottom: '4rem', background: 'var(--background)', minHeight: '100vh', width: '100%' }}>
      
      <main style={{ paddingTop: '1rem' }}>
        <SearchInterface />
      </main>

      <Navigation hideDesktopHeader={true} />
    </div>
  );
}
