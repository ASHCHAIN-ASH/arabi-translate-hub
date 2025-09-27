import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Multiple methods to ensure scroll to top works on all browsers and scenarios
    
    // Method 1: Immediate scroll to top
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'auto'
    });
    
    // Method 2: Fallback for older browsers
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    
    // Method 3: Force using requestAnimationFrame for immediate execution
    requestAnimationFrame(() => {
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    });
    
    // Method 4: Final check with setTimeout
    setTimeout(() => {
      if (window.pageYOffset > 0 || document.documentElement.scrollTop > 0 || document.body.scrollTop > 0) {
        window.scrollTo(0, 0);
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;
      }
    }, 0);
  }, [pathname]);

  return null;
};

export default ScrollToTop;