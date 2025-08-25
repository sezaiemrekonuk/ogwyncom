import { Link } from 'react-router-dom';
import { Facebook, Instagram, Linkedin, Youtube } from 'lucide-react';
import navigationData from '../data/navigation.json';

const iconMap = {
  facebook: Facebook,
  instagram: Instagram,
  linkedin: Linkedin,
  youtube: Youtube,
};

const Footer = () => {
  const handleSubscribe = (e) => {
    e.preventDefault();
    // TODO: Implement newsletter subscription
    console.log('Newsletter subscription functionality to be implemented');
  };

  return (
    <footer className="footer-wrapper">
      <div className="footer-container">
        <div className="footer-column subscribe-column">
          <img src="/images/logo.svg" alt="OGW Logo" className="footer-logo" />
          <h4>Bültenimize katılın</h4>
          <p>İlham verici içeriklere ilk siz ulaşın. Haftada 43 e-posta değil, ayda sadece 2 tane.</p>
          <form className="subscribe-form" onSubmit={handleSubscribe}>
            <input type="email" placeholder="E-posta" required />
            <button type="submit" className="btn btn-primary">
              Abone Ol
            </button>
          </form>
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