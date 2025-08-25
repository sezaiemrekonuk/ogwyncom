import navigationData from '../data/navigation.json';

const MobileNav = ({ isOpen, onClose, handleNavigation }) => {
  return (
    <nav className={`mobile-nav ${isOpen ? 'is-active' : ''}`}>
      {navigationData.mainNavigation.map((item) => (
        <button 
          key={item.id} 
          onClick={() => handleNavigation(item.href, onClose)}
          className="nav-link"
          style={{ background: 'none', border: 'none', cursor: 'pointer' }}
        >
          {item.label}
        </button>
      ))}
    </nav>
  );
};

export default MobileNav;