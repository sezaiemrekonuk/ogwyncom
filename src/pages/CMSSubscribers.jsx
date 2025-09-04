import { useState, useEffect } from 'react';
import { getNewsletterSubscribers } from '../config/firebase';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import CMSLayout from '../components/CMSLayout';

const CMSSubscribers = () => {
  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSubscribers = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getNewsletterSubscribers();
      setSubscribers(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscribers();
  }, []);

  const formatDate = (date) => {
    if (!date) return 'Bilinmiyor';
    const dateObj = date.toDate ? date.toDate() : new Date(date);
    return dateObj.toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return '#00FF1E';
      case 'unsubscribed':
        return '#ff6b6b';
      default:
        return '#666';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'active':
        return 'Aktif';
      case 'unsubscribed':
        return 'Çıkış Yapmış';
      default:
        return status;
    }
  };

  if (loading) {
    return (
      <CMSLayout activeSection="subscribers">
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
          <LoadingSpinner size="large" />
        </div>
      </CMSLayout>
    );
  }

  return (
    <CMSLayout activeSection="subscribers">
      <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ color: 'var(--white)', fontSize: '2rem', margin: 0 }}>
          Bülten Aboneleri
        </h1>
        <div style={{ color: 'var(--text-gray)' }}>
          Toplam: {subscribers.filter(s => s.status === 'active').length} aktif abone
        </div>
      </div>

      {error && (
        <ErrorMessage 
          error={error} 
          onRetry={fetchSubscribers}
          style={{ marginBottom: '2rem' }}
        />
      )}

      {subscribers.length === 0 ? (
        <div style={{ 
          textAlign: 'center', 
          color: 'var(--text-gray)', 
          padding: '4rem',
          backgroundColor: 'rgba(255, 255, 255, 0.05)',
          borderRadius: '12px'
        }}>
          <p>Henüz abone bulunmuyor.</p>
        </div>
      ) : (
        <div style={{ 
          backgroundColor: 'rgba(255, 255, 255, 0.05)',
          borderRadius: '12px',
          overflow: 'hidden'
        }}>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: '2fr 1fr 1fr 1fr',
            gap: '1rem',
            padding: '1rem 1.5rem',
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            fontWeight: '600',
            color: 'var(--white)',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
          }}>
            <div>E-posta</div>
            <div>Durum</div>
            <div>Kaynak</div>
            <div>Tarih</div>
          </div>

          {subscribers.map((subscriber) => (
            <div 
              key={subscriber.id}
              style={{ 
                display: 'grid', 
                gridTemplateColumns: '2fr 1fr 1fr 1fr',
                gap: '1rem',
                padding: '1rem 1.5rem',
                borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                color: 'var(--text-gray)',
                transition: 'background-color 0.2s'
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.02)'}
              onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
            >
              <div style={{ color: 'var(--white)', fontWeight: '500' }}>
                {subscriber.email}
              </div>
              <div style={{ 
                color: getStatusColor(subscriber.status),
                fontWeight: '500'
              }}>
                {getStatusText(subscriber.status)}
              </div>
              <div>
                {subscriber.source === 'website-footer' ? 'Website Footer' : subscriber.source || 'Bilinmiyor'}
              </div>
              <div>
                {formatDate(subscriber.subscribedAt)}
              </div>
            </div>
          ))}
        </div>
      )}

      <div style={{ 
        marginTop: '2rem',
        padding: '1rem',
        backgroundColor: 'rgba(0, 255, 30, 0.1)',
        borderRadius: '8px',
        border: '1px solid var(--primary-green)',
        color: 'var(--primary-green)'
      }}>
        <strong>İpucu:</strong> Yeni aboneler otomatik olarak "newsletter-subscribers" koleksiyonuna kaydedilir.
        Abonelik durumu ve tarih bilgileri de otomatik olarak takip edilir.
      </div>
    </CMSLayout>
  );
};

export default CMSSubscribers;
