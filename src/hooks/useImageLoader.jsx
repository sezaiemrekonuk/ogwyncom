import { useState, useEffect, useContext, createContext } from 'react';

// Context for global image loading state
const ImageLoadingContext = createContext();

export const ImageLoadingProvider = ({ children }) => {
  const [loadingImages, setLoadingImages] = useState(new Set());
  const [globalLoading, setGlobalLoading] = useState(false);

  const addLoadingImage = (imageId) => {
    setLoadingImages(prev => {
      const newSet = new Set(prev);
      newSet.add(imageId);
      return newSet;
    });
  };

  const removeLoadingImage = (imageId) => {
    setLoadingImages(prev => {
      const newSet = new Set(prev);
      newSet.delete(imageId);
      return newSet;
    });
  };

  useEffect(() => {
    setGlobalLoading(loadingImages.size > 0);
  }, [loadingImages]);

  const value = {
    globalLoading,
    loadingImages,
    addLoadingImage,
    removeLoadingImage
  };

  return (
    <ImageLoadingContext.Provider value={value}>
      {children}
    </ImageLoadingContext.Provider>
  );
};

export const useImageLoading = () => {
  const context = useContext(ImageLoadingContext);
  if (!context) {
    throw new Error('useImageLoading must be used within an ImageLoadingProvider');
  }
  return context;
};

// Hook for individual images
export const useImageLoader = (src, imageId) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [imageSrc, setImageSrc] = useState(null);
  const { addLoadingImage, removeLoadingImage } = useImageLoading();

  useEffect(() => {
    if (!src) {
      setLoading(false);
      removeLoadingImage(imageId);
      return;
    }

    const uniqueId = imageId || src;
    
    setLoading(true);
    setError(false);
    addLoadingImage(uniqueId);
    
    const img = new Image();
    
    img.onload = () => {
      setImageSrc(src);
      setLoading(false);
      setError(false);
      removeLoadingImage(uniqueId);
    };
    
    img.onerror = () => {
      setLoading(false);
      setError(true);
      removeLoadingImage(uniqueId);
    };
    
    img.src = src;
    
    return () => {
      img.onload = null;
      img.onerror = null;
      removeLoadingImage(uniqueId);
    };
  }, [src, imageId, addLoadingImage, removeLoadingImage]);

  return { loading, error, imageSrc };
};
