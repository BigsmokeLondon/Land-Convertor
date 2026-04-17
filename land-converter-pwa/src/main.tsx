import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import * as L from 'leaflet';

// GIS Engine Bootstrap - Ensures plugins find Leaflet
if (typeof window !== 'undefined') {
  (window as any).L = L;
}

createRoot(document.getElementById('root')!).render(
  <App />
)
