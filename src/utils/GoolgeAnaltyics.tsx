// 1. First, install the required package:
// npm install react-ga4

// 2. Create a new file called GoogleAnalytics.tsx:

import ReactGA from 'react-ga4';

// Your Google Analytics measurement ID
const MEASUREMENT_ID = import.meta.env.MEASUREMENT_ID; // Replace with your actual measurement ID

export const initGA = () => {
  // Initialize Google Analytics
  ReactGA.initialize(MEASUREMENT_ID);
};

export const logPageView = (path: string) => {
  // Log page views
  ReactGA.send({ hitType: 'pageview', page: path });
};

export const logEvent = (category: string, action: string, label?: string, value?: number) => {
  // Log custom events
  ReactGA.event({
    category,
    action,
    label,
    value
  });
};