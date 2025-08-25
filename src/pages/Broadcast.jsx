import BroadcastCard from '../components/BroadcastCard';
import AnimatedSection from '../components/AnimatedSection';
import broadcastsData from '../data/broadcasts.json';

const Broadcast = () => {
  const broadcasts = broadcastsData.broadcasts;

  return (
    <>
      <AnimatedSection 
        animationType="content-section" 
        className="content-section"
        style={{ paddingTop: '12rem', paddingBottom: '6rem' }}
      >
        <a href="#" className="section-tag">Broadcast & Publishing</a>
        <h1 className="page-title">Sesinizi Milyonlara Ulaştırın,<br />Hikayenizi Görselleştirin.</h1>
        <p className="section-description">
          OGW olarak, içeriğinizi sadece üretmiyor, onu bir fenomene dönüştürüyoruz. 
          PODGW podcast serimizden profesyonel müzik prodüksiyonuna, YouTube'dan Spotify'a kadar 
          tüm dijital yayıncılık süreçlerinizde stratejik ortağınız oluyoruz.
        </p>
      </AnimatedSection>

      <div className="ai-features-container">
        <div className="ai-feature-block">
          <div className="ai-feature-image" style={{ backgroundImage: "url('images/podgw.jpg')" }}></div>
          <div className="ai-feature-text">
            <h3>PODGW: Markanızın Sesi Olun</h3>
            <p>
              Markanızın sesi olun. PODGW, hedef kitlenizle doğrudan diyalog kurduğunuz bir platformdur. 
              Podcast'inizi fikir aşamasından kayda, profesyonel kurgudan Spotify ve Apple Podcasts gibi 
              tüm platformlarda yayına kadar uçtan uca yönetiyoruz. Siz sadece hikayenizi anlatın, 
              strateji ve teknik detaylar bize kalsın.
            </p>
          </div>
        </div>

        <div className="ai-feature-block reverse">
          <div className="ai-feature-image" style={{ backgroundImage: "url('images/youtube.jpg')" }}></div>
          <div className="ai-feature-text">
            <h3>YouTube Prodüksiyon: Görsel Hikayeleriniz</h3>
            <p>
              YouTube'da sadece video yüklemek yetmiyor; hikaye anlatmak gerekiyor. 
              Profesyonel çekim ekipmanlarımızla, yaratıcı kurgu teknikleriyle ve 
              platform optimizasyonuyla videolarınızı milyonlara ulaştırıyoruz.
            </p>
          </div>
        </div>

        <div className="ai-feature-block">
          <div className="ai-feature-image" style={{ backgroundImage: "url('images/dj.png')" }}></div>
          <div className="ai-feature-text">
            <h3>Müzik Prodüksiyon: Duyguları Şekillendirin</h3>
            <p>
              Markanızın ruhunu yansıtan özgün müzikler üretiyoruz. Reklam müziklerinden 
              podcast jinglelarına, etkinlik temalarından sosyal medya içeriklerine kadar 
              her platformda markanızın sesini duyuruyoruz.
            </p>
          </div>
        </div>
      </div>

      <AnimatedSection animationType="content-section">
        <h2 className="section-title">En Son Yayınlarımız</h2>
        <p className="section-description">
          Spotify'da yayınladığımız en güncel içeriklerimizi keşfedin.
        </p>
        
        <div className="broadcast-grid">
          {broadcasts.map((broadcast, index) => (
            <BroadcastCard 
              key={broadcast.id} 
              broadcast={broadcast} 
              delay={index * 0.1} 
            />
          ))}
        </div>
      </AnimatedSection>
    </>
  );
};

export default Broadcast;