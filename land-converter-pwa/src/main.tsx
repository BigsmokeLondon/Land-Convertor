import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import * as L from 'leaflet';

// Simple Glue: Expose Leaflet to CDN plugins
if (typeof window !== 'undefined') {
  (window as any).L = L;
}

const rootElement = document.getElementById('root');
if (rootElement) {
  createRoot(rootElement).render(<App />);
}
