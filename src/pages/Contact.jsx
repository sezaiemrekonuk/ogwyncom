import AnimatedSection from '../components/AnimatedSection';

const Contact = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Implement contact form submission
    console.log('Contact form submission to be implemented');
  };

  return (
    <AnimatedSection 
      animationType="content-section" 
      style={{ paddingTop: '12rem' }}
    >
      <h1 className="page-title">İletişim</h1>
      <p className="section-description">
        Projeleriniz hakkında konuşmaya hazırız. Bize ulaşın ve dijital dönüşüm yolculuğunuza başlayın.
      </p>
      
      <div style={{ maxWidth: '600px', width: '100%', marginTop: '4rem' }}>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div>
            <input 
              type="text" 
              placeholder="Ad Soyad" 
              required 
              style={{
                width: '100%',
                padding: '15px 20px',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                border: 'none',
                borderRadius: '10px',
                color: 'var(--white)',
                fontSize: '1rem'
              }}
            />
          </div>
          <div>
            <input 
              type="email" 
              placeholder="E-posta" 
              required 
              style={{
                width: '100%',
                padding: '15px 20px',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                border: 'none',
                borderRadius: '10px',
                color: 'var(--white)',
                fontSize: '1rem'
              }}
            />
          </div>
          <div>
            <input 
              type="text" 
              placeholder="Konu" 
              required 
              style={{
                width: '100%',
                padding: '15px 20px',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                border: 'none',
                borderRadius: '10px',
                color: 'var(--white)',
                fontSize: '1rem'
              }}
            />
          </div>
          <div>
            <textarea 
              placeholder="Mesajınız" 
              required 
              rows="5"
              style={{
                width: '100%',
                padding: '15px 20px',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                border: 'none',
                borderRadius: '10px',
                color: 'var(--white)',
                fontSize: '1rem',
                resize: 'vertical',
                minHeight: '120px'
              }}
            />
          </div>
          <button type="submit" className="btn btn-primary cta-button">
            Mesaj Gönder
          </button>
        </form>
      </div>
    </AnimatedSection>
  );
};

export default Contact;