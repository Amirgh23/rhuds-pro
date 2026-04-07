declare global {
  interface Window {
    dataLayer?: any[];
    gtag?: (...args: any[]) => void;
    skipWaiting?: () => void;
    __REDUX_DEVTOOLS_EXTENSION__?: any;
    __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: any;
    __SENTRY__?: any;
  }
}

export {};
