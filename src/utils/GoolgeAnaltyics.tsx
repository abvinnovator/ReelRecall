

import ReactGA from 'react-ga4';

// Your Google Analytics measurement ID
const MEASUREMENT_ID = import.meta.env.VITE_MEASUREMENT_ID; // Replace with your actual measurement ID

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