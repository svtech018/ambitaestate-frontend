import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      window.requestAnimationFrame(() => {
        const target = document.querySelector(hash);
        if (target instanceof HTMLElement) {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
      return;
    }

    window.scrollTo(0, 0);
  }, [pathname, hash]);

  return null;
}
