import { useState, useCallback, useEffect } from 'react';
// @ts-ignore
// @ts-ignore
const getTurf = () => (window as any).turf;
import { useLocalStorage } from '../hooks/useLocalStorage';
import { MapContainer, TileLayer, Marker, Polygon, Polyline, useMapEvents, useMap } from 'react-leaflet';
import { Save, Download, MapPin, Navigation, Trash2, RotateCcw, Crosshair, Camera, Search, Copy, Check, Plus } from 'lucide-react';
import 'leaflet/dist/leaflet.css';
import * as L from 'leaflet';
import html2canvas from 'html2canvas';
import { generateKML, generatePDF, generateCSV } from '../utils/exporting';
import { CompassTool } from './CompassTool';

// Glue: Share Leaflet with the Plugins
// @ts-ignore
if (typeof window !== 'undefined') {
  (window as any).L = L;
}

// Area calculation via Turf.js for high precision (supports holes)
const calculateAreaSqFt = (rings: any[][]) => {
  const turf = getTurf();
  try {
    if (!turf || !rings || rings.length === 0 || rings[0].length < 3) return 0;
    
    // Turf expects coordinates in [lng, lat] and the polygon rings must be closed
    const geoJSONRings = rings.map(ring => {
      const closed = [...ring.map(p => [p.lng, p.lat])];
      if (closed[0][0] !== closed[closed.length-1][0] || closed[0][1] !== closed[closed.length-1][1]) {
        closed.push([closed[0][0], closed[0][1]]);
      }
      return closed;
    });

    const poly = turf.polygon(geoJSONRings);
    const areaSqMeters = turf.area(poly);
    return areaSqMeters * 10.7639104; // sq meters to sq ft
  } catch (e) {
    console.error("Area Calculation Error:", e);
    return 0;
  }
};

// Distance between two GPS points in feet via Turf.js
const haversineDistanceFt = (p1: any, p2: any): number => {
  const turf = getTurf();
  if (!turf || !p1 || !p2) return 0;
  try {
    const from = turf.point([p1.lng, p1.lat]);
    const to = turf.point([p2.lng, p2.lat]);
    return turf.distance(from, to, { units: 'kilometers' }) * 3280.84; // km → feet
  } catch (e) {
    return 0;
  }
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

function GeomanControls({ 
  setPoints, 
  surveyMode 
}: { 
  setPoints: (p: any[]) => void, 
  surveyMode: 'area' | 'path'
}) {
  const map = useMap();

  useEffect(() => {
    if (!map) return;

    // Initialize Geoman settings
    // @ts-ignore
    if (!map.pm) return;
    
    // @ts-ignore
    map.pm.setLang('en');
    
    // @ts-ignore
    map.pm.setGlobalOptions({ 
      snappable: true, 
      snapDistance: 20,
      allowSelfIntersection: false,
      markerStyle: { draggable: true }
    });

    // Listen for creation to sync back
    map.on('pm:create', (e: any) => {
      const layer = e.layer;
      const latlngs = layer.getLatLngs();
      
      // Sync to React state
      if (surveyMode === 'area') {
        const rings = Array.isArray(latlngs[0]) ? latlngs : [latlngs];
        setPoints(rings.map((ring: any[]) => ring.map((ll: any) => ({ lat: ll.lat, lng: ll.lng }))));
      } else {
        setPoints(latlngs.map((ll: any) => ({ lat: ll.lat, lng: ll.lng })));
      }
      
      layer.remove(); // Let React-Leaflet handle permanent rendering
    });

    // Handle edits (vertex drags)
    map.on('pm:edit', (e: any) => {
      const layer = e.layer;
      const latlngs = layer.getLatLngs();
      if (surveyMode === 'area') {
        const rings = Array.isArray(latlngs[0]) ? latlngs : [latlngs];
        setPoints(rings.map((ring: any[]) => ring.map((ll: any) => ({ lat: ll.lat, lng: ll.lng }))));
      } else {
        setPoints(latlngs.map((ll: any) => ({ lat: ll.lat, lng: ll.lng })));
      }
    });

    return () => {
      map.off('pm:create');
      map.off('pm:edit');
    };
  }, [map, surveyMode, setPoints]);

  return null;
}

function MapController({ onMapInit, onMove }: { onMapInit: (map: L.Map) => void, onMove: (latlng: L.LatLng) => void }) {
  const map = useMapEvents({
    move() {
      onMove(map.getCenter());
    }
  });
  useEffect(() => {
    if (map) {
      onMapInit(map);
      onMove(map.getCenter());
    }
  }, [map, onMapInit, onMove]);
  return null;
}

export function MapSurveyTab({ regionalDenominator }: { regionalDenominator: number }) {
  const [points, setPoints] = useLocalStorage<any[]>('la_map_points', []);
  const [tracking, setTracking] = useState(false);
  const [mapInstance, setMapInstance] = useState<L.Map | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [mapStyle, setMapStyle] = useLocalStorage<'satellite' | 'street'>('la_map_style', 'satellite');
  const [surveyMode, setSurveyMode] = useLocalStorage<'area' | 'path'>('la_map_mode', 'area');
  const [centerCoords, setCenterCoords] = useLocalStorage<{lat: number, lng: number}>('la_map_center', { lat: 31.3650, lng: 74.1850 });
  
  // Ensure we have a valid center even if storage is corrupted
  const safeCenter: [number, number] = [
    typeof centerCoords?.lat === 'number' ? centerCoords.lat : 31.3650,
    typeof centerCoords?.lng === 'number' ? centerCoords.lng : 74.1850
  ];
  const [copied, setCopied] = useState(false);
  const [watchId, setWatchId] = useState<number | null>(null);
  const [autoFollow, setAutoFollow] = useLocalStorage('la_map_auto_follow', true);

  const repairMap = () => {
    localStorage.removeItem('la_map_center');
    localStorage.removeItem('la_map_style');
    localStorage.removeItem('la_active_tab');
    window.location.reload();
  };

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

  useEffect(() => {
    // Cleanup GPS watch on unmount
    return () => {
      if (watchId !== null) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, [watchId]);

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
    if (watchId === null) {
      if ('geolocation' in navigator) {
        const id = navigator.geolocation.watchPosition(
          (position) => {
            const newPoint = { lat: position.coords.latitude, lng: position.coords.longitude };
            
            setPoints(prev => {
              // Always add the first point
              if (prev.length === 0) return [newPoint];
              
              const lastPoint = prev[prev.length - 1];
              const dist = haversineDistanceFt(lastPoint, newPoint);
              
              // Only add if moved more than 5 feet (prevents jitter)
              if (dist > 5) {
                return [...prev, newPoint];
              }
              return prev;
            });

            if (autoFollow && mapInstance) {
              mapInstance.panTo([newPoint.lat, newPoint.lng]);
            }
          },
          (err) => {
            alert("GPS Error: " + err.message);
            setTracking(false);
            setWatchId(null);
          },
          { enableHighAccuracy: true }
        );
        setWatchId(id);
        setTracking(true);
      } else {
        alert("Geolocation not supported on this browser");
      }
    } else {
      navigator.geolocation.clearWatch(watchId);
      setWatchId(null);
      setTracking(false);
    }
  };

  const copyToClipboard = () => {
    const text = `${centerCoords.lat.toFixed(6)}, ${centerCoords.lng.toFixed(6)}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Convert legacy single-ring points to multi-ring format if needed
  // Safety check: ensure points is an array
  const safePoints = Array.isArray(points) ? points : [];
  const normalizedPoints = (safePoints.length > 0 && Array.isArray(safePoints[0])) ? safePoints : [safePoints];
  
  const areaSqFt = calculateAreaSqFt(normalizedPoints);
  const perimeterFt = calculatePerimeterFt(normalizedPoints[0] || []);
  const denom = regionalDenominator || 225;
  const areaMarla = areaSqFt / denom;

  // Safety: Show loading if basic engines aren't ready
  // @ts-ignore
  const hasLeaflet = typeof window.L !== 'undefined';
  // @ts-ignore
  const hasTurf = typeof window.turf !== 'undefined';
  // Note: Geoman (hasGeoman) is now optional for rendering, only needed for toolbox
  // @ts-ignore
  const hasGeoman = (L.pm || L.PM) || (hasLeaflet && ((window as any).L.pm || (window as any).L.PM));

  // If even Leaflet isn't here, we really can't render
  if (!hasLeaflet || !hasTurf) {
    return (
      <div className="flex flex-col items-center justify-center h-[500px] bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
        <RotateCcw size={40} className="animate-spin text-green-600 mb-4" />
        <p className="text-gray-500 font-bold">Connecting To Ultimate Pro Map Tools...</p>
        <p className="text-xs text-gray-400 mt-2">Connecting to Leaflet & Turf.js CDNs</p>
      </div>
    );
  }

  return (
    <div id="map-survey-capture-area" className="flex flex-col h-[calc(100vh-180px)] md:h-[600px] w-full relative bg-gray-50 rounded-xl overflow-hidden mb-8 shadow-inner border border-gray-200">

      {/* Top Stats Bar */}
      <div className="bg-white shadow z-[1001] border-b border-gray-200 relative">
        {/* Row 1: Stats + Buttons */}
        <div className="p-3 flex justify-between items-center gap-2">
          <div className="flex-shrink-0">
            {/* Label changes based on mode */}
            <p className="text-[10px] uppercase tracking-wider text-gray-500 font-bold mb-1">
              {surveyMode === 'area' ? 'Total Estimated Area' : '📏 Path Length'}
            </p>
            <div className="flex items-baseline gap-1.5 flex-wrap">
              {surveyMode === 'area' ? (
                <>
                  <h2 className="text-lg md:text-2xl font-black text-[#2E7D32]">{areaSqFt.toFixed(2)}</h2>
                  <span className="text-sm font-bold text-gray-600">Sq Ft</span>
                  {perimeterFt > 0 && (
                    <span className="text-sm font-black text-red-600 whitespace-nowrap">{perimeterFt.toFixed(1)} ft</span>
                  )}
                </>
              ) : (
                <>
                  <h2 className="text-lg md:text-2xl font-black text-red-600">{perimeterFt.toFixed(1)}</h2>
                  <span className="text-sm font-bold text-gray-600">ft</span>
                  {perimeterFt > 0 && (
                    <span className="text-sm font-semibold text-gray-500 whitespace-nowrap">({(perimeterFt / 3.281).toFixed(1)} m)</span>
                  )}
                </>
              )}
            </div>
            {/* Marla pill + inline search — only in area mode */}
            <div className="flex items-center gap-1 mt-1">
              {surveyMode === 'area' && (
                <p className="text-sm font-semibold text-gray-700 bg-green-50 px-2 py-0.5 rounded-md inline-block border border-green-100 whitespace-nowrap">{areaMarla.toFixed(2)} Marla</p>
              )}
              {surveyMode === 'path' && points.length >= 2 && (
                <p className="text-xs font-semibold text-gray-500 bg-red-50 px-2 py-0.5 rounded-md inline-block border border-red-100 whitespace-nowrap">{points.length - 1} segment{points.length > 2 ? 's' : ''}</p>
              )}

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
            <button 
              onClick={repairMap}
              className="bg-red-50 text-red-600 p-1.5 rounded-lg border border-red-100 hover:bg-red-100 transition-colors flex-shrink-0 ml-1"
              title="Repair Map (Reset Display)"
            >
              🔧
            </button>
          </form>

          <div className="flex gap-1.5 flex-shrink-0">
            <button onClick={captureScreenshot} className="p-2 bg-indigo-50 text-indigo-700 rounded-lg border border-indigo-100 hover:bg-indigo-100 transition-colors" title="Save Screenshot">
              <Camera size={18} />
            </button>
            <button onClick={() => generateCSV(normalizedPoints)} disabled={points.length < 1} className="p-2 bg-amber-50 text-amber-700 rounded-lg border border-amber-100 hover:bg-amber-100 disabled:opacity-50 transition-colors" title="Export Coordinates (CSV)">
              <Check size={18} />
            </button>
            <button onClick={() => generateKML(normalizedPoints)} disabled={points.length < 3} className="p-2 bg-blue-50 text-blue-700 rounded-lg border border-blue-100 hover:bg-blue-100 disabled:opacity-50 transition-colors" title="Export to Google Earth (KML)">
              <Download size={18} />
            </button>
            <button onClick={() => generatePDF(areaSqFt, 'Regional Standard', areaMarla, normalizedPoints, false)} disabled={points.length < 3} className="p-2 bg-[#2E7D32] text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors shadow-sm" title="Export Official PDF Report">
              <Save size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Map Container */}
      <div className="flex-1 relative z-0">
        <MapContainer
          center={safeCenter}
          zoom={16}
          style={{ height: '100%', width: '100%' }}
        >
          <MapController onMapInit={setMapInstance} onMove={setCenterCoords} />
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
          <GeomanControls setPoints={setPoints} surveyMode={surveyMode} />

          {normalizedPoints[0] && normalizedPoints[0].length > 0 && normalizedPoints[0].map((p: any, i: number) => (
            p && p.lat && p.lng ? (
              <Marker
                key={`p-${i}`}
                position={[p.lat, p.lng]}
                draggable={true}
                eventHandlers={{
                  dragend: (e) => {
                    const { lat, lng } = e.target.getLatLng();
                    setPoints(prev => {
                      const newPoints = [...prev];
                      if (Array.isArray(newPoints[0])) {
                        newPoints[0][i] = { lat, lng };
                      } else {
                        newPoints[i] = { lat, lng };
                      }
                      return newPoints;
                    });
                  }
                }}
              />
            ) : null
          ))}

          {/* In area mode: render filled polygon with potential holes */}
          {surveyMode === 'area' && normalizedPoints[0] && normalizedPoints[0].length > 2 && (
            <Polygon
              positions={normalizedPoints.map(ring => ring.filter((p: any) => p && p.lat && p.lng).map((p: any) => [p.lat, p.lng]))}
              pathOptions={{ color: '#2E7D32', fillColor: '#4CAF50', fillOpacity: 0.5, weight: 3 }}
            />
          )}

          {surveyMode === 'path' && normalizedPoints[0] && normalizedPoints[0].length > 1 && (
            <Polyline
              positions={normalizedPoints[0].filter((p: any) => p && p.lat && p.lng).map((p: any) => [p.lat, p.lng])}
              pathOptions={{ color: '#DC2626', weight: 3, dashArray: '8 4' }}
            />
          )}
        </MapContainer>

        <CompassTool />

        {/* Pro Mapping Toolbox */}
        <div className="absolute top-24 right-2 z-[500] flex flex-col gap-2">
            <button
                onClick={() => {
                  if (mapInstance) {
                    // @ts-ignore
                    const isDraw = mapInstance.pm.Draw.getActiveShape();
                    if (isDraw) {
                      // @ts-ignore
                      mapInstance.pm.disableDraw();
                    } else {
                      // @ts-ignore
                      mapInstance.pm.enableDraw(surveyMode === 'area' ? 'Polygon' : 'Polyline', {
                        snappable: true,
                        snapDistance: 20
                      });
                    }
                  }
                }}
                className="w-10 h-10 flex items-center justify-center bg-white rounded-lg shadow-md border border-gray-200 text-green-700 hover:bg-green-50 active:scale-95"
                title="Continuous Draw Mode"
            >
                <Plus size={20} />
            </button>
            <button
                onClick={() => {
                   if (mapInstance) {
                     // @ts-ignore
                     mapInstance.pm.toggleGlobalEditMode();
                   }
                }}
                className="w-10 h-10 flex items-center justify-center bg-white rounded-lg shadow-md border border-gray-200 text-blue-700 hover:bg-blue-50 active:scale-95"
                title="Edit / Drag Nodes"
            >
                <MapPin size={20} />
            </button>
            {surveyMode === 'area' && (
              <button
                  onClick={() => {
                    if (mapInstance) {
                      // @ts-ignore
                      mapInstance.pm.enableDraw('Cut', { snappable: true });
                    }
                  }}
                  className="w-10 h-10 flex items-center justify-center bg-white rounded-lg shadow-md border border-gray-200 text-red-700 hover:bg-red-50 active:scale-95"
                  title="Cut Hole (Subtract Area)"
              >
                  <Trash2 size={20} />
              </button>
            )}
        </div>

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

        {/* Auto-Follow Toggle */}
        <div className="absolute top-12 right-2 z-[500]">
          <button
            onClick={() => setAutoFollow(!autoFollow)}
            className={`flex items-center gap-1 px-2 py-1 rounded-lg shadow-md border text-[10px] font-black transition-all active:scale-95 ${autoFollow
              ? 'bg-blue-600 text-white border-blue-400'
              : 'bg-white/90 text-gray-400 border-gray-300'
              }`}
            title="Toggle Auto-Follow"
          >
            {autoFollow ? '📍 FOLLOWING' : '📍 FOLLOW'}
          </button>
        </div>

        {/* Center Crosshair for Manual Targeting */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none z-[400] text-yellow-400 drop-shadow-[0_0_3px_rgba(0,0,0,1)]">
          <Crosshair size={32} strokeWidth={2.5} />
        </div>

        {/* Real-time Coordinate Box */}
        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 z-[500] pointer-events-auto w-[90%] md:w-auto">
          <button
            onClick={copyToClipboard}
            className="flex items-center gap-2 px-2 md:px-3 py-1 bg-white/90 backdrop-blur-sm rounded-lg shadow-md border border-gray-300 hover:bg-white transition-all active:scale-95 group mx-auto"
            title="Click to copy coordinates"
          >
            <div className="flex flex-col items-start leading-tight">
              <span className="text-[8px] md:text-[10px] font-black text-gray-400 uppercase tracking-tighter">Target GPS</span>
              <span className="text-[10px] md:text-[11px] font-mono font-bold text-gray-800">
                {(centerCoords?.lat || 0).toFixed(6)}, {(centerCoords?.lng || 0).toFixed(6)}
              </span>
            </div>
            <div className="pl-2 border-l border-gray-200 text-gray-400 group-hover:text-[#2E7D32]">
              {copied ? <Check size={12} className="text-green-600" /> : <Copy size={12} />}
            </div>
          </button>
        </div>
      </div>

      {/* Map Helper Text Overlay */}
      {points.length === 0 && (
        <div className="absolute top-[40%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-black/60 text-white px-4 py-2 rounded-full text-xs md:text-sm font-medium z-[400] pointer-events-none backdrop-blur-sm shadow-lg whitespace-nowrap">
          Pan map & tap Add Pin
        </div>
      )}

      {/* Bottom Controls - Responsive Layout */}
      <div className="absolute bottom-10 md:bottom-6 left-0 right-0 z-[1000] flex justify-between px-4 md:px-6 pointer-events-none">

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

        {/* Right: Mode Toggle - AREA / PATH */}
        <div className="flex flex-col gap-2 pointer-events-auto items-center">
          <button
            onClick={() => { setSurveyMode(m => m === 'area' ? 'path' : 'area'); clearPoints(); }}
            className={`w-12 h-12 flex flex-col items-center justify-center rounded-full shadow-lg border-2 text-[9px] font-black uppercase transition-colors ${surveyMode === 'path'
              ? 'bg-red-500 text-white border-white'
              : 'bg-white text-gray-700 border-gray-200'
              }`}
            title={surveyMode === 'area' ? 'Switch to Path mode' : 'Switch to Area mode'}
          >
            {surveyMode === 'area' ? '📐' : '📏'}
            <span className="mt-0.5">{surveyMode === 'area' ? 'AREA' : 'PATH'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
