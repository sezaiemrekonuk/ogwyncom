import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import AnimatedSection from '../components/AnimatedSection';
import ServiceCarousel from '../components/ServiceCarousel';
import PartnersMarquee from '../components/PartnersMarquee';
import ArticleCard from '../components/ArticleCard';
import BroadcastCard from '../components/BroadcastCard';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import { useFeaturedArticles } from '../hooks/useArticles';
import broadcastsData from '../data/broadcasts.json';

const Home = () => {
  const { 
    articles: featuredArticles, 
    loading: articlesLoading, 
    error: articlesError, 
    refetch: refetchArticles 
  } = useFeaturedArticles(3);
  
  const featuredBroadcasts = broadcastsData.broadcasts.slice(0, 3);

  return (
    <>
      {/* Hero Section */}
      <section className="hero-main">
        <div className="hero-content">
          <AnimatedSection delay={0.1}>
            <p className="pre-headline">OGW ile Markanızın Hikayesi Daha Büyük ve Güçlü</p>
          </AnimatedSection>
          <AnimatedSection delay={0.2}>
            <h1>Akışları Yönetmekle Kalmıyor,<br />Onları Tutkulara Dönüştürüyoruz</h1>
          </AnimatedSection>
        </div>
        <PartnersMarquee />
      </section>

      {/* Services Section */}
      <AnimatedSection animationType="content-section reveal-up" id="hizmetler">
        <a href="#" className="section-tag">Hizmetler</a>
        <h2 className="section-title">Yapay Zeka ile<br />Güçlendirilmiş Hizmetler.</h2>
        <p className="section-description">
          Dijital büyüme için ihtiyacınız olan her şey, tek merkezde.<br />
          Otomasyon, tasarım, içerik üretimi ve daha fazlası, size özel stratejilerle.
        </p>
        <ServiceCarousel />
      </AnimatedSection>

      {/* Bulletin Section */}
      <AnimatedSection animationType="content-section reveal-up" id="bulten">
        <Link to="/bulten" className="section-tag">Bülten</Link>
        <h2 className="section-title">Yapay Zeka Çağında<br />Büyümenin Yeni Kuralları</h2>
        <p className="section-description">
          E-ticaret, içerik üretimi ve yapay zekâ stratejilerinde öne çıkmak isteyenler için.
        </p>
        <div className="bulten-grid">
          {articlesLoading ? (
            <div className="bulten-loading">
              <LoadingSpinner size="large" />
              <p>Yazılar yükleniyor...</p>
            </div>
          ) : articlesError ? (
            <ErrorMessage 
              error={articlesError} 
              onRetry={refetchArticles}
              className="bulten-error"
            />
          ) : featuredArticles.length > 0 ? (
            featuredArticles.map((article, index) => (
              <ArticleCard key={article.id} article={article} delay={index * 0.1} />
            ))
          ) : (
            <div className="bulten-empty">
              <p>Henüz yazı bulunmuyor.</p>
            </div>
          )}
        </div>
        <div className="bulten-footer-nav">
          <div className="pagination-indicator">
            <span>01</span>
            <span className="active">02</span>
            <span>03</span>
            <span className="line">—</span>
            <span>04</span>
          </div>
          <Link to="/bulten" className="view-more-link">
            VIEW MORE FEATURED EPISODE
            <ArrowRight />
          </Link>
        </div>
      </AnimatedSection>

      {/* Broadcast Section */}
      <AnimatedSection animationType="content-section reveal-up" id="broadcast">
        <Link to="/broadcast" className="section-tag">Broadcast & Publishing</Link>
        <h2 className="section-title">Ogwyn'i Keşfet.<br />Parçaları Doğrudan Dinle.</h2>
        <p className="section-description">
          En son yayınlarımızı ve müzik çalışmalarımızı buradan takip edebilirsiniz. 
          Beğendiğiniz parçayı seçin ve dinlemeye başlayın.
        </p>
        <div className="broadcast-grid">
          {featuredBroadcasts.map((broadcast, index) => (
            <BroadcastCard 
              key={broadcast.id} 
              broadcast={broadcast} 
              delay={index * 0.1} 
            />
          ))}
        </div>
        <div className="section-view-more-wrapper">
          <Link to="/broadcast" className="view-more-link">
            DAHA FAZLASINI KEŞFET
            <ArrowRight />
          </Link>
        </div>
      </AnimatedSection>
    </>
  );
};

export default Home;