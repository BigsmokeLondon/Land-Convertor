import { useState, useCallback, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Polygon, Polyline, useMapEvents, Tooltip } from 'react-leaflet';
import { Save, Download, MapPin, Navigation, Trash2, RotateCcw, Crosshair, Camera, Search, Copy, Check, Plus, Layers, Ruler } from 'lucide-react';
import 'leaflet/dist/leaflet.css';
import * as L from 'leaflet';
import html2canvas from 'html2canvas';
import { generateKML, generatePDF } from '../utils/exporting';
import { CompassTool } from './CompassTool';
import { Field, LatLng } from '../types/survey';

// Area calculation spherical
const calculateAreaSqFt = (points: LatLng[], manualOverrides?: Record<number, number>) => {
  try {
    if (!points || points.length < 3) return 0;
    
    // NOTE: For area calculation, manual overrides of segment lengths are trickier.
    // For now, if manual overrides exist, we calculate a "Correction Factor" or just use GPS.
    // Professional implementation would use the manual lengths in a traverse calculation.
    // Here we will use GPS area but display the manual perimeter.
    
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
const haversineDistanceFt = (p1: LatLng, p2: LatLng): number => {
  const R = 6378137; // Earth radius in meters
  const dLat = (p2.lat - p1.lat) * Math.PI / 180;
  const dLng = (p2.lng - p1.lng) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(p1.lat * Math.PI / 180) * Math.cos(p2.lat * Math.PI / 180) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)) * 3.28084; // meters → feet
};

// Total boundary/perimeter length
const calculatePerimeterFt = (points: LatLng[], manualOverrides?: Record<number, number>): number => {
  if (!points || points.length < 2) return 0;
  let total = 0;
  for (let i = 0; i < points.length - 1; i++) {
    const manual = manualOverrides?.[i];
    if (manual) {
      total += manual;
    } else {
      total += haversineDistanceFt(points[i], points[i + 1]);
    }
  }
  return total;
};

const FIELD_COLORS = ['#2E7D32', '#1565C0', '#D32F2F', '#7B1FA2', '#F57C00', '#0097A7'];

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

interface MapSurveyTabProps {
  regionalDenominator: number;
  fields: Field[];
  setFields: React.Dispatch<React.SetStateAction<Field[]>>;
  activeFieldId: string;
  setActiveFieldId: React.Dispatch<React.SetStateAction<string>>;
}

export function MapSurveyTab({ regionalDenominator, fields, setFields, activeFieldId, setActiveFieldId }: MapSurveyTabProps) {
  const [tracking, setTracking] = useState(false);
  const [mapInstance, setMapInstance] = useState<L.Map | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [mapStyle, setMapStyle] = useState<'satellite' | 'street'>('satellite');
  const [surveyMode, setSurveyMode] = useState<'area' | 'path'>('area');
  const [centerCoords, setCenterCoords] = useState({ lat: 31.3650, lng: 74.1850 });
  const [copied, setCopied] = useState(false);
  const [showFieldList, setShowFieldList] = useState(false);
  
  const watchId = useRef<number | null>(null);

  const activeField = fields.find(f => f.id === activeFieldId) || fields[0];
  const points = activeField.points;

  useEffect(() => {
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
      console.warn("Leaflet Icon Fix failed:", err);
    }
  }, []);

  const addPoint = useCallback((latlng: LatLng) => {
    setFields(prev => prev.map(f => f.id === activeFieldId ? { ...f, points: [...f.points, latlng] } : f));
  }, [activeFieldId, setFields]);

  const updatePoint = useCallback((index: number, latlng: LatLng) => {
    setFields(prev => prev.map(f => f.id === activeFieldId ? { 
      ...f, 
      points: f.points.map((p, i) => i === index ? latlng : p) 
    } : f));
  }, [activeFieldId, setFields]);

  const setManualOverride = (segmentIndex: number) => {
    const val = prompt("Enter manual tape measurement (feet):", "");
    if (val === null) return;
    const num = parseFloat(val);
    if (isNaN(num)) return;

    setFields(prev => prev.map(f => f.id === activeFieldId ? {
      ...f,
      segmentsOverride: { ...(f.segmentsOverride || {}), [segmentIndex]: num }
    } : f));
  };

  const addNewField = () => {
    const id = Date.now().toString();
    const newField: Field = {
      id,
      name: `Field ${fields.length + 1}`,
      points: [],
      color: FIELD_COLORS[fields.length % FIELD_COLORS.length],
    };
    setFields(prev => [...prev, newField]);
    setActiveFieldId(id);
    setShowFieldList(false);
  };

  const deleteField = (id: string) => {
    if (fields.length === 1) {
      setFields([{ ...DEFAULT_FIELD, id: Date.now().toString() }]);
      return;
    }
    const newFields = fields.filter(f => f.id !== id);
    setFields(newFields);
    if (activeFieldId === id) setActiveFieldId(newFields[0].id);
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
      alert('Screenshot failed. Note: satellite images might be blocked by browser security.');
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim() || !mapInstance) return;

    // Detect raw coordinates (e.g. 31.365, 74.185)
    const coordRegex = /^(-?\d+\.?\d*)\s*,\s*(-?\d+\.?\d*)$/;
    const match = searchQuery.match(coordRegex);
    if (match) {
      const lat = parseFloat(match[1]);
      const lng = parseFloat(match[2]);
      mapInstance.flyTo([lat, lng], 17);
      setSearchQuery('');
      return;
    }

    setIsSearching(true);
    try {
      const query = searchQuery.toLowerCase().includes('pakistan') ? searchQuery : `${searchQuery}, Pakistan`;
      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1`);
      const data = await response.json();

      if (data && data.length > 0) {
        const { lat, lon } = data[0];
        mapInstance.flyTo([parseFloat(lat), parseFloat(lon)], 14);
      } else {
        alert("Location not found.");
      }
    } catch (err) {
      alert("Search failed.");
    } finally {
      setIsSearching(false);
    }
  };

  const toggleTracking = () => {
    if (tracking) {
      if (watchId.current !== null) navigator.geolocation.clearWatch(watchId.current);
      watchId.current = null;
      setTracking(false);
    } else {
      if ('geolocation' in navigator) {
        setTracking(true);
        watchId.current = navigator.geolocation.watchPosition((position) => {
          const newPt = { lat: position.coords.latitude, lng: position.coords.longitude };
          // Only add if significantly different or first point
          addPoint(newPt);
        }, (err) => {
          alert("GPS error: " + err.message);
          setTracking(false);
        }, { enableHighAccuracy: true, distanceFilter: 2 }); // check every 2 meters
      } else {
        alert("Geolocation not supported.");
      }
    }
  };

  const areaSqFt = calculateAreaSqFt(points, activeField.segmentsOverride);
  const perimeterFt = calculatePerimeterFt(points, activeField.segmentsOverride);
  const denom = regionalDenominator || 225;
  const areaMarla = areaSqFt / denom;

  const totalAreaSqFt = fields.reduce((sum, f) => sum + calculateAreaSqFt(f.points, f.segmentsOverride), 0);

  return (
    <div id="map-survey-capture-area" className="flex flex-col h-[calc(100vh-180px)] md:h-[600px] w-full relative bg-gray-50 rounded-xl overflow-hidden mb-8 shadow-inner border border-gray-200">

      {/* Top Stats Bar */}
      <div className="bg-white shadow z-[1001] border-b border-gray-200 relative">
        <div className="p-3 flex justify-between items-center gap-2">
          <div className="flex-shrink-0">
            <p className="text-[10px] uppercase tracking-wider text-gray-500 font-bold mb-1">
              {surveyMode === 'area' ? `ACTIVE: ${activeField.name}` : '📏 Path Length'}
            </p>
            <div className="flex items-baseline gap-1.5 flex-wrap">
              <h2 className={`text-lg md:text-2xl font-black ${surveyMode === 'area' ? 'text-[#2E7D32]' : 'text-red-600'}`}>
                {surveyMode === 'area' ? areaSqFt.toFixed(1) : perimeterFt.toFixed(1)}
              </h2>
              <span className="text-sm font-bold text-gray-600">{surveyMode === 'area' ? 'Sq Ft' : 'ft'}</span>
              {surveyMode === 'area' && perimeterFt > 0 && (
                <span className="text-sm font-black text-blue-600 whitespace-nowrap">({perimeterFt.toFixed(1)} ft)</span>
              )}
            </div>
          </div>

          <form onSubmit={handleSearch} className="hidden md:flex gap-1 bg-gray-100 p-1 rounded-xl border border-gray-200 flex-1 mx-2 max-w-[220px]">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="City or Lat, Lng..."
              className="flex-1 bg-transparent border-none px-2 py-1 text-[11px] focus:outline-none font-bold placeholder:text-gray-400 w-0 min-w-0"
            />
            <button type="submit" disabled={isSearching} className="bg-[#2E7D32] text-white p-1.5 rounded-lg disabled:opacity-50">
              {isSearching ? <RotateCcw size={13} className="animate-spin" /> : <Search size={13} />}
            </button>
          </form>

          <div className="flex gap-2 flex-shrink-0">
            <button onClick={() => setShowFieldList(!showFieldList)} className={`p-2.5 rounded-xl transition-colors ${showFieldList ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-700'}`} title="Field Management">
              <Layers size={20} />
            </button>
            <button onClick={() => generatePDF(areaSqFt, activeField.name, areaMarla, points, false)} disabled={points.length < 3} className="p-2.5 bg-[#2E7D32] text-white rounded-xl hover:bg-green-700 disabled:opacity-50 shadow-sm" title="Save Report">
              <Save size={20} />
            </button>
          </div>
        </div>

        {/* Field List Overlay */}
        {showFieldList && (
          <div className="absolute top-full left-0 right-0 bg-white border-b border-gray-200 shadow-xl p-3 grid grid-cols-1 md:grid-cols-2 gap-2 animate-in slide-in-from-top duration-200">
            <div className="col-span-full flex justify-between items-center mb-1">
              <h3 className="text-xs font-black uppercase text-gray-400">Manage Measurements ({fields.length})</h3>
              <p className="text-[11px] font-bold text-green-700">Total: {totalAreaSqFt.toFixed(0)} Sq Ft</p>
            </div>
            {fields.map(f => (
              <div 
                key={f.id} 
                onClick={() => { setActiveFieldId(f.id); setShowFieldList(false); }}
                className={`flex items-center justify-between p-2 rounded-lg border cursor-pointer transition ${activeFieldId === f.id ? 'border-green-500 bg-green-50' : 'border-gray-100 hover:bg-gray-50'}`}
              >
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: f.color }} />
                  <span className="text-sm font-bold text-gray-700">{f.name}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-mono text-gray-500">{calculateAreaSqFt(f.points).toFixed(0)} ft²</span>
                  <button onClick={(e) => { e.stopPropagation(); deleteField(f.id); }} className="text-red-400 hover:text-red-600 p-1">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
            <button onClick={addNewField} className="col-span-full mt-2 flex items-center justify-center gap-2 p-2 bg-green-600 text-white rounded-lg font-bold text-sm shadow-sm">
              <Plus size={16} /> Add New Field / Plot
            </button>
          </div>
        )}
      </div>

      {/* Map Container */}
      <div className="flex-1 relative z-0">
        <MapContainer center={[31.3675, 74.2048]} zoom={16} style={{ height: '100%', width: '100%' }}>
          <MapController onMapInit={setMapInstance} onMove={setCenterCoords} />
          <TileLayer
            attribution='&copy; ESRI'
            url={mapStyle === 'satellite' 
              ? "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
              : "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"}
            maxZoom={19}
          />
          <LocationMarker onPointAdd={addPoint} />

          {/* Render All Fields */}
          {fields.map(f => (
            <div key={`field-layer-${f.id}`}>
              {f.points.length > 2 && (
                <Polygon
                  positions={f.points.map(p => [p.lat, p.lng])}
                  pathOptions={{ 
                    color: f.color, 
                    fillColor: f.color, 
                    fillOpacity: f.id === activeFieldId ? 0.4 : 0.15, 
                    weight: f.id === activeFieldId ? 3 : 1 
                  }}
                />
              )}
              {f.points.length > 1 && f.points.length <= 2 && (
                <Polyline positions={f.points.map(p => [p.lat, p.lng])} pathOptions={{ color: f.color }} />
              )}
            </div>
          ))}

          {/* Render Active Field Interactive Elements */}
          {points.map((p, i) => (
            <Marker
              key={`active-p-${i}`}
              position={[p.lat, p.lng]}
              draggable={true}
              eventHandlers={{
                dragend: (e) => {
                  const { lat, lng } = e.target.getLatLng();
                  updatePoint(i, { lat, lng });
                }
              }}
            />
          ))}

          {/* Render Midpoint "Tape Measure" Labels for Active Field */}
          {points.length > 1 && points.map((p, i) => {
            if (i === points.length - 1 && surveyMode === 'area') return null; // Closed loop handled separately
            const nextIdx = (i + 1) % points.length;
            if (nextIdx === 0 && surveyMode === 'path') return null;
            
            const p1 = points[i];
            const p2 = points[nextIdx];
            const mid = { lat: (p1.lat + p2.lat) / 2, lng: (p1.lng + p2.lng) / 2 };
            const manual = activeField.segmentsOverride?.[i];
            const gpsDist = haversineDistanceFt(p1, p2);

            return (
              <Marker 
                key={`mid-${i}`} 
                position={[mid.lat, mid.lng]} 
                icon={L.divIcon({ className: 'bg-transparent', html: '' })}
                eventHandlers={{ click: () => setManualOverride(i) }}
              >
                <Tooltip permanent direction="top" className={`p-1 rounded shadow-lg border-2 ${manual ? 'bg-yellow-100 border-yellow-400' : 'bg-white/80 border-gray-200'}`}>
                  <span className="text-[10px] font-black flex items-center gap-1">
                    {manual ? <Ruler size={10} /> : null}
                    {manual ? manual.toFixed(1) : gpsDist.toFixed(1)} ft
                  </span>
                </Tooltip>
              </Marker>
            );
          })}
        </MapContainer>

        <CompassTool />

        {/* Map Style Toggle */}
        <div className="absolute top-2 right-2 z-[500]">
          <button
            onClick={() => setMapStyle(s => s === 'satellite' ? 'street' : 'satellite')}
            className="flex items-center gap-1 px-2.5 py-1 bg-white/90 backdrop-blur-sm rounded-lg shadow-md border border-gray-300 text-[10px] font-black text-gray-700"
          >
            {mapStyle === 'satellite' ? '🛰 SAT' : '🗺 MAP'}
          </button>
        </div>

        {/* Center Crosshair */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none z-[400] text-yellow-500 drop-shadow-[0_0_2px_rgba(0,0,0,0.8)]">
          <Crosshair size={32} strokeWidth={2.5} />
        </div>
      </div>

      {/* Bottom Controls */}
      <div className="absolute bottom-6 left-0 right-0 z-[1000] flex justify-between px-6 pointer-events-none">
        <div className="flex flex-col gap-3 pointer-events-auto">
          <button
            onClick={() => setFields(prev => prev.map(f => f.id === activeFieldId ? { ...f, points: f.points.slice(0, -1) } : f))}
            disabled={points.length === 0}
            className="w-12 h-12 flex items-center justify-center bg-white text-gray-700 rounded-full shadow-lg border border-gray-200 disabled:opacity-40"
          >
            <RotateCcw size={22} />
          </button>
          <button
            onClick={() => setFields(prev => prev.map(f => f.id === activeFieldId ? { ...f, points: [], segmentsOverride: {} } : f))}
            disabled={points.length === 0}
            className="w-12 h-12 flex items-center justify-center bg-white text-red-500 rounded-full shadow-lg border border-gray-200 disabled:opacity-40"
          >
            <Trash2 size={22} />
          </button>
        </div>

        <div className="flex items-center gap-4 pointer-events-auto -mt-4">
          <button
            onClick={() => addPoint({ lat: centerCoords.lat, lng: centerCoords.lng })}
            className="flex flex-col items-center justify-center w-16 h-16 bg-teal-600 text-white rounded-full shadow-2xl border-4 border-white active:scale-95"
          >
            <Crosshair size={28} />
          </button>

          <button
            onClick={toggleTracking}
            className={`flex flex-col items-center justify-center w-16 h-16 rounded-full shadow-2xl border-4 border-white active:scale-95 transition-all ${tracking ? 'bg-red-500 text-white animate-pulse' : 'bg-blue-600 text-white'}`}
          >
            {tracking ? <Navigation size={28} /> : <MapPin size={28} />}
          </button>
        </div>

        <div className="flex flex-col gap-2 pointer-events-auto items-center">
          <button
            onClick={() => { setSurveyMode(m => m === 'area' ? 'path' : 'area'); }}
            className={`w-12 h-12 flex flex-col items-center justify-center rounded-full shadow-lg border-2 text-[9px] font-black uppercase transition-colors ${surveyMode === 'path'
              ? 'bg-red-500 text-white border-white'
              : 'bg-white text-gray-700 border-gray-200'
              }`}
          >
            {surveyMode === 'area' ? '📐' : '📏'}
            <span className="mt-0.5">{surveyMode === 'area' ? 'AREA' : 'PATH'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

const DEFAULT_FIELD: Field = {
  id: 'f1',
  name: 'Field 1',
  points: [],
  color: '#2E7D32',
};
