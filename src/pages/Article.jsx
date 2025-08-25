import { useParams, Navigate } from 'react-router-dom';
import AnimatedSection from '../components/AnimatedSection';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import { useArticle } from '../hooks/useArticles';

const Article = () => {
  const { slug } = useParams();
  const { article, loading, error, refetch } = useArticle(slug);

  if (loading) {
    return (
      <div className="article-page">
        <AnimatedSection>
          <div className="article-loading">
            <LoadingSpinner size="large" />
            <p>Makale yükleniyor...</p>
          </div>
        </AnimatedSection>
      </div>
    );
  }

  if (error) {
    return (
      <div className="article-page">
        <AnimatedSection>
          <ErrorMessage 
            error={error} 
            onRetry={refetch}
            className="article-error"
          />
        </AnimatedSection>
      </div>
    );
  }

  if (!article) {
    return <Navigate to="/404" replace />;
  }

  return (
    <div className="article-page">
      <AnimatedSection>
        <header className="article-header">
          <h1>{article.title}</h1>
          {article.publishedAt && (
            <div className="article-meta">
              <span className="article-date">
                {new Date(article.publishedAt.seconds * 1000).toLocaleDateString('tr-TR')}
              </span>
              {article.category && (
                <span className="article-category">{article.category}</span>
              )}
            </div>
          )}
        </header>
      </AnimatedSection>
      
      {article.image && (
        <AnimatedSection animationType="scale-in">
          <div className="article-main-image" style={{ 
            backgroundImage: `url('${article.image}')` 
          }}></div>
        </AnimatedSection>
      )}
      
      <AnimatedSection>
        <article className="article-content">
          {article.content ? (
            <div 
              className="html-content"
              dangerouslySetInnerHTML={{ __html: article.content }}
            />
          ) : (
            <section>
              <p>{article.excerpt}</p>
              <p style={{ fontStyle: 'italic', marginTop: '2rem' }}>
                Bu makale Firebase'den yüklenecek. Şu anda sadece preview görüntüleniyor.
              </p>
            </section>
          )}
          
          {article.tags && article.tags.length > 0 && (
            <div className="article-tags">
              <h4>Etiketler:</h4>
              <div className="tags-list">
                {article.tags.map((tag, index) => (
                  <span key={index} className="tag">
                    {tag.startsWith('#') ? tag : `#${tag}`}
                  </span>
                ))}
              </div>
            </div>
          )}
        </article>
      </AnimatedSection>
    </div>
  );
};

export default Article;