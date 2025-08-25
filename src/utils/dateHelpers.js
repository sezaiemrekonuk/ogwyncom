// Utility functions for handling dates consistently across the application

/**
 * Converts various date formats to a JavaScript Date object
 * Handles Firestore Timestamps, ISO strings, and Date objects
 */
export const parseDate = (dateValue) => {
  if (!dateValue) return null;
  
  // Handle Firestore Timestamp objects
  if (dateValue && typeof dateValue.toDate === 'function') {
    return dateValue.toDate();
  }
  
  // Handle Firestore Timestamp-like objects
  if (dateValue && typeof dateValue.seconds === 'number') {
    return new Date(dateValue.seconds * 1000);
  }
  
  // Handle regular Date objects
  if (dateValue instanceof Date) {
    return dateValue;
  }
  
  // Handle ISO strings and other formats
  const parsedDate = new Date(dateValue);
  return isNaN(parsedDate.getTime()) ? null : parsedDate;
};

/**
 * Formats a date for display in Turkish locale
 */
export const formatDate = (dateValue, options = { year: 'numeric', month: 'long' }) => {
  const date = parseDate(dateValue);
  
  if (!date) return 'Tarih belirtilmemiş';
  
  try {
    return date.toLocaleDateString('tr-TR', options);
  } catch (error) {
    console.warn('Date formatting error:', error);
    return 'Tarih formatlanamadı';
  }
};

/**
 * Returns a human-readable "time ago" string in Turkish
 */
export const getTimeAgo = (dateValue) => {
  const date = parseDate(dateValue);
  
  if (!date) return 'Bilinmeyen zaman';
  
  const now = new Date();
  const diffTime = Math.abs(now - date);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) return 'Bugün';
  if (diffDays === 1) return '1 gün önce';
  if (diffDays < 7) return `${diffDays} gün önce`;
  if (diffDays < 30) return `${Math.ceil(diffDays / 7)} hafta önce`;
  if (diffDays < 365) return `${Math.ceil(diffDays / 30)} ay önce`;
  return `${Math.ceil(diffDays / 365)} yıl önce`;
};

/**
 * Validates if a date value is valid
 */
export const isValidDate = (dateValue) => {
  const date = parseDate(dateValue);
  return date !== null && !isNaN(date.getTime());
};

/**
 * Formats date for display in article cards
 */
export const formatArticleDate = (dateValue) => {
  return formatDate(dateValue, { year: 'numeric', month: 'long' });
};

/**
 * Formats date for detailed article view
 */
export const formatDetailedDate = (dateValue) => {
  return formatDate(dateValue, { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
};