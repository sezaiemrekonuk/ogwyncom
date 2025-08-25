import { Link } from 'react-router-dom';
import navigationData from '../data/navigation.json';

const MobileNav = ({ isOpen, onClose }) => {
  return (
    <nav className={`mobile-nav ${isOpen ? 'is-active' : ''}`}>
      {navigationData.mainNavigation.map((item) => (
        <Link 
          key={item.id} 
          to={item.href} 
          className="nav-link"
          onClick={onClose}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
};

export default MobileNav;