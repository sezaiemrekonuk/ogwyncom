import { useState, useEffect } from 'react';

const ImageLoader = ({ 
  src, 
  alt, 
  className = '', 
  style = {}, 
  children,
  loadingComponent,
  onLoad,
  onError,
  ...props 
}) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [imageSrc, setImageSrc] = useState(null);

  useEffect(() => {
    if (!src) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(false);
    
    const img = new Image();
    
    img.onload = () => {
      setImageSrc(src);
      setLoading(false);
      setError(false);
      onLoad && onLoad();
    };
    
    img.onerror = () => {
      setLoading(false);
      setError(true);
      onError && onError();
    };
    
    img.src = src;
    
    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [src, onLoad, onError]);

  if (loading) {
    return loadingComponent || (
      <div className={`image-loader-placeholder ${className}`} style={style}>
        <div className="breathing-logo">
          <img src="/images/logo.svg" alt="Loading..." />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`image-loader-error ${className}`} style={style}>
        <div className="breathing-logo">
          <img src="/images/logo.svg" alt="Error loading image" />
        </div>
      </div>
    );
  }

  return (
    <img 
      src={imageSrc} 
      alt={alt} 
      className={className}
      style={style}
      {...props}
    />
  );
};

export default ImageLoader;
