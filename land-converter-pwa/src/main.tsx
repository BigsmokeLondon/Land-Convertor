import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import * as L from 'leaflet';

// GIS Engine Synchronized Bootstrap
// Ensures Geoman/Turf patch the SAME Leaflet instance used by React
if (typeof window !== 'undefined') {
  (window as any).L = L;

  const injectGIS = (url: string) => {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = url;
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    });
  };

  // Sequential loading to avoid race conditions
  (async () => {
    try {
      await injectGIS("https://cdn.jsdelivr.net/npm/@turf/turf@7/turf.min.js");
      await injectGIS("https://unpkg.com/@geoman-io/leaflet-geoman-free@2.17.0/dist/leaflet-geoman.min.js");
      console.log("GIS Restoration: Engines Synchronized.");
    } catch (e) {
      console.error("GIS Restoration Failed:", e);
    }
  })();
}

createRoot(document.getElementById('root')!).render(
  <App />
)
