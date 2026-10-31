import { useEffect } from 'react';

export const useScrollReveal = () => {
  useEffect(() => {
    // Check if running in browser
    if (typeof window === 'undefined') return;

    const revealAll = () => {
      document.querySelectorAll('.reveal-on-scroll').forEach((el) => {
        el.classList.add('is-visible');
      });
    };

    // Fallback if IntersectionObserver is unavailable or reduced motion is preferred
    if (!('IntersectionObserver' in window) || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      revealAll();
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.05,
        rootMargin: '0px 0px 60px 0px', // Trigger slightly before entering viewport for seamless reveal
      }
    );

    const observeElements = () => {
      const elements = document.querySelectorAll('.reveal-on-scroll:not(.is-visible)');
      elements.forEach((el) => observer.observe(el));
    };

    observeElements();

    // Observe DOM mutations so dynamically mounted items (episodes, reviews) are automatically tracked
    const mutationObserver = new MutationObserver(() => {
      observeElements();
    });

    if (document.body) {
      mutationObserver.observe(document.body, {
        childList: true,
        subtree: true,
      });
    }

    return () => {
      observer.disconnect();
      mutationObserver.disconnect();
    };
  }, []);
};
