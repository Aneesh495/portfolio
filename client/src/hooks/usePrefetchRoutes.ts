import { useEffect } from 'react';
import { useLocation } from 'wouter';

// List of routes to prefetch
const ROUTES_TO_PREFETCH = [
  '/',
  '/about',
  '/projects',
  '/experience',
  '/skills',
  '/games',
  '/contact',
];

/**
 * Hook to prefetch routes when the app loads
 * and when the user hovers over navigation links
 */
export function usePrefetchRoutes() {
  const [location] = useLocation();

  useEffect(() => {
    // Prefetch all routes when the app loads
    ROUTES_TO_PREFETCH.forEach(route => {
      if (route !== location) {
        prefetchRoute(route);
      }
    });

    // Add hover prefetching for navigation links
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const link = target.closest('a[href^="/"]') as HTMLAnchorElement | null;
      
      if (link) {
        const href = link.getAttribute('href');
        if (href && ROUTES_TO_PREFETCH.includes(href)) {
          prefetchRoute(href);
        }
      }
    };

    // Add event listeners for hover prefetching
    document.addEventListener('mouseover', handleMouseOver);

    return () => {
      document.removeEventListener('mouseover', handleMouseOver);
    };
  }, [location]);
}

/**
 * Prefetch resources for a specific route
 */
function prefetchRoute(route: string) {
  if (typeof window === 'undefined') return;

  // Skip if already prefetched
  if (window.__PREFETCHED_ROUTES?.has(route)) return;

  // Create a hidden link to trigger prefetch
  const link = document.createElement('link');
  link.rel = 'prefetch';
  link.href = route === '/' ? '/' : `/${route}`;
  link.as = 'document';
  
  // Add to document head
  document.head.appendChild(link);

  // Mark as prefetched
  if (!window.__PREFETCHED_ROUTES) {
    window.__PREFETCHED_ROUTES = new Set();
  }
  window.__PREFETCHED_ROUTES.add(route);
  
  // Clean up
  link.onload = () => document.head.removeChild(link);
}

// Extend Window interface to include our prefetch tracking
declare global {
  interface Window {
    __PREFETCHED_ROUTES?: Set<string>;
  }
}
