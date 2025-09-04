import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { formatArticleDate, getTimeAgo } from '../utils/dateHelpers';
import BackgroundImageLoader from './BackgroundImageLoader';

const ArticleCard = ({ article, delay = 0 }) => {

  return (
    <div className="bulten-card" style={{ transitionDelay: `${delay}s` }}>
      <div className="bulten-card-top">
        <BackgroundImageLoader
          src={article.image}
          className="bulten-card-image"
        />
        <Link 
          to={`/article/${article.slug}`} 
          className="bulten-card-button" 
          aria-label="Devamını Oku"
        >
          <ArrowUpRight />
        </Link>
      </div>
      <div className="bulten-card-body">
        <h3>{article.title}</h3>
        <p>{article.excerpt}</p>
        <div className="bulten-card-meta">
          <span className="bulten-card-tag">{formatArticleDate(article.publishedAt)}</span>
          <span className="bulten-card-tag">{getTimeAgo(article.publishedAt)}</span>
          {article.tags && article.tags.slice(0, 3).map((tag, index) => (
            <span key={index} className="bulten-card-tag">{tag}</span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ArticleCard;