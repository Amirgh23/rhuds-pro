import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { initChunkMonitoring } from './utils/chunk-monitor';
import { initHttp2PushMonitoring } from './utils/http2-push';
import { initPreloadMonitoring } from './utils/preload-prefetch';
import { initResourceHintMonitoring } from './utils/resource-hints-optimization';
import './index.css';
import './styles/hud-fonts.css';

// Initialize chunk monitoring for performance tracking
initChunkMonitoring();

// Initialize HTTP/2 push monitoring
initHttp2PushMonitoring();

// Initialize preload/prefetch monitoring
initPreloadMonitoring();

// Initialize resource hints optimization monitoring
initResourceHintMonitoring();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
