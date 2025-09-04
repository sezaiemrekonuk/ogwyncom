import { useState, useEffect } from 'react';

const BackgroundImageLoader = ({ 
  src, 
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
  const [backgroundImage, setBackgroundImage] = useState(null);

  useEffect(() => {
    if (!src) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(false);
    
    const img = new Image();
    
    img.onload = () => {
      setBackgroundImage(`url('${src}')`);
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

  const finalStyle = {
    ...style,
    ...(backgroundImage && { backgroundImage })
  };

  if (loading) {
    return (
      <div className={`bg-image-loader-placeholder ${className}`} style={style} {...props}>
        {loadingComponent || (
          <div className="breathing-logo-overlay">
            <img src="/images/logo.svg" alt="Loading..." />
          </div>
        )}
        {children}
      </div>
    );
  }

  if (error) {
    return (
      <div className={`bg-image-loader-error ${className}`} style={style} {...props}>
        <div className="breathing-logo-overlay">
          <img src="/images/logo.svg" alt="Error loading image" />
        </div>
        {children}
      </div>
    );
  }

  return (
    <div className={className} style={finalStyle} {...props}>
      {children}
    </div>
  );
};

export default BackgroundImageLoader;
