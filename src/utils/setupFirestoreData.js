import { collection, addDoc, doc, setDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import articlesData from '../data/articles.json';

// Function to setup initial articles in Firestore
export const setupArticlesInFirestore = async () => {
  try {
    console.log('Setting up articles in Firestore...');
    
    for (const article of articlesData.articles) {
      // Add featured flag to articles (make all articles featured for demo)
      const articleWithFeature = {
        ...article,
        featured: true, // Make all articles featured so we get 3 on homepage
        createdAt: new Date(),
        updatedAt: new Date(),
        // Convert publishedAt to Firestore timestamp format
        publishedAt: new Date(article.publishedAt)
      };
      
      // Use the article ID as document ID for consistent references
      await setDoc(doc(db, 'articles', article.id), articleWithFeature);
      console.log(`Added article: ${article.title}`);
    }
    
    console.log('All articles have been added to Firestore successfully!');
    return true;
  } catch (error) {
    console.error('Error setting up articles in Firestore:', error);
    throw error;
  }
};

// Function to add a new article to Firestore
export const addArticleToFirestore = async (articleData) => {
  try {
    const article = {
      ...articleData,
      createdAt: new Date(),
      updatedAt: new Date(),
      publishedAt: articleData.publishedAt ? new Date(articleData.publishedAt) : new Date(),
      featured: articleData.featured || false
    };
    
    if (articleData.id) {
      // Use specific ID if provided
      await setDoc(doc(db, 'articles', articleData.id), article);
      return articleData.id;
    } else {
      // Auto-generate ID
      const docRef = await addDoc(collection(db, 'articles'), article);
      return docRef.id;
    }
  } catch (error) {
    console.error('Error adding article to Firestore:', error);
    throw error;
  }
};

// Sample function to create a new article
export const createSampleArticle = () => {
  return {
    slug: 'sample-article',
    title: 'Sample Article',
    excerpt: 'This is a sample article created via Firestore integration.',
    publishedAt: new Date().toISOString(),
    tags: ['Sample', 'Firestore'],
    image: 'images/ai-content.jpg',
    featured: false,
    content: {
      title: 'Sample Article Title',
      sections: [
        {
          heading: 'Introduction',
          content: 'This is the introduction section of the sample article.'
        },
        {
          heading: 'Main Content',
          content: 'This is the main content section of the sample article.'
        }
      ]
    }
  };
};

// Helper function to validate Firebase configuration
export const validateFirebaseConfig = () => {
  if (!db) {
    throw new Error('Firebase is not properly configured. Please check your firebase.js configuration.');
  }
  return true;
};