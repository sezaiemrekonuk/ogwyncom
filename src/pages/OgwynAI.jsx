import AnimatedSection from '../components/AnimatedSection';

const OgwynAI = () => {
  return (
    <>
      <AnimatedSection 
        animationType="content-section" 
        style={{ paddingTop: '12rem', paddingBottom: '6rem' }}
      >
        <a href="#" className="section-tag">Ogwyn AI</a>
        <h1 className="page-title">Yapay Zeka ile<br />Pazarlamayı Yeniden Tanımlıyoruz</h1>
        <p className="section-description">
          Ogwyn AI, pazarlama stratejilerinizi optimize eden, içerik üretimini hızlandıran ve 
          müşteri deneyimini kişiselleştiren yapay zeka asistanınız.
        </p>
        <a href="#" className="btn btn-primary cta-button">
          Ogwyn AI'yi Deneyin
        </a>
      </AnimatedSection>

      <div className="ai-features-container">
        <div className="ai-feature-block">
          <div className="ai-feature-image" style={{ backgroundImage: "url('images/ai-content.jpg')" }}></div>
          <div className="ai-feature-text">
            <h3>Akıllı İçerik Üretimi</h3>
            <p>
              Blog yazılarından sosyal medya gönderilerine, e-posta kampanyalarından 
              reklam metinlerine kadar tüm içeriklerinizi yapay zeka ile üretin.
            </p>
          </div>
        </div>

        <div className="ai-feature-block reverse">
          <div className="ai-feature-image" style={{ backgroundImage: "url('images/seo-analyser.jpg')" }}></div>
          <div className="ai-feature-text">
            <h3>SEO Analizi & Optimizasyon</h3>
            <p>
              Web sitenizi ve içeriklerinizi arama motorları için optimize edin. 
              Anahtar kelime analizi, rakip araştırması ve teknik SEO önerileri.
            </p>
          </div>
        </div>

        <div className="ai-feature-block">
          <div className="ai-feature-image" style={{ backgroundImage: "url('images/seller-optimizer.jpg')" }}></div>
          <div className="ai-feature-text">
            <h3>Satış Optimizasyonu</h3>
            <p>
              E-ticaret performansınızı artırın. Ürün açıklamaları, fiyatlandırma stratejileri 
              ve müşteri segmentasyonu için yapay zeka destekli çözümler.
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default OgwynAI;