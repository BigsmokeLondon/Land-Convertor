import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import * as L from 'leaflet';

// GIS Engine Synchronized Bootstrap
// Ensures Geoman/Turf patch the SAME Leaflet instance used by React
if (typeof window !== 'undefined') {
  // Ensure L is on window BEFORE scripts load
  const LeadletGlobal = L;
  (window as any).L = LeadletGlobal;

  const injectGIS = (url: string) => {
    return new Promise((resolve, reject) => {
      // Avoid double injection
      if (document.querySelector(`script[src="${url}"]`)) {
        resolve(true);
        return;
      }
      const script = document.createElement('script');
      script.src = url;
      script.async = true;
      script.onload = () => {
        console.log(`GIS Script Loaded: ${url}`);
        resolve(true);
      };
      script.onerror = reject;
      document.head.appendChild(script);
    });
  };

  // Sequential loading
  (async () => {
    try {
      await injectGIS("https://cdn.jsdelivr.net/npm/@turf/turf@7/turf.min.js");
      await injectGIS("https://unpkg.com/@geoman-io/leaflet-geoman-free@2.17.0/dist/leaflet-geoman.min.js");
      
      // Verification logic
      const checkGeoman = () => {
        // @ts-ignore
        if (LeadletGlobal.PM || LeadletGlobal.pm || (window as any).L?.PM) {
          console.log("GIS Restoration: Engines Synchronized & Verified.");
          return true;
        }
        return false;
      };

      if (!checkGeoman()) {
        let attempts = 0;
        const interval = setInterval(() => {
          attempts++;
          if (checkGeoman() || attempts > 10) {
            clearInterval(interval);
            // Launch app anyway so it's not stuck on blank screen
            launchApp();
          }
        }, 300);
      } else {
        launchApp();
      }
    } catch (e) {
      console.error("GIS Restoration Failed:", e);
      launchApp(); // Fallback
    }
  })();
}

function launchApp() {
  const rootElement = document.getElementById('root');
  if (!rootElement || (rootElement as any)._reactRoot) return; // Prevent double render
  
  createRoot(rootElement).render(
    <App />
  );
}

