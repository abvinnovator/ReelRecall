

import ReactGA from 'react-ga4';

const MEASUREMENT_ID = import.meta.env.VITE_MEASUREMENT_ID;

export const initGA = () => {

  ReactGA.initialize(MEASUREMENT_ID);
};

export const logPageView = (path: string) => {
  
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