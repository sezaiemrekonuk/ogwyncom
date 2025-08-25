import AnimatedSection from '../components/AnimatedSection';

const Store = () => {
  return (
    <AnimatedSection 
      animationType="content-section" 
      style={{ paddingTop: '12rem' }}
    >
      <a href="#" className="section-tag">Mağaza</a>
      <h1 className="page-title">OGW Mağaza</h1>
      <p className="section-description">
        Dijital pazarlama araçları, şablonlar ve premium içerikler yakında burada olacak.
      </p>
      <div style={{ marginTop: '4rem', padding: '3rem', backgroundColor: 'var(--dark-gray)', borderRadius: 'var(--border-radius)' }}>
        <h3 style={{ marginBottom: '1rem' }}>Yakında...</h3>
        <p style={{ color: 'var(--text-gray)' }}>
          Premium şablonlar, dijital araçlar ve özel içeriklerimiz çok yakında sizlerle buluşacak.
        </p>
      </div>
    </AnimatedSection>
  );
};

export default Store;