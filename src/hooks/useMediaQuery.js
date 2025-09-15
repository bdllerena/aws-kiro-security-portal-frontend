// useMediaQuery.js - Custom hook for responsive design
import { useState, useEffect } from 'react';

export const useMediaQuery = (query) => {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    if (media.matches !== matches) {
      setMatches(media.matches);
    }
    
    const listener = () => setMatches(media.matches);
    media.addEventListener('change', listener);
    
    return () => media.removeEventListener('change', listener);
  }, [matches, query]);

  return matches;
};

// Common breakpoints
export const useMobile = () => useMediaQuery('(max-width: 768px)');
export const useTablet = () => useMediaQuery('(max-width: 1024px)');
export const useDesktop = () => useMediaQuery('(min-width: 1025px)');
