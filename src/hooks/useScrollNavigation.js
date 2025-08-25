import { useNavigate, useLocation } from 'react-router-dom';
import { useCallback } from 'react';

const useScrollNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const scrollToElement = useCallback((targetId) => {
    const element = document.getElementById(targetId);
    if (element) {
      // Calculate header height offset
      const header = document.querySelector('.main-header');
      const headerHeight = header ? header.offsetHeight : 100; // fallback to 100px
      const additionalOffset = 20; // Extra space for better visual separation
      
      // Get element position
      const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
      const offsetPosition = elementPosition - headerHeight - additionalOffset;

      // Smooth scroll to calculated position
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  }, []);

  const handleNavigation = useCallback((href, onClose) => {
    // Close mobile menu if provided
    if (onClose) {
      onClose();
    }

    // Check if it's a hash link (starts with /#)
    if (href.startsWith('/#')) {
      const targetId = href.substring(2); // Remove '/#' to get the id
      
      // If we're already on the home page, just scroll to the element
      if (location.pathname === '/') {
        scrollToElement(targetId);
      } else {
        // Navigate to home page first, then scroll after navigation
        navigate('/');
        // Use setTimeout to ensure the page has loaded before scrolling
        setTimeout(() => {
          scrollToElement(targetId);
        }, 100);
      }
    } else {
      // Regular navigation for non-hash links
      navigate(href);
      // Scroll to top for regular page navigation
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 50);
    }
  }, [navigate, location, scrollToElement]);

  return handleNavigation;
};

export default useScrollNavigation;
