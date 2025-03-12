

import clarity from '@microsoft/clarity';
import { useEffect } from 'react';

// Your Clarity project ID
const CLARITY_PROJECT_ID = import.meta.env.VITE_CLARITY_PROJECT_ID;

// // Configure Clarity settings
// const clarityConfig = {
//   projectId: CLARITY_PROJECT_ID,
//   upload: 'https://www.clarity.ms/collect',
//   delay: 500, // Delay before starting to track (in milliseconds)
//   track: true, // Enable tracking
//   content: true, // Track content changes
//   // Optional: mask specific elements - add CSS selectors to mask
//   mask: ['input[type="password"]', '.credit-card', '.ssn'],
//   // Optional: if you want to enable debug mode to see console logs
//   debug: import.meta.env.DEV ? true : false,
//   // Optional: cookies settings
//   cookies: true, // Enable cookies for session tracking
// };

// Initialize Clarity with configuration
export const initClarity = () => {
  try {
    clarity.init(CLARITY_PROJECT_ID);
    console.log('Microsoft Clarity initialized successfully');
  } catch (e) {
    console.error('Failed to initialize Microsoft Clarity:', e);
  }
};

// Custom hook to initialize Clarity
export const useClarityTracking = () => {
  useEffect(() => {
    // Only initialize in production environment or remove this condition for testing
    if (import.meta.env.PROD || true) { // Force initialization for testing
      initClarity();
    }
  }, []);
};

// // Track custom events in Clarity
// export const trackClarityEvent = (eventName: string, eventData?: Record<string, any>) => {
//   try {
//     clarity.event(eventName, eventData);
//     console.log(`Clarity event tracked: ${eventName}`, eventData);
//   } catch (e) {
//     console.error(`Failed to track Clarity event ${eventName}:`, e);
//   }
// };

// // Set custom tags for better filtering in the Clarity dashboard
// export const setClarityTag = (tagName: string, tagValue: string) => {
//   try {
//     clarity.set(tagName, tagValue);
//     console.log(`Clarity tag set: ${tagName}=${tagValue}`);
//   } catch (e) {
//     console.error(`Failed to set Clarity tag ${tagName}:`, e);
//   }
// };

// Identify users if your privacy policy allows it
export const identifyUser = (userId: string) => {
  try {
    clarity.identify(userId);
    console.log(`Clarity user identified: ${userId}`);
  } catch (e) {
    console.error(`Failed to identify user in Clarity:`, e);
  }
};