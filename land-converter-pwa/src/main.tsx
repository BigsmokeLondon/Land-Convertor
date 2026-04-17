import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import * as L from 'leaflet';

// REDEPLOY PING: GIS Engine Bootstrap
if (typeof window !== 'undefined') {
  (window as any).L = L;
  
  // Inject Geoman specifically after Leaflet is global
  const script = document.createElement('script');
  script.src = "https://unpkg.com/@geoman-io/leaflet-geoman-free@2.17.0/dist/leaflet-geoman.js";
  document.head.appendChild(script);
}

createRoot(document.getElementById('root')!).render(
  <App />
)
