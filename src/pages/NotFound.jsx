import { Link } from 'react-router-dom';
import AnimatedSection from '../components/AnimatedSection';

const NotFound = () => {
  return (
    <AnimatedSection animationType="content-section" style={{ paddingTop: '12rem' }}>
      <h1 className="page-title">Sayfa Bulunamadı</h1>
      <p className="section-description">
        Aradığınız sayfa mevcut değil veya taşınmış olabilir.
      </p>
      <Link to="/" className="btn btn-primary cta-button">
        Ana Sayfaya Dön
      </Link>
    </AnimatedSection>
  );
};

export default NotFound;