// Add TypeScript declaration for window.gtag
declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
  }
}

import { useEffect } from "react";
import { useLocation } from "wouter";

/**
 * Tracks page views and custom events with Google Analytics (gtag.js)
 * Usage:
 *   useGoogleAnalytics(); // in App or root component
 *   logEvent({ action: 'click', category: 'Button', label: 'Contact', value: 1 });
 */

export function useGoogleAnalytics() {
  const [location] = useLocation();

  useEffect(() => {
    if (typeof window.gtag === "function") {
      window.gtag("event", "page_view", {
        page_path: location,
      });
    }
  }, [location]);
}

/**
 * Log a custom event to Google Analytics
 * @param params
 *   action: string (required)
 *   category: string (recommended)
 *   label: string (optional)
 *   value: number (optional)
 */
export function logEvent({ action, category, label, value }: {
  action: string;
  category?: string;
  label?: string;
  value?: number;
}) {
  if (typeof window.gtag === "function") {
    window.gtag("event", action, {
      event_category: category,
      event_label: label,
      value,
    });
  }
}
