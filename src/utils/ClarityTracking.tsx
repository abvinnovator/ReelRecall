// 1. Create a new file called ClarityTracking.tsx

import { useEffect } from 'react';

declare global {
  interface Window {
    clarity: any;
  }
}

export const CLARITY_PROJECT_ID = 'qn3j40oost'; // Replace with your actual Project ID

export const initClarity = () => {
  if (window.clarity) return; // Prevent duplicate initialization
  
  const script = document.createElement('script');
  script.type = 'text/javascript';
  script.async = true;
  script.src = `https://www.clarity.ms/tag/${CLARITY_PROJECT_ID}`;
  
  // Add the script to the document head
  const head = document.head || document.getElementsByTagName('head')[0];
  head.appendChild(script);
};

// Hook to initialize Clarity
export const useClarityTracking = () => {
  useEffect(() => {
    // Only initialize in production environment
    if (import.meta.env.PROD) {
      initClarity();
    }
  }, []);
};

// Function to manually track events (if needed)
export const trackClarityEvent = (eventName: string) => {
  if (window.clarity) {
    window.clarity('event', eventName);
  }
};