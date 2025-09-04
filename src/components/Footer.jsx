import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Linkedin, Youtube } from 'lucide-react';
import navigationData from '../data/navigation.json';
import { subscribeToNewsletter } from '../config/firebase';

const iconMap = {
  facebook: Facebook,
  instagram: Instagram,
  linkedin: Linkedin,
  youtube: Youtube,
};

const Footer = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState(''); // 'success' or 'error'

  const handleSubscribe = async (e) => {
    e.preventDefault();
    
    if (!email.trim()) {
      setMessage('Lütfen geçerli bir e-posta adresi girin.');
      setMessageType('error');
      return;
    }

    setIsLoading(true);
    setMessage('');
    
    try {
      const result = await subscribeToNewsletter(email);
      setMessage(result.message);
      setMessageType('success');
      setEmail(''); // Clear the form
    } catch (error) {
      setMessage(error.message);
      setMessageType('error');
    } finally {
      setIsLoading(false);
      // Clear message after 5 seconds
      setTimeout(() => {
        setMessage('');
        setMessageType('');
      }, 5000);
    }
  };

  return (
    <footer className="footer-wrapper">
      <div className="footer-container">
        <div className="footer-column subscribe-column">
          <img src="/images/logo.svg" alt="OGW Logo" className="footer-logo" />
          <h4>Bültenimize katılın</h4>
          <p>İlham verici içeriklere ilk siz ulaşın. Haftada 43 e-posta değil, ayda sadece 2 tane.</p>
          <form className="subscribe-form" onSubmit={handleSubscribe}>
            <input 
              type="email" 
              placeholder="E-posta" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
              disabled={isLoading}
            />
            <button type="submit" className="btn btn-primary" disabled={isLoading}>
              {isLoading ? 'Kaydediliyor...' : 'Abone Ol'}
            </button>
          </form>
          {message && (
            <div 
              style={{
                marginTop: '1rem',
                padding: '0.75rem',
                borderRadius: '8px',
                fontSize: '0.9rem',
                backgroundColor: messageType === 'success' 
                  ? 'rgba(0, 255, 30, 0.1)' 
                  : 'rgba(255, 0, 0, 0.1)',
                color: messageType === 'success' 
                  ? 'var(--primary-green)' 
                  : '#ff6b6b',
                border: `1px solid ${messageType === 'success' 
                  ? 'var(--primary-green)' 
                  : '#ff6b6b'}`
              }}
            >
              {message}
            </div>
          )}
        </div>
        
        <div className="footer-column links-column">
          <h6>Site Haritası</h6>
          <ul>
            {navigationData.footerNavigation.siteMap.map((item, index) => (
              <li key={index}>
                <Link to={item.href}>{item.label}</Link>
              </li>
            ))}
          </ul>
        </div>
        
        <div className="footer-column links-column">
          <h6>Şirket</h6>
          <ul>
            {navigationData.footerNavigation.company.map((item, index) => (
              <li key={index}>
                <Link to={item.href}>{item.label}</Link>
              </li>
            ))}
          </ul>
        </div>
        
        <div className="footer-social-links">
          {navigationData.socialLinks.map((social) => {
            const IconComponent = iconMap[social.icon];
            return (
              <a
                key={social.id}
                href={social.href}
                target={social.href.startsWith('http') ? '_blank' : undefined}
                rel={social.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                aria-label={social.label}
                title={social.label}
              >
                <IconComponent />
              </a>
            );
          })}
        </div>
      </div>
    </footer>
  );
};

export default Footer;