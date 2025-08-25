import { useState } from 'react';
import { setupArticlesInFirestore, addArticleToFirestore, createSampleArticle, validateFirebaseConfig } from '../utils/setupFirestoreData';
import { getArticles } from '../config/firebase';

const FirestoreAdmin = () => {
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSetupInitialData = async () => {
    setLoading(true);
    setStatus('Setting up initial data...');
    
    try {
      validateFirebaseConfig();
      await setupArticlesInFirestore();
      setStatus('✅ Initial data setup completed successfully! Check console for details.');
    } catch (error) {
      setStatus(`❌ Error: ${error.message}`);
      console.error('Setup error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddSampleArticle = async () => {
    setLoading(true);
    setStatus('Adding sample article...');
    
    try {
      validateFirebaseConfig();
      const sampleArticle = createSampleArticle();
      const articleId = await addArticleToFirestore(sampleArticle);
      setStatus(`✅ Sample article added successfully! ID: ${articleId}`);
    } catch (error) {
      setStatus(`❌ Error: ${error.message}`);
      console.error('Add article error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleValidateConfig = () => {
    try {
      validateFirebaseConfig();
      setStatus('✅ Firebase configuration is valid!');
    } catch (error) {
      setStatus(`❌ Configuration Error: ${error.message}`);
    }
  };

  const handleTestData = async () => {
    setLoading(true);
    setStatus('Testing current data...');
    
    try {
      validateFirebaseConfig();
      const articles = await getArticles(3);
      console.log('Current articles in database:', articles);
      
      if (articles.length === 0) {
        setStatus('⚠️ No articles found in database. Use "Setup Initial Data" first.');
      } else {
        setStatus(`✅ Found ${articles.length} articles. Check console for details.`);
        articles.forEach((article, index) => {
          console.log(`Article ${index + 1}:`, {
            id: article.id,
            title: article.title,
            publishedAt: article.publishedAt,
            publishedAtType: typeof article.publishedAt,
            isTimestamp: article.publishedAt && typeof article.publishedAt.toDate === 'function'
          });
        });
      }
    } catch (error) {
      setStatus(`❌ Error: ${error.message}`);
      console.error('Test data error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      bottom: '20px',
      right: '20px',
      background: 'var(--dark-gray)',
      border: '1px solid var(--border-color)',
      borderRadius: 'var(--border-radius)',
      padding: '1rem',
      minWidth: '300px',
      zIndex: 9999
    }}>
      <h3 style={{ marginBottom: '1rem', fontSize: '1rem' }}>Firestore Admin</h3>
      
      <div style={{ marginBottom: '1rem' }}>
        <button 
          onClick={handleValidateConfig}
          style={{
            background: 'var(--primary-green)',
            color: 'var(--main-bg)',
            border: 'none',
            padding: '0.5rem 1rem',
            borderRadius: '4px',
            cursor: 'pointer',
            marginRight: '0.5rem',
            marginBottom: '0.5rem'
          }}
        >
          Validate Config
        </button>
        
        <button 
          onClick={handleSetupInitialData}
          disabled={loading}
          style={{
            background: loading ? '#666' : 'var(--primary-green)',
            color: 'var(--main-bg)',
            border: 'none',
            padding: '0.5rem 1rem',
            borderRadius: '4px',
            cursor: loading ? 'not-allowed' : 'pointer',
            marginRight: '0.5rem',
            marginBottom: '0.5rem'
          }}
        >
          {loading ? 'Loading...' : 'Setup Initial Data'}
        </button>
        
        <button 
          onClick={handleAddSampleArticle}
          disabled={loading}
          style={{
            background: loading ? '#666' : '#007acc',
            color: 'white',
            border: 'none',
            padding: '0.5rem 1rem',
            borderRadius: '4px',
            cursor: loading ? 'not-allowed' : 'pointer',
            marginRight: '0.5rem',
            marginBottom: '0.5rem'
          }}
        >
          {loading ? 'Loading...' : 'Add Sample Article'}
        </button>
        
        <button 
          onClick={handleTestData}
          disabled={loading}
          style={{
            background: loading ? '#666' : '#ff6b35',
            color: 'white',
            border: 'none',
            padding: '0.5rem 1rem',
            borderRadius: '4px',
            cursor: loading ? 'not-allowed' : 'pointer',
            marginBottom: '0.5rem'
          }}
        >
          {loading ? 'Loading...' : 'Test Current Data'}
        </button>
      </div>
      
      {status && (
        <div style={{
          padding: '0.5rem',
          background: status.includes('❌') ? 'rgba(255, 0, 0, 0.1)' : 'rgba(0, 255, 0, 0.1)',
          borderRadius: '4px',
          fontSize: '0.875rem',
          wordBreak: 'break-word'
        }}>
          {status}
        </div>
      )}
      
      <div style={{
        marginTop: '1rem',
        fontSize: '0.75rem',
        color: 'var(--text-gray)',
        borderTop: '1px solid var(--border-color)',
        paddingTop: '0.5rem'
      }}>
        <p>This admin panel is for development only.</p>
        <p>Remove before production!</p>
      </div>
    </div>
  );
};

export default FirestoreAdmin;