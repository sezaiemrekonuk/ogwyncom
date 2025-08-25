import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import MobileNav from './MobileNav';
import navigationData from '../data/navigation.json';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileNavOpen(false);
  }, [location]);

  const toggleMobileNav = () => {
    setIsMobileNavOpen(!isMobileNavOpen);
    document.body.style.overflow = !isMobileNavOpen ? 'hidden' : '';
  };

  return (
    <>
      <header className={`main-header ${isScrolled ? 'scrolled' : ''}`}>
        <div className="navbar-container">
          <Link to="/" className="logo">
            <img src="/images/logo.svg" alt="OGW Logo" />
          </Link>
          <nav className="main-nav-desktop">
            {navigationData.mainNavigation.map((item) => (
              <Link key={item.id} to={item.href} className="nav-link">
                {item.label}
              </Link>
            ))}
          </nav>
          <button 
            className="hamburger" 
            aria-label="Menüyü aç/kapat"
            onClick={toggleMobileNav}
          >
            {isMobileNavOpen ? <X /> : <Menu />}
          </button>
        </div>
      </header>
      <MobileNav 
        isOpen={isMobileNavOpen} 
        onClose={() => setIsMobileNavOpen(false)} 
      />
    </>
  );
};

export default Header;