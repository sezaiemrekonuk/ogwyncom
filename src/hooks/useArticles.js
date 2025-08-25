import { useState, useEffect } from 'react';
import { getArticles, getFeaturedArticles, getArticleBySlug } from '../config/firebase';
import articlesData from '../data/articles.json';

// Hook for fetching all articles
export const useArticles = (limitCount = null) => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getArticles(limitCount);
        
        // If no articles from Firestore, use fallback JSON data
        if (data.length === 0) {
          console.log('No articles in Firestore, using fallback JSON data');
          const fallbackArticles = limitCount 
            ? articlesData.articles.slice(0, limitCount)
            : articlesData.articles;
          setArticles(fallbackArticles);
        } else {
          setArticles(data);
        }
      } catch (err) {
        console.error('Error in useArticles, using fallback data:', err);
        // Use fallback JSON data on error
        const fallbackArticles = limitCount 
          ? articlesData.articles.slice(0, limitCount)
          : articlesData.articles;
        setArticles(fallbackArticles);
        setError(`Firestore error (using fallback data): ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, [limitCount]);

  const refetch = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getArticles(limitCount);
      setArticles(data);
    } catch (err) {
      setError(err.message);
      console.error('Error in refetch:', err);
    } finally {
      setLoading(false);
    }
  };

  return { articles, loading, error, refetch };
};

// Hook for fetching featured articles
export const useFeaturedArticles = (limitCount = 3) => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFeaturedArticles = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getFeaturedArticles(limitCount);
        
        // If no featured articles from Firestore, use fallback JSON data
        if (data.length === 0) {
          console.log('No featured articles in Firestore, using fallback JSON data');
          const fallbackArticles = articlesData.articles.slice(0, limitCount);
          setArticles(fallbackArticles);
        } else {
          setArticles(data);
        }
      } catch (err) {
        console.error('Error in useFeaturedArticles, using fallback data:', err);
        // Use fallback JSON data on error
        const fallbackArticles = articlesData.articles.slice(0, limitCount);
        setArticles(fallbackArticles);
        setError(`Firestore error (using fallback data): ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedArticles();
  }, [limitCount]);

  const refetch = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getFeaturedArticles(limitCount);
      setArticles(data);
    } catch (err) {
      setError(err.message);
      console.error('Error in refetch:', err);
    } finally {
      setLoading(false);
    }
  };

  return { articles, loading, error, refetch };
};

// Hook for fetching a single article by slug
export const useArticle = (slug) => {
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!slug) {
      setLoading(false);
      return;
    }

    const fetchArticle = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getArticleBySlug(slug);
        setArticle(data);
      } catch (err) {
        setError(err.message);
        console.error('Error in useArticle:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [slug]);

  const refetch = async () => {
    if (!slug) return;
    
    try {
      setLoading(true);
      setError(null);
      const data = await getArticleBySlug(slug);
      setArticle(data);
    } catch (err) {
      setError(err.message);
      console.error('Error in refetch:', err);
    } finally {
      setLoading(false);
    }
  };

  return { article, loading, error, refetch };
};