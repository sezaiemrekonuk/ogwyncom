import AnimatedSection from '../components/AnimatedSection';
import { Bot, MessageCircleMore } from 'lucide-react';

const Hub = () => {
  return (
    <>
      <AnimatedSection 
        animationType="content-section" 
        style={{ paddingTop: '12rem', paddingBottom: '6rem' }}
      >
        <a href="#" className="section-tag">OGW HUB</a>
        <h1 className="page-title">Tüm Pazarlama Araçlarınız,<br />Tek Bir Yerde.</h1>
        <p className="section-description">
          OGW HUB, pazarlama operasyonlarınızı otomatikleştirmek ve verimliliği en üst düzeye çıkarmak için tasarlandı. SEO analizinden ekip yönetimine, e-ticaret optimizasyonundan yapay zeka destekli müşteri iletişimine kadar tüm süreçleri tek bir sezgisel panelden yönetin. Dağınık araçlara veda edin, entegre güce merhaba deyin.
        </p>
        <a href="https://ogwhub.ogwyn.com" className="btn btn-primary cta-button" target="_blank" rel="noopener noreferrer">Ücretsiz Dene</a>
      </AnimatedSection>

      <div className="ai-features-container">
        <div className="ai-feature-block">
          <div className="ai-feature-image" style={{ backgroundImage: "url('images/seo-analyser.jpg')" }}></div>
          <div className="ai-feature-text">
            <h3>Akıllı SEO Analizörü</h3>
            <p>
              Rakiplerinizin bir adım önüne geçin. Gelişmiş modülümüzle anahtar kelime performansını izleyin, site sağlığınızı denetleyin, backlink stratejileri oluşturun ve arama motorlarındaki sıralamanızı yükseltin. Teknik detaylarda boğulmayın, veriye dayalı kararlarla zirveye oynayın.
            </p>
          </div>
        </div>

        <div className="ai-feature-block reverse">
          <div className="ai-feature-image" style={{ backgroundImage: "url('images/seller-optimizer.jpg')" }}></div>
          <div className="ai-feature-text">
            <h3>E-Ticaret Optimizasyonu</h3>
            <p>
              Satışlarınızı katlayın. Platformlarla tam entegre modülümüz, ürün listelemelerinizi optimize eder, fiyatlandırma stratejileri önerir, envanter takibini kolaylaştırır ve müşteri yorumlarını analiz eder. Manuel işlemlere zaman harcamayın, otomasyonla kârlılığınızı artırın.
            </p>
          </div>
        </div>

        <div className="ai-feature-block">
          <div className="ai-feature-image" style={{ backgroundImage: "url('images/team-crm.jpg')" }}></div>
          <div className="ai-feature-text">
            <h3>Ekip İletişimi & CRM</h3>
            <p>
              Tüm ekip aynı hedefe odaklansın. Proje panoları, görev atamaları, müşteri verileri ve destek taleplerini tek bir merkezde toplayarak iş akışınızı birleştirin. Dağınık araçları ve iletişim kopukluklarını unutun, kusursuz ekip çalışmasıyla müşteri memnuniyetini zirveye taşıyın.
            </p>
          </div>
        </div>
      </div>

      <AnimatedSection animationType="content-section">
        <h2 className="section-title">Çok Yakında: Yapay Zeka Devrimi</h2>
        <p className="section-description">
          OGW HUB, sürekli gelişen bir platformdur. Yakında eklenecek yapay zeka modülleri ile pazarlama otomasyonunda sınırları zorlayacağız.
        </p>
        <div className="bulten-grid" style={{ gridTemplateColumns: 'repeat(2, 1fr)', maxWidth: '820px' }}>
          <div className="bulten-card" style={{ textAlign: 'left' }}>
            <div className="bulten-card-body">
              <Bot style={{ width: '32px', height: '32px', color: 'var(--primary-green)', marginBottom: '1rem' }} />
              <h3>Kişiselleştirilmiş AI Agent</h3>
              <p>7/24 çalışan, markanızın dilini konuşan ve müşterilerinize kişiselleştirilmiş destek sunan yapay zeka asistanları.</p>
            </div>
          </div>
          <div className="bulten-card" style={{ textAlign: 'left' }}>
            <div className="bulten-card-body">
              <MessageCircleMore style={{ width: '32px', height: '32px', color: 'var(--primary-green)', marginBottom: '1rem' }} />
              <h3>Sosyal Medya Chatbotları</h3>
              <p>WhatsApp, Instagram, Telegram ve TikTok'ta müşteri sorularını anında yanıtlayan, sipariş alan ve destek sağlayan akıllı chatbotlar.</p>
            </div>
          </div>
        </div>
      </AnimatedSection>
    </>
  );
};

export default Hub;