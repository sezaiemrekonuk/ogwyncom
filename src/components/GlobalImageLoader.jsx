import { useImageLoading } from '../hooks/useImageLoader.jsx';

const GlobalImageLoader = () => {
  const { globalLoading } = useImageLoading();

  if (!globalLoading) return null;

  return (
    <div className="global-image-loader">
      <div className="global-loader-content">
        <div className="breathing-logo">
          <img src="/images/logo.svg" alt="Loading images..." />
        </div>
        <p>İçerikler yükleniyor...</p>
      </div>
    </div>
  );
};

export default GlobalImageLoader;
