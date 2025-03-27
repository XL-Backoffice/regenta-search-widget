import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const useBodyClass = () => {
  const location = useLocation();

  useEffect(() => {
    // Extract the page name from the current path
    const pageName = location.pathname.replace('/', '') || 'home'; // Default to 'home' if root

    // Add a class to the body element
    document.body.className = `page-${pageName}`;

    // Cleanup function to remove class on component unmount
    return () => {
      document.body.className = '';
    };
  }, [location]);
};

export default useBodyClass;