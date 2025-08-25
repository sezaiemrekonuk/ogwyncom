import ArticleCard from '../components/ArticleCard';
import AnimatedSection from '../components/AnimatedSection';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import { useArticles } from '../hooks/useArticles';

const Bulletin = () => {
  const { 
    articles, 
    loading, 
    error, 
    refetch 
  } = useArticles();

  return (
    <AnimatedSection animationType="content-section" id="bulten-arsiv">
      <h1 className="page-title">Tüm Yazılar</h1>
      <p className="section-description">
        Stratejiler, analizler ve trendler üzerine tüm bülten yazılarımız.
      </p>
      
      <div className="bulten-grid">
        {loading ? (
          <div className="bulten-loading">
            <LoadingSpinner size="large" />
            <p>Yazılar yükleniyor...</p>
          </div>
        ) : error ? (
          <ErrorMessage 
            error={error} 
            onRetry={refetch}
            className="bulten-error"
          />
        ) : articles.length > 0 ? (
          articles.map((article, index) => (
            <ArticleCard key={article.id} article={article} delay={index * 0.1} />
          ))
        ) : (
          <div className="bulten-empty">
            <p>Henüz yazı bulunmuyor.</p>
          </div>
        )}
      </div>
    </AnimatedSection>
  );
};

export default Bulletin;