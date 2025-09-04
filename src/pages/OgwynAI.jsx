import { useEffect } from 'react';
import AnimatedSection from '../components/AnimatedSection';
import BackgroundImageLoader from '../components/BackgroundImageLoader';

const OgwynAI = () => {
  useEffect(() => {
    document.title = 'Ogwyn AI - Yapay Zekanın Gücüyle İçerik Stratejinizi Dönüştürün';
  }, []);
  return (
    <>
      <AnimatedSection 
        animationType="content-section" 
        style={{ paddingTop: '12rem', paddingBottom: '6rem' }}
      >
        <a href="#" className="section-tag">Ogwyn AI</a>
        <h1 className="page-title">Yapay Zekanın Gücüyle<br />İçerik Stratejinizi Dönüştürün</h1>
        <p className="section-description">
          Ogwyn AI, bir dijital pazarlama uzmanı, influencer ve sanatçı olan Ogwyn'in yaratıcı süreçlerinden ilham alarak geliştirildi. Markanızın sesini analiz eder, hedef kitlenizin beklentilerini anlar ve saniyeler içinde etkileşimi yüksek metinler, görseller ve pazarlama fikirleri üretir.
        </p>
        <a href="https://ai.ogwyn.com" target="_blank" rel="noopener noreferrer" className="btn btn-primary cta-button">
          Hemen Deneyin
        </a>
      </AnimatedSection>

      <div className="ai-features-container">
        <div className="ai-feature-block">
          <BackgroundImageLoader 
            src="images/ai-content.jpg"
            className="ai-feature-image"
          />
          <div className="ai-feature-text">
            <h3>Saniyeler İçinde Özgün İçerik</h3>
            <p>
              Yapay zekanın gücüyle içerik üretimi artık çok kolay. Sadece anahtar kelimelerinizi girin, Ogwyn AI saniyeler içinde markanız için harikalar yaratsın:
            </p>
          </div>
        </div>

        <div className="ai-feature-block reverse">
          <BackgroundImageLoader 
            src="images/model.jpg"
            className="ai-feature-image"
          />
          <div className="ai-feature-text">
            <h3>Bir Influencer Gibi Düşünen Yapay Zeka</h3>
            <p>
              Ogwyn AI'nin arkasında, bir Instagram influencer'ının estetik zekası ve trend öngörüsü var. Bu yüzden platformumuz sadece metin üretmekle kalmaz; hangi görselin, hangi başlığın ve hangi trendin daha fazla etkileşim getireceğini de bilir.
            </p>
          </div>
        </div>

        <div className="ai-feature-block">
          <BackgroundImageLoader 
            src="images/trends.jpg"
            className="ai-feature-image"
          />
          <div className="ai-feature-text">
            <h3>Pazar Trendlerini Öngörün</h3>
            <p>
              Ogwyn AI ile sektörünüzdeki en son trendleri, rakip analizlerini ve hedef kitlenizin değişen ilgi alanlarını anlık olarak yakalayın. Veriye dayalı stratejilerle rekabette her zaman bir adım önde olun.
            </p>
          </div>
        </div>

        <div className="ai-feature-block reverse">
          <div className="ai-feature-image" style={{ backgroundImage: "url('images/visuals.jpg')" }}></div>
          <div className="ai-feature-text">
            <h3>Marka Estetiğinizi Yansıtan Görseller</h3>
            <p>
              Tek bir metin istemiyle sosyal medya gönderileriniz veya reklamlarınız için dikkat çekici ve markanızla tutarlı görseller oluşturun. Tasarımcıya ihtiyaç duymadan, bir influencer'ın gözünden profesyonel sonuçlar elde edin.
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default OgwynAI;