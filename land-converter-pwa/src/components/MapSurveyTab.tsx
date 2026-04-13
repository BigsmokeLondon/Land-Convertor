import { useState, useCallback, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Polygon, useMapEvents } from 'react-leaflet';
import { Save, Download, MapPin, Navigation, Trash2, RotateCcw, Crosshair, Camera, Search } from 'lucide-react';
import 'leaflet/dist/leaflet.css';
import * as L from 'leaflet';
import html2canvas from 'html2canvas';
import { generateKML, generatePDF } from '../utils/exporting';
import { CompassTool } from './CompassTool';

// Area calculation spherical
const calculateAreaSqFt = (points: any[]) => {
  try {
    if (!points || points.length < 3) return 0;
    let area = 0;
    for (let i = 0; i < points.length; i++) {
        const p1 = points[i];
        const p2 = points[(i + 1) % points.length];
        if (!p1 || !p2) continue;
        area += ((p2.lng - p1.lng) * Math.PI / 180) * 
                (2 + Math.sin(p1.lat * Math.PI / 180) + Math.sin(p2.lat * Math.PI / 180));
    }
    area = area * 6378137.0 * 6378137.0 / 2.0;
    return Math.abs(area) * 10.7639; // sq meters to sq ft
  } catch (e) {
    console.error("Area Calculation Error:", e);
    return 0;
  }
};

// Haversine: distance between two GPS points in feet
const haversineDistanceFt = (p1: any, p2: any): number => {
  const R = 6378137; // Earth radius in meters
  const dLat = (p2.lat - p1.lat) * Math.PI / 180;
  const dLng = (p2.lng - p1.lng) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(p1.lat * Math.PI / 180) * Math.cos(p2.lat * Math.PI / 180) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)) * 3.28084; // meters → feet
};

// Total boundary/perimeter length (open polyline, NOT closed back to start)
const calculatePerimeterFt = (points: any[]): number => {
  if (!points || points.length < 2) return 0;
  let total = 0;
  for (let i = 0; i < points.length - 1; i++) {
    total += haversineDistanceFt(points[i], points[i + 1]);
  }
  return total;
};

function LocationMarker({ onPointAdd }: { onPointAdd: (latlng: any) => void }) {
  useMapEvents({
    click(e) {
      if (e && e.latlng) {
        onPointAdd(e.latlng);
      }
    },
  });
  return null;
}

function MapController({ onMapInit }: { onMapInit: (map: L.Map) => void }) {
  const map = useMapEvents({});
  useEffect(() => {
    if (map) onMapInit(map);
  }, [map, onMapInit]);
  return null;
}

export function MapSurveyTab({ regionalDenominator }: { regionalDenominator: number }) {
  const [points, setPoints] = useState<any[]>([]);
  const [tracking, setTracking] = useState(false);
  const [mapInstance, setMapInstance] = useState<L.Map | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [mapStyle, setMapStyle] = useState<'satellite' | 'street'>('satellite');

  useEffect(() => {
    // Safely fix Icons only once after mount
    try {
        const LeafletID = L as any;
        if (LeafletID && LeafletID.Icon && LeafletID.Icon.Default) {
            delete LeafletID.Icon.Default.prototype._getIconUrl;
            LeafletID.Icon.Default.mergeOptions({
                iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
                iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
                shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
            });
        }
    } catch (err) {
        console.warn("Leaflet Icon Fix failed (non-critical):", err);
    }
  }, []);

  const addPoint = useCallback((latlng: any) => {
    if (latlng) setPoints(prev => [...prev, latlng]);
  }, []);

  const dropCenterPin = () => {
    if (mapInstance) {
      const center = mapInstance.getCenter();
      addPoint({ lat: center.lat, lng: center.lng });
    }
  };

  const captureScreenshot = async () => {
    const element = document.getElementById('map-survey-capture-area');
    if (!element) return;
    try {
      const canvas = await html2canvas(element, { useCORS: true, allowTaint: true });
      const link = document.createElement('a');
      link.download = 'Land_Survey_Screenshot.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (e) {
      console.error(e);
      alert('Screenshot failed. Note: strict browser security might block satellite images.');
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim() || !mapInstance) return;
    
    setIsSearching(true);
    try {
      // Prioritize results in Pakistan by adding it to query
      const query = searchQuery.toLowerCase().includes('pakistan') ? searchQuery : `${searchQuery}, Pakistan`;
      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1`);
      const data = await response.json();
      
      if (data && data.length > 0) {
        const { lat, lon } = data[0];
        mapInstance.flyTo([parseFloat(lat), parseFloat(lon)], 14);
      } else {
        alert("Location not found. Try adding more details like city name.");
      }
    } catch (err) {
      alert("Search failed. Please check your internet connection.");
    } finally {
      setIsSearching(false);
    }
  };

  const undoPoint = () => setPoints(prev => prev.slice(0, -1));
  const clearPoints = () => setPoints([]);

  const toggleTracking = () => {
    if (!tracking) {
      if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition((position) => {
           if (position && position.coords) {
             addPoint({ lat: position.coords.latitude, lng: position.coords.longitude });
           }
        }, (err) => alert("GPS Error: " + err.message), { enableHighAccuracy: true });
      } else {
          alert("Geolocation not supported on this browser");
      }
    }
    setTracking(!tracking);
  };

  const areaSqFt = calculateAreaSqFt(points);
  const perimeterFt = calculatePerimeterFt(points);
  const denom = regionalDenominator || 225;
  const areaMarla = areaSqFt / denom;

  return (
    <div id="map-survey-capture-area" className="flex flex-col h-[calc(100vh-180px)] md:h-[600px] w-full relative bg-gray-50 rounded-xl overflow-hidden mb-8 shadow-inner border border-gray-200">
      
      {/* Top Stats Bar */}
      <div className="bg-white shadow z-[1001] border-b border-gray-200 relative">
        {/* Row 1: Stats + Buttons */}
        <div className="p-3 flex justify-between items-center gap-2">
          <div className="flex-shrink-0">
            <p className="text-[10px] uppercase tracking-wider text-gray-500 font-bold mb-1">Total Estimated Area</p>
            <div className="flex items-baseline gap-1.5 flex-wrap">
              <h2 className="text-lg md:text-2xl font-black text-[#2E7D32]">{areaSqFt.toFixed(2)}</h2>
              <span className="text-sm font-bold text-gray-600">Sq Ft</span>
              {perimeterFt > 0 && (
                <span className="text-sm font-black text-red-600 whitespace-nowrap">{perimeterFt.toFixed(1)} ft</span>
              )}
            </div>
            {/* Marla pill + inline search on same row */}
            <div className="flex items-center gap-1 mt-1">
              <p className="text-sm font-semibold text-gray-700 bg-green-50 px-2 py-0.5 rounded-md inline-block border border-green-100 whitespace-nowrap">{areaMarla.toFixed(2)} Marla</p>
              
              {/* Mobile inline search - same height as Marla pill, narrower */}
              <form onSubmit={handleSearch} className="md:hidden flex items-center gap-1 bg-gray-100 border border-gray-200 rounded-md px-1.5 py-0.5 w-[76px]">
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="City..."
                  className="bg-transparent border-none text-[10px] font-semibold placeholder:text-gray-400 focus:outline-none w-full"
                />
                <button type="submit" disabled={isSearching} className="text-[#2E7D32] flex-shrink-0 disabled:opacity-50">
                  {isSearching ? <RotateCcw size={11} className="animate-spin" /> : <Search size={11} />}
                </button>
              </form>
            </div>
          </div>

          {/* Desktop inline search - hidden on mobile */}
          <form onSubmit={handleSearch} className="hidden md:flex gap-1 bg-gray-100 p-1 rounded-xl border border-gray-200 flex-1 mx-2 max-w-[220px]">
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="City/Region..."
              className="flex-1 bg-transparent border-none px-2 py-1 text-[11px] focus:outline-none font-bold placeholder:text-gray-400 w-0 min-w-0"
            />
            <button 
              type="submit" 
              disabled={isSearching}
              className="bg-[#2E7D32] text-white p-1.5 rounded-lg hover:bg-green-700 transition shadow-sm disabled:opacity-50 flex-shrink-0"
            >
              {isSearching ? <RotateCcw size={13} className="animate-spin" /> : <Search size={13} />}
            </button>
          </form>
          
          <div className="flex gap-2 flex-shrink-0">
            <button onClick={captureScreenshot} className="p-2.5 bg-indigo-100 text-indigo-700 rounded-xl hover:bg-indigo-200 transition-colors" title="Save Screenshot">
              <Camera size={20} />
            </button>
            <button onClick={() => generateKML(points)} disabled={points.length < 3} className="p-2.5 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 disabled:opacity-50 transition-colors" title="Export KML">
              <Download size={20} />
            </button>
            <button onClick={() => generatePDF(areaSqFt, 'Regional Standard', areaMarla, points, false)} disabled={points.length < 3} className="p-2.5 bg-[#2E7D32] text-white rounded-xl hover:bg-green-700 disabled:opacity-50 transition-colors shadow-sm" title="Export Report PDF">
              <Save size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Map Container */}
      <div className="flex-1 relative z-0">
        <MapContainer 
          center={[31.5204, 74.3587]} 
          zoom={18} 
          style={{ height: '100%', width: '100%' }}
        >
          <MapController onMapInit={setMapInstance} />
          {mapStyle === 'satellite' ? (
            <TileLayer
              attribution='&copy; ESRI'
              url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
              maxZoom={19}
            />
          ) : (
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              maxZoom={19}
            />
          )}
          <LocationMarker onPointAdd={addPoint} />
          
          {points.length > 0 && points.map((p, i) => (
            p && p.lat && p.lng ? <Marker key={`p-${i}`} position={[p.lat, p.lng]} /> : null
          ))}
          
          {points.length > 2 && (
            <Polygon 
                positions={points.filter(p => p && p.lat && p.lng).map(p => [p.lat, p.lng])} 
                pathOptions={{ color: '#2E7D32', fillColor: '#4CAF50', fillOpacity: 0.5, weight: 3 }} 
            />
          )}
        </MapContainer>
        
        <CompassTool />

        {/* Map Style Toggle - single button top-right of map */}
        <div className="absolute top-2 right-2 z-[500]">
          <button
            onClick={() => setMapStyle(s => s === 'satellite' ? 'street' : 'satellite')}
            className="flex items-center gap-1 px-2.5 py-1 bg-white/90 backdrop-blur-sm rounded-lg shadow-md border border-gray-300 text-[10px] font-black text-gray-700 hover:bg-white transition-colors active:scale-95"
            title="Toggle map style"
          >
            {mapStyle === 'satellite' ? '🛰 SAT' : '🗺 MAP'}
          </button>
        </div>

        {/* Center Crosshair for Manual Targeting */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none z-[400] text-yellow-400 drop-shadow-[0_0_3px_rgba(0,0,0,1)]">
           <Crosshair size={32} strokeWidth={2.5} />
        </div>
      </div>

      {/* Map Helper Text Overlay */}
      {points.length === 0 && (
         <div className="absolute top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-black/60 text-white px-4 py-2 rounded-full text-sm font-medium z-[400] pointer-events-none backdrop-blur-sm shadow-lg whitespace-nowrap">
           Pan map & tap Add Pin (Target)
         </div>
      )}

      {/* Bottom Controls - Responsive Layout */}
      <div className="absolute bottom-6 left-0 right-0 z-[1000] flex justify-between px-6 pointer-events-none">
        
        {/* Left: Undo/Clear Group */}
        <div className="flex flex-col gap-3 pointer-events-auto">
          <button 
            onClick={undoPoint} 
            disabled={points.length === 0} 
            className="w-12 h-12 flex items-center justify-center bg-white text-gray-700 rounded-full shadow-lg border border-gray-200 disabled:opacity-40 active:scale-90 transition-transform"
            title="Undo"
          >
            <RotateCcw size={22} />
          </button>
          <button 
            onClick={clearPoints} 
            disabled={points.length === 0} 
            className="w-12 h-12 flex items-center justify-center bg-white text-red-500 rounded-full shadow-lg border border-gray-200 disabled:opacity-40 active:scale-90 transition-transform"
            title="Clear"
          >
            <Trash2 size={22} />
          </button>
        </div>

        {/* Center: Main Survey Actions */}
        <div className="flex items-center gap-4 pointer-events-auto -mt-4">
          <button 
            onClick={dropCenterPin} 
            className="flex flex-col items-center justify-center w-16 h-16 bg-teal-600 text-white rounded-full shadow-2xl border-4 border-white active:scale-95 transition-transform"
          >
            <Crosshair size={28} />
            <span className="hidden md:block text-[9px] mt-0.5 font-black uppercase tracking-tighter">ADD PIN</span>
          </button>

          <button 
            onClick={toggleTracking} 
            className={`flex flex-col items-center justify-center w-16 h-16 rounded-full shadow-2xl border-4 border-white active:scale-95 transition-transform ${tracking ? 'bg-red-500 text-white animate-pulse' : 'bg-blue-600 text-white'}`}
          >
            {tracking ? <Navigation size={28} /> : <MapPin size={28} />}
            <span className="hidden md:block text-[9px] mt-0.5 font-black uppercase tracking-tighter">{tracking ? 'STOP' : 'GPS PIN'}</span>
          </button>
        </div>

        {/* Right side spacer for symmetry or future zoom controls */}
        <div className="w-12 invisible" />
      </div>
    </div>
  );
}
