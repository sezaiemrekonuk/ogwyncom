import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, doc, getDoc, addDoc, updateDoc, deleteDoc, query, orderBy, limit, where } from 'firebase/firestore';
import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';

const {
  VITE_FIREBASE_API_KEY,
  VITE_FIREBASE_AUTH_DOMAIN,
  VITE_FIREBASE_PROJECT_ID,
  VITE_FIREBASE_STORAGE_BUCKET,
  VITE_FIREBASE_MESSAGING_SENDER_ID,
  VITE_FIREBASE_APP_ID,
  VITE_FIREBASE_MEASUREMENT_ID,
} = import.meta.env;

const firebaseConfig = {
  apiKey: VITE_FIREBASE_API_KEY,
  authDomain: VITE_FIREBASE_AUTH_DOMAIN,
  projectId: VITE_FIREBASE_PROJECT_ID,
  storageBucket: VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: VITE_FIREBASE_APP_ID,
  measurementId: VITE_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);

// Firestore service functions for articles/blogs
export const getArticles = async (limitCount = null) => {
  try {
    const articlesRef = collection(db, 'articles');
    let q = query(articlesRef, orderBy('publishedAt', 'desc'));
    
    if (limitCount) {
      q = query(articlesRef, orderBy('publishedAt', 'desc'), limit(limitCount));
    }
    
    const querySnapshot = await getDocs(q);
    const articles = [];
    
    querySnapshot.forEach((doc) => {
      articles.push({
        id: doc.id,
        ...doc.data()
      });
    });
    return articles;
  } catch (error) {
    console.error('Error fetching articles:', error);
    throw new Error('Failed to fetch articles from database');
  }
};

export const getFeaturedArticles = async (limitCount = 3) => {
  try {
    const articlesRef = collection(db, 'articles');
    const q = query(
      articlesRef, 
      where('featured', '==', true),
      orderBy('publishedAt', 'desc'),
      limit(limitCount)
    );
    
    const querySnapshot = await getDocs(q);
    const articles = [];
    
    querySnapshot.forEach((doc) => {
      articles.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    // If not enough featured articles, get additional regular articles to reach limit
    if (articles.length < limitCount) {
      // Get regular articles to fill the gap
      const additionalNeeded = limitCount - articles.length;
      const regularArticles = await getArticles(additionalNeeded * 2); // Get more to filter out duplicates
      
      // Filter out articles that are already in featured list
      const featuredIds = articles.map(a => a.id);
      const additionalArticles = regularArticles
        .filter(article => !featuredIds.includes(article.id))
        .slice(0, additionalNeeded);
      
      return [...articles, ...additionalArticles];
    }
    return articles;
  } catch (error) {
    console.error('Error fetching featured articles:', error);
    // Fallback to regular articles
    console.log('Featured articles error, falling back to regular articles');
    return await getArticles(limitCount);
  }
};

export const getArticleBySlug = async (slug) => {
  try {
    const articlesRef = collection(db, 'articles');
    const q = query(articlesRef, where('slug', '==', slug), limit(1));
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      return null;
    }
    
    const doc = querySnapshot.docs[0];
    return {
      id: doc.id,
      ...doc.data()
    };
  } catch (error) {
    console.error('Error fetching article by slug:', error);
    throw new Error(`Failed to fetch article with slug: ${slug}`);
  }
};

export const getArticleById = async (id) => {
  try {
    const docRef = doc(db, 'articles', id);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data()
      };
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error fetching article by ID:', error);
    throw new Error(`Failed to fetch article with ID: ${id}`);
  }
};

// Authentication functions
export const signInAdmin = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    console.error('Error signing in:', error);
    throw error;
  }
};

export const signOutAdmin = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error('Error signing out:', error);
    throw error;
  }
};

export const onAuthStateChange = (callback) => {
  return onAuthStateChanged(auth, callback);
};

// Article management functions for CMS
export const createArticle = async (articleData) => {
  try {
    const docRef = await addDoc(collection(db, 'articles'), {
      ...articleData,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    return docRef.id;
  } catch (error) {
    console.error('Error creating article:', error);
    throw error;
  }
};

export const updateArticle = async (id, articleData) => {
  try {
    const docRef = doc(db, 'articles', id);
    await updateDoc(docRef, {
      ...articleData,
      updatedAt: new Date()
    });
  } catch (error) {
    console.error('Error updating article:', error);
    throw error;
  }
};

export const deleteArticle = async (id) => {
  try {
    await deleteDoc(doc(db, 'articles', id));
  } catch (error) {
    console.error('Error deleting article:', error);
    throw error;
  }
};

// Category management functions
export const getCategories = async () => {
  try {
    const categoriesRef = collection(db, 'categories');
    const querySnapshot = await getDocs(categoriesRef);
    const categories = [];
    
    querySnapshot.forEach((doc) => {
      categories.push({
        id: doc.id,
        ...doc.data()
      });
    });
    return categories;
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
};

export const createCategory = async (categoryData) => {
  try {
    const docRef = await addDoc(collection(db, 'categories'), {
      ...categoryData,
      createdAt: new Date()
    });
    return docRef.id;
  } catch (error) {
    console.error('Error creating category:', error);
    throw error;
  }
};

export const updateCategory = async (id, categoryData) => {
  try {
    const docRef = doc(db, 'categories', id);
    await updateDoc(docRef, categoryData);
  } catch (error) {
    console.error('Error updating category:', error);
    throw error;
  }
};

export const deleteCategory = async (id) => {
  try {
    await deleteDoc(doc(db, 'categories', id));
  } catch (error) {
    console.error('Error deleting category:', error);
    throw error;
  }
};

// Tag management functions
export const getTags = async () => {
  try {
    const tagsRef = collection(db, 'tags');
    const querySnapshot = await getDocs(tagsRef);
    const tags = [];
    
    querySnapshot.forEach((doc) => {
      tags.push({
        id: doc.id,
        ...doc.data()
      });
    });
    return tags;
  } catch (error) {
    console.error('Error fetching tags:', error);
    throw error;
  }
};

export const createTag = async (tagData) => {
  try {
    const docRef = await addDoc(collection(db, 'tags'), {
      ...tagData,
      createdAt: new Date()
    });
    return docRef.id;
  } catch (error) {
    console.error('Error creating tag:', error);
    throw error;
  }
};

export const updateTag = async (id, tagData) => {
  try {
    const docRef = doc(db, 'tags', id);
    await updateDoc(docRef, tagData);
  } catch (error) {
    console.error('Error updating tag:', error);
    throw error;
  }
};

export const deleteTag = async (id) => {
  try {
    await deleteDoc(doc(db, 'tags', id));
  } catch (error) {
    console.error('Error deleting tag:', error);
    throw error;
  }
};

// Image upload functions
export const uploadImage = async (file, path = 'images') => {
  try {
    // Generate unique filename with timestamp
    const timestamp = Date.now();
    const fileExtension = file.name.split('.').pop();
    const filename = `${timestamp}-${Math.random().toString(36).substring(7)}.${fileExtension}`;
    
    // Create storage reference
    const imageRef = ref(storage, `${path}/${filename}`);
    
    // Upload file
    const snapshot = await uploadBytes(imageRef, file);
    
    // Get download URL
    const downloadURL = await getDownloadURL(snapshot.ref);
    
    return {
      url: downloadURL,
      path: `${path}/${filename}`,
      name: filename
    };
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
};

export const deleteImage = async (imagePath) => {
  try {
    const imageRef = ref(storage, imagePath);
    await deleteObject(imageRef);
  } catch (error) {
    console.error('Error deleting image:', error);
    throw error;
  }
};

// Newsletter subscription functions
export const subscribeToNewsletter = async (email) => {
  try {
    // Check if email already exists
    const subscribersRef = collection(db, 'newsletter-subscribers');
    const q = query(subscribersRef, where('email', '==', email.toLowerCase()), limit(1));
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      throw new Error('Bu e-posta adresi zaten kayıtlı!');
    }
    
    // Add new subscriber
    const docRef = await addDoc(subscribersRef, {
      email: email.toLowerCase(),
      subscribedAt: new Date(),
      status: 'active',
      source: 'website-footer'
    });
    
    return {
      success: true,
      id: docRef.id,
      message: 'Başarıyla abone oldunuz!'
    };
  } catch (error) {
    console.error('Error subscribing to newsletter:', error);
    if (error.message.includes('zaten kayıtlı')) {
      throw error;
    }
    throw new Error('Abonelik sırasında bir hata oluştu. Lütfen tekrar deneyin.');
  }
};

export const getNewsletterSubscribers = async () => {
  try {
    const subscribersRef = collection(db, 'newsletter-subscribers');
    const q = query(subscribersRef, orderBy('subscribedAt', 'desc'));
    const querySnapshot = await getDocs(q);
    const subscribers = [];
    
    querySnapshot.forEach((doc) => {
      subscribers.push({
        id: doc.id,
        ...doc.data()
      });
    });
    return subscribers;
  } catch (error) {
    console.error('Error fetching newsletter subscribers:', error);
    throw error;
  }
};

export const unsubscribeFromNewsletter = async (email) => {
  try {
    const subscribersRef = collection(db, 'newsletter-subscribers');
    const q = query(subscribersRef, where('email', '==', email.toLowerCase()), limit(1));
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      throw new Error('Bu e-posta adresi bulunamadı.');
    }
    
    const docId = querySnapshot.docs[0].id;
    const docRef = doc(db, 'newsletter-subscribers', docId);
    await updateDoc(docRef, {
      status: 'unsubscribed',
      unsubscribedAt: new Date()
    });
    
    return {
      success: true,
      message: 'Abonelikten çıkış işlemi tamamlandı.'
    };
  } catch (error) {
    console.error('Error unsubscribing from newsletter:', error);
    throw error;
  }
};