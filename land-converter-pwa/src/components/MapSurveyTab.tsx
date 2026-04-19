import { useState, useCallback, useEffect, useRef } from 'react';
// Area calculation via Turf.js for high precision (supports holes)
// Retrieve Turf from global window since it's loaded via CDN in index.html
const getTurf = () => (window as any).turf;
// Bridge global L for TS visibility

import { useLocalStorage } from '../hooks/useLocalStorage';
import { MapContainer, TileLayer, Marker, Polygon, Polyline, useMapEvents, useMap } from 'react-leaflet';
import { Save, Download, MapPin, Navigation, Trash2, RotateCcw, Crosshair, Camera, Search, Copy, Check, Plus, DownloadCloud, CloudOff } from 'lucide-react';
import 'leaflet/dist/leaflet.css';
import * as L_Local from 'leaflet';
import html2canvas from 'html2canvas';
import { generateKML, generatePDF, generateCSV } from '../utils/exporting';
import { CompassTool } from './CompassTool';
import { getTilesInRadius, getTileUrl } from '../utils/tileMath';


// Area calculation via Turf.js
const calculateAreaSqFt = (rings: any[][]) => {
  const turf = getTurf();
  try {
    if (!turf || !rings || rings.length === 0 || rings[0].length < 3) return 0;
    
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

const calculatePerimeterFt = (points: any[]): number => {
  if (!points || points.length < 2) return 0;
  let total = 0;
  for (let i = 0; i < points.length - 1; i++) {
    total += haversineDistanceFt(points[i], points[i + 1]);
  }
  return total;
};

function LocationMarker({ onPointAdd }: { onPointAdd: (latlng: any) => void }) {
  const map = useMap();
  useMapEvents({
    click(e) {
      // @ts-ignore
      const pm = map.pm || map.PM;
      // Disable default point dropping if ANY Pro GIS mode is active
      const isDrawing = pm?.Draw?.getActiveShape();
      const isEditing = pm?.globalEditModeEnabled && pm.globalEditModeEnabled();
      
      if (isDrawing || isEditing) return;

      if (e && e.latlng) {
        onPointAdd(e.latlng);
      }
    },
  });
  return null;
}

// Support for Manual Measurements on Edges
const getMidpoint = (p1: any, p2: any) => ({
  lat: (p1.lat + p2.lat) / 2,
  lng: (p1.lng + p2.lng) / 2
});

function EdgeLabels({ points, manualMeasurements, onSegmentClick }: { 
  points: any[], 
  manualMeasurements: Record<string, string>,
  onSegmentClick: (idx: number) => void 
}) {
  if (!points || points.length < 2) return null;
  
  const midpoints = [];
  for (let i = 0; i < points.length; i++) {
    const p1 = points[i];
    const p2 = points[(i + 1) % points.length];
    
    // In path mode, we don't close the loop
    if (i === points.length - 1 && points.length > 2 && p1 === points[0]) continue; 
    // Wait, the standard check for polygon vs path is better handled by state
    
    const mid = getMidpoint(p1, p2);
    const dist = haversineDistanceFt(p1, p2);
    const manual = manualMeasurements[`seg-${i}`];
    
    midpoints.push({ mid, dist, manual, index: i });
  }

  // To avoid duplicate labels in Path mode (last segment shouldn't exist)
  const isActuallyClosed = points.length > 2;

  return (
    <>
      {midpoints.map((m, i) => {
        // Skip last segment if it's not a polygon
        if (i === points.length - 1 && !isActuallyClosed) return null;
        
        return (
          <Marker 
            key={`label-${i}`} 
            position={[m.mid.lat, m.mid.lng]}
            icon={L_Local.divIcon({
              className: 'custom-edge-label',
              html: `
                <div class="bg-white/95 backdrop-blur-md border-2 border-white/50 px-3 py-1.5 rounded-lg shadow-xl text-[11px] whitespace-nowrap font-extrabold flex flex-col items-center min-w-[60px]">
                  <span class="text-gray-900">${m.dist.toFixed(1)} ft</span>
                  ${m.manual ? `<span class="text-blue-700 border-t border-blue-100 mt-1 pt-1">T: ${m.manual} ft</span>` : ''}
                </div>
              `,
              iconSize: [0, 0],
              iconAnchor: [40, 20]
            })}
            eventHandlers={{
              click: () => onSegmentClick(m.index)
            }}
          />
        );
      })}
    </>
  );
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
    
    const initGeoman = () => {
      // @ts-ignore
      const pm = map.pm || map.PM;
      if (!pm) return false;
      
      pm.setLang('en');
      pm.setGlobalOptions({ 
        snappable: true, 
        snapDistance: 20,
        allowSelfIntersection: false,
        markerStyle: { draggable: true },
        continueDrawing: true
      });
      return true;
    };

    // Try immediate & polling
    if (!initGeoman()) {
      const interval = setInterval(() => {
        if (initGeoman()) {
          console.log("Geoman Late-Init Success");
          clearInterval(interval);
        } else {
          // Manual binding attempt if scripts are loaded but instance is blank
          // @ts-ignore
          const L = (window as any).L;
          if (L?.PM) {
            try {
              new L.PM.Map(map);
              initGeoman();
            } catch (e) {}
          }
        }
      }, 300);
      setTimeout(() => clearInterval(interval), 5000);
    }

    const updatePointsFromLayer = (layer: any) => {
      if (typeof layer.getLatLngs !== 'function') return;
      const latlngs = layer.getLatLngs();
      if (surveyMode === 'area') {
        const rings = Array.isArray(latlngs[0]) ? latlngs : [latlngs];
        setPoints(rings.map((ring: any[]) => ring.map((ll: any) => ({ lat: ll.lat, lng: ll.lng }))));
      } else {
        setPoints(latlngs.map((ll: any) => ({ lat: ll.lat, lng: ll.lng })));
      }
    };

    map.on('pm:create', (e: any) => {
      updatePointsFromLayer(e.layer);
      e.layer.remove(); // Transfer to React state
    });

    map.on('pm:edit', (e: any) => {
      updatePointsFromLayer(e.layer);
    });

    return () => {
      map.off('pm:create');
      map.off('pm:edit');
    };
  }, [map, surveyMode, setPoints]);

  return null;
}

function ProMappingToolbox({ surveyMode, onPreCache, isCaching }: { surveyMode: 'area' | 'path', onPreCache: () => void, isCaching: boolean }) {
  const map = useMap();
  const [activeDraw, setActiveDraw] = useState(false);
  const [activeEdit, setActiveEdit] = useState(false);
  const [activeCut, setActiveCut] = useState(false);
  
  const getPM = () => {
    // @ts-ignore
    let pm = map.pm || map.PM;
    if (!pm && (window as any).L?.PM) {
       try {
         // @ts-ignore
         pm = new (window as any).L.PM.Map(map);
       } catch (e) {}
    }
    return pm;
  };

  // Sync internal UI state with Geoman actual state
  useEffect(() => {
    const interval = setInterval(() => {
      const pm = getPM();
      if (pm) {
        setActiveDraw(!!pm.Draw.getActiveShape());
        setActiveEdit(!!(pm.globalEditModeEnabled && pm.globalEditModeEnabled()));
      }
    }, 500);
    return () => clearInterval(interval);
  }, [map]);
  
  const toggleDraw = () => {
    const pm = getPM();
    if (!pm) {
      alert("GIS Engine is still warming up... Please wait a few seconds.");
      return;
    }
    const isDraw = pm.Draw.getActiveShape();
    if (isDraw) {
      pm.disableDraw();
      setActiveDraw(false);
    } else {
      pm.enableDraw(surveyMode === 'area' ? 'Polygon' : 'Polyline', {
        snappable: true,
        snapDistance: 20
      });
      setActiveDraw(true);
      setActiveEdit(false);
    }
  };

  const toggleEdit = () => {
    const pm = getPM();
    if (!pm) {
      alert("GIS Engine is still warming up...");
      return;
    }
    pm.toggleGlobalEditMode();
    setActiveEdit(!activeEdit);
    if (pm.Draw.getActiveShape()) pm.disableDraw();
  };

  const toggleCut = () => {
    const pm = getPM();
    if (!pm) return;
    pm.enableDraw('Cut', { snappable: true });
    setActiveCut(pm.Draw.getActiveShape() === 'Cut');
  };

  const toolboxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (toolboxRef.current) {
      L_Local.DomEvent.disableClickPropagation(toolboxRef.current);
    }
  }, []);

  return (
    <div ref={toolboxRef} className="absolute top-24 right-2 z-[500] flex flex-col gap-2 pointer-events-auto">
      <button
        onClick={(e) => { e.stopPropagation(); toggleDraw(); }}
        className={`w-10 h-10 flex items-center justify-center rounded-lg shadow-md border active:scale-95 transition-all ${activeDraw ? 'bg-green-600 text-white border-green-700' : 'bg-white text-green-700 border-gray-200 hover:bg-green-50'}`}
        title="Continuous Draw Mode"
      >
        <Plus size={20} />
      </button>
      <button
        onClick={(e) => { e.stopPropagation(); toggleEdit(); }}
        className={`w-10 h-10 flex items-center justify-center rounded-lg shadow-md border active:scale-95 transition-all ${activeEdit ? 'bg-blue-600 text-white border-blue-700' : 'bg-white text-blue-700 border-gray-200 hover:bg-blue-50'}`}
        title="Edit / Drag Nodes"
      >
        <MapPin size={20} />
      </button>
      {surveyMode === 'area' && (
        <button
          onClick={(e) => { e.stopPropagation(); toggleCut(); }}
          className={`w-10 h-10 flex items-center justify-center rounded-lg shadow-md border active:scale-95 transition-all ${activeCut ? 'bg-red-600 text-white border-red-700' : 'bg-white text-red-700 border-gray-200 hover:bg-red-50'}`}
          title="Cut Hole (Subtract Area)"
        >
          <Trash2 size={20} />
        </button>
      )}
      <button
        onClick={(e) => { e.stopPropagation(); onPreCache(); }}
        disabled={isCaching}
        className={`w-10 h-10 flex items-center justify-center rounded-lg shadow-md border active:scale-95 transition-all bg-white text-orange-600 border-gray-200 hover:bg-orange-50 ${isCaching ? 'animate-pulse opacity-50' : ''}`}
        title="Download Region for Offline Use"
      >
        <DownloadCloud size={20} />
      </button>
    </div>
  );
}

function MapController({ onMapInit, onMove }: { onMapInit: (map: L_Local.Map) => void, onMove: (latlng: L_Local.LatLng) => void }) {
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

export function MapSurveyTab({ regionalDenominator, regionalName }: { regionalDenominator: number, regionalName: string }) {
  const [points, setPoints] = useLocalStorage<any[]>('la_map_points', []);
  const [tracking, setTracking] = useState(false);
  const [mapInstance, setMapInstance] = useState<L_Local.Map | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [mapStyle, setMapStyle] = useLocalStorage<'satellite' | 'street'>('la_map_style', 'satellite');
  const [surveyMode, setSurveyMode] = useLocalStorage<'area' | 'path'>('la_map_mode', 'area');
  const [centerCoords, setCenterCoords] = useLocalStorage<{lat: number, lng: number}>('la_map_center', { lat: 31.3675, lng: 74.2048 });
  
  const safeCenter: [number, number] = [
    typeof centerCoords?.lat === 'number' ? centerCoords.lat : 31.3675,
    typeof centerCoords?.lng === 'number' ? centerCoords.lng : 74.2048
  ];
  const [copied, setCopied] = useState(false);
  const [watchId, setWatchId] = useState<number | null>(null);
  const [autoFollow, setAutoFollow] = useLocalStorage('la_map_auto_follow', true);

  // Report Metadata
  const [surveyorName, setSurveyorName] = useLocalStorage('la_report_surveyor', '');
  const [locationName, setLocationName] = useLocalStorage('la_report_location', '');
  const [clientName, setClientName] = useLocalStorage('la_report_client', '');
  const [manualArea, setManualArea] = useLocalStorage<string>('la_manual_area', '');
  const [manualMeasurements, setManualMeasurements] = useLocalStorage<Record<string, string>>('la_manual_measurements', {});
  const [isExporting, setIsExporting] = useState(false);
  const [showMeta, setShowMeta] = useState(false);
  const [cachingProgress, setCachingProgress] = useState<{current: number, total: number} | null>(null);

  const preCacheCurrentRegion = async () => {
    if (!mapInstance) return;
    const center = mapInstance.getCenter();
    const radiusKm = 2; // User approved deciding radius
    const zooms = [14, 15, 16, 17, 18]; // Detail levels
    
    let allTiles: any[] = [];
    zooms.forEach(z => {
      allTiles = [...allTiles, ...getTilesInRadius(center, radiusKm, z)];
    });

    const total = allTiles.length * 2; // satellite + street
    let current = 0;
    setCachingProgress({ current: 0, total });

    // We process in small chunks to avoid overwhelming the browser/IP
    const chunkSize = 20;
    for (let i = 0; i < allTiles.length; i += chunkSize) {
      const chunk = allTiles.slice(i, i + chunkSize);
      await Promise.all(chunk.map(async (tile) => {
        // Fetch both styles
        try {
          await Promise.all([
            fetch(getTileUrl(tile, 'satellite'), { mode: 'no-cors' }),
            fetch(getTileUrl(tile, 'street'), { mode: 'no-cors' })
          ]);
          current += 2;
          setCachingProgress({ current, total });
        } catch (e) {
          current += 2; // Still progress even if one fails
          setCachingProgress({ current, total });
        }
      }));
      // Small pause between chunks
      await new Promise(r => setTimeout(r, 100));
    }

    alert(`Offline cache complete! ~${total} tiles saved for this 2km region.`);
    setCachingProgress(null);
  };

  const repairMap = () => {
    localStorage.removeItem('la_map_center');
    localStorage.removeItem('la_map_style');
    localStorage.removeItem('la_active_tab');
    window.location.reload();
  };

  useEffect(() => {
    try {
      const LeadletGlobal = (window as any).L || L_Local;
      if (LeadletGlobal && LeadletGlobal.Icon && LeadletGlobal.Icon.Default) {
        delete LeadletGlobal.Icon.Default.prototype._getIconUrl;
        LeadletGlobal.Icon.Default.mergeOptions({
          iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
          iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
          shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
        });
      }
    } catch (err) {
      console.warn("Leaflet Icon Fix failed:", err);
    }
  }, []);

  useEffect(() => {
    return () => {
      if (watchId !== null) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, [watchId]);

  const addPoint = useCallback((latlng: any) => {
    if (latlng) setPoints(prev => [...prev, latlng]);
  }, []);

  const handleSegmentClick = (idx: number) => {
    const currentVal = manualMeasurements[`seg-${idx}`] || '';
    const newVal = prompt(`Enter manual tape measurement for this segment (Feet):`, currentVal);
    if (newVal !== null) {
      setManualMeasurements(prev => ({
        ...prev,
        [`seg-${idx}`]: newVal
      }));
    }
  };

  const dropCenterPin = () => {
    if (mapInstance) {
      const center = mapInstance.getCenter();
      addPoint({ lat: center.lat, lng: center.lng });
    }
  };

  const exportToProfessionalPDF = async () => {
    const element = document.getElementById('map-survey-capture-area');
    if (!element || !mapInstance) return;
    
    setIsExporting(true);
    try {
      // Small delay to ensure UI states settle
      await new Promise(r => setTimeout(r, 100));

      const canvas = await html2canvas(element, { 
        useCORS: true, 
        allowTaint: true,
        scale: 1.5, // Balanced for PDF size
        logging: false,
        backgroundColor: '#ffffff',
        ignoreElements: (el) => {
          return el.classList.contains('leaflet-control-zoom') || 
                 el.classList.contains('leaflet-control-attribution') ||
                 el.id === 'map-ui-controls'; // Hide buttons during capture
        }
      });
      
      const mapImage = canvas.toDataURL('image/png', 0.8);
      
      generatePDF(
        areaSqFt, 
        regionalName || 'Marla', 
        areaMarla, 
        normalizedPoints, 
        false, 
        mapImage,
        {
          surveyorName,
          location: locationName,
          clientName,
          manualArea,
          manualMeasurements
        }
      );
    } catch (e) {
      console.error("PDF Export failed:", e);
      alert('Professional PDF Export failed. Try saving a screenshot instead.');
    } finally {
      setIsExporting(false);
    }
  };

  const captureScreenshot = async () => {
    const element = document.getElementById('map-survey-capture-area');
    if (!element || !mapInstance) return;
    
    try {
      // Ensure map is stable
      mapInstance.invalidateSize();
      
      const canvas = await html2canvas(element, { 
        useCORS: true, 
        allowTaint: true,
        scale: 2, // High res
        logging: false,
        backgroundColor: '#ffffff',
        ignoreElements: (el) => {
          // Ignore zoom controls and other non-essential overlays during capture
          return el.classList.contains('leaflet-control-zoom') || 
                 el.classList.contains('leaflet-control-attribution');
        }
      });
      
      const link = document.createElement('a');
      link.download = `Land_Survey_${new Date().getTime()}.png`;
      link.href = canvas.toDataURL('image/png', 1.0);
      link.click();
    } catch (e) {
      console.error("Screenshot capture failed:", e);
      alert('Screenshot failed. Try Street view or save as KML/PDF.');
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim() || !mapInstance) return;
    setIsSearching(true);
    try {
      const query = searchQuery.trim();
      
      // Check if the query is a GPS coordinate (e.g., "31.5204, 74.3587")
      const coordinateMatch = query.match(/^([-+]?\d{1,2}([.]\d+)?),\s*([-+]?\d{1,3}([.]\d+)?)$/);
      
      if (coordinateMatch) {
        const lat = parseFloat(coordinateMatch[1]);
        const lng = parseFloat(coordinateMatch[3]);
        mapInstance.flyTo([lat, lng], 16);
      } else {
        const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1`);
        const data = await response.json();
        if (data && data.length > 0) {
          const { lat, lon } = data[0];
          mapInstance.flyTo([parseFloat(lat), parseFloat(lon)], 14);
        } else {
          alert("Location not found.");
        }
      }
    } catch (err) {
      alert("Search failed.");
    } finally {
      setIsSearching(false);
    }
  };

  const undoPoint = () => setPoints(prev => prev.slice(0, -1));
  const clearPoints = () => {
    setPoints([]);
    setManualMeasurements({});
    setManualArea('');
  };

  const toggleTracking = () => {
    if (watchId === null) {
      if ('geolocation' in navigator) {
        const id = navigator.geolocation.watchPosition(
          (position) => {
            const newPoint = { lat: position.coords.latitude, lng: position.coords.longitude };
            setPoints(prev => {
              if (prev.length === 0) return [newPoint];
              const lastPoint = prev[prev.length - 1];
              if (haversineDistanceFt(lastPoint, newPoint) > 5) return [...prev, newPoint];
              return prev;
            });
            if (autoFollow && mapInstance) mapInstance.panTo([newPoint.lat, newPoint.lng]);
          },
          (err) => { alert("GPS Error: " + err.message); setTracking(false); setWatchId(null); },
          { enableHighAccuracy: true }
        );
        setWatchId(id);
        setTracking(true);
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

  const safePoints = Array.isArray(points) ? points : [];
  const normalizedPoints = (safePoints.length > 0 && Array.isArray(safePoints[0])) ? safePoints : [safePoints];
  const areaSqFt = calculateAreaSqFt(normalizedPoints);
  const perimeterFt = calculatePerimeterFt(normalizedPoints[0] || []);
  const areaMarla = areaSqFt / (regionalDenominator || 225);

  const turfAvailable = !!getTurf();

  if (!turfAvailable) {
    return (
      <div className="flex flex-col items-center justify-center h-[500px] bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
        <RotateCcw size={40} className="animate-spin text-green-600 mb-4" />
        <p className="text-gray-500 font-bold">Bootstrapping GIS Engine...</p>
      </div>
    );
  }

  return (
    <div id="map-survey-capture-area" className="flex flex-col h-[calc(100vh-180px)] md:h-[600px] w-full relative bg-gray-50 rounded-xl overflow-hidden mb-8 shadow-inner border border-gray-200">
      {/* Offline Caching Progress Overlay */}
      {cachingProgress && (
        <div className="absolute inset-0 z-[2000] bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-white">
          <DownloadCloud size={48} className="animate-bounce mb-4 text-orange-400" />
          <h3 className="text-xl font-bold mb-2">Downloading Offline Maps...</h3>
          <p className="text-sm text-gray-300 mb-6 text-center">We are saving a 2km region around your current location for offline field use.</p>
          <div className="w-full max-w-xs bg-gray-700 h-3 rounded-full overflow-hidden mb-2">
            <div 
              className="bg-orange-500 h-full transition-all duration-300" 
              style={{ width: `${(cachingProgress.current / cachingProgress.total) * 100}%` }}
            />
          </div>
          <span className="text-xs font-mono">{cachingProgress.current} / {cachingProgress.total} Tiles</span>
        </div>
      )}

      <div className="bg-white shadow z-[1001] border-b border-gray-200 relative">
        <div className="p-3 flex justify-between items-center gap-2">
          <div className="flex-shrink-0">
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
                </>
              )}
            </div>
            <div className="flex items-center gap-1 mt-1">
              {surveyMode === 'area' && (
                <p className="text-sm font-semibold text-gray-700 bg-green-50 px-2 py-0.5 rounded-md inline-block border border-green-100 whitespace-nowrap">{areaMarla.toFixed(2)} Marla</p>
              )}
              <form onSubmit={handleSearch} className="md:hidden flex items-center gap-1 bg-gray-100 border border-gray-200 rounded-md px-1.5 py-0.5 w-[76px]">
                <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="City..." className="bg-transparent border-none text-[10px] font-semibold focus:outline-none w-full" />
                <button type="submit" disabled={isSearching} className="text-[#2E7D32] flex-shrink-0"><Search size={11} /></button>
              </form>
            </div>
          </div>

          <form onSubmit={handleSearch} className="hidden md:flex gap-1 bg-gray-100 p-1 rounded-xl border border-gray-200 flex-1 mx-2 max-w-[220px]">
            <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="City/Region..." className="flex-1 bg-transparent border-none px-2 py-1 text-[11px] focus:outline-none font-bold w-0 min-w-0" />
            <button type="submit" disabled={isSearching} className="bg-[#2E7D32] text-white p-1.5 rounded-lg active:scale-95 transition shadow-sm"><Search size={13} /></button>
            <button type="button" onClick={repairMap} className="bg-red-50 text-red-600 p-1.5 rounded-lg border border-red-100 ml-1 active:scale-95" title="Repair Map View">🔧</button>
          </form>

          <div id="map-ui-controls" className="flex gap-1.5 flex-shrink-0">
            <button onClick={() => setShowMeta(!showMeta)} className={`p-2 rounded-lg border active:scale-95 transition-all ${showMeta ? 'bg-green-600 text-white border-green-700' : 'bg-green-50 text-green-700 border-green-100'}`} title="Report Details">
              <Plus size={18} className={showMeta ? 'rotate-45 transition-transform' : 'transition-transform'} />
            </button>
            <button onClick={captureScreenshot} className="p-2 bg-indigo-50 text-indigo-700 rounded-lg border border-indigo-100 active:scale-95" title="Save Screenshot"><Camera size={18} /></button>
            <button onClick={() => generateCSV(normalizedPoints)} disabled={normalizedPoints.flat().length < 1} className="p-2 bg-amber-50 text-amber-700 rounded-lg border border-amber-100 disabled:opacity-50" title="CSV"><Check size={18} /></button>
            <button onClick={() => generateKML(normalizedPoints)} disabled={normalizedPoints.flat().length < 3} className="p-2 bg-blue-50 text-blue-700 rounded-lg border border-blue-100 disabled:opacity-50" title="KML"><Download size={18} /></button>
            <button 
              onClick={exportToProfessionalPDF} 
              disabled={normalizedPoints.flat().length < 3 || isExporting} 
              className={`p-2 text-white rounded-lg active:scale-95 disabled:opacity-50 shadow-sm transition-all ${isExporting ? 'bg-gray-400' : 'bg-[#2E7D32]'}`} 
              title="Official PDF Report"
            >
              {isExporting ? <RotateCcw size={18} className="animate-spin" /> : <Save size={18} />}
            </button>
          </div>
        </div>

        {/* Report Metadata Overlay */}
        {showMeta && (
          <div className="p-3 bg-green-50 border-t border-green-100 flex flex-col md:flex-row gap-3 animate-in slide-in-from-top duration-200">
            <div className="flex-1">
              <label className="text-[10px] font-black text-green-700 uppercase mb-1 block">Surveyor Name</label>
              <input 
                type="text" 
                value={surveyorName} 
                onChange={(e) => setSurveyorName(e.target.value)}
                placeholder="Name or License #"
                className="w-full bg-white border border-green-200 rounded-md px-2 py-1.5 text-xs font-bold focus:ring-2 focus:ring-green-500 outline-none"
              />
            </div>
            <div className="flex-1">
              <label className="text-[10px] font-black text-green-700 uppercase mb-1 block">Property / Client Name</label>
              <input 
                type="text" 
                value={clientName} 
                onChange={(e) => setClientName(e.target.value)}
                placeholder="e.g. Plot 42, Ali Ahmed"
                className="w-full bg-white border border-green-200 rounded-md px-2 py-1.5 text-xs font-bold focus:ring-2 focus:ring-green-500 outline-none"
              />
            </div>
            <div className="flex-1">
              <label className="text-[10px] font-black text-green-700 uppercase mb-1 block">General Location</label>
              <input 
                type="text" 
                value={locationName} 
                onChange={(e) => setLocationName(e.target.value)}
                placeholder="Area/Town/City"
                className="w-full bg-white border border-green-200 rounded-md px-2 py-1.5 text-xs font-bold focus:ring-2 focus:ring-green-500 outline-none"
              />
            </div>
            <div className="flex-1">
              <label className="text-[10px] font-black text-blue-700 uppercase mb-1 block italic underline">Manual Measured Area (Actual)</label>
              <input 
                type="text" 
                value={manualArea} 
                onChange={(e) => setManualArea(e.target.value)}
                placeholder="e.g. 275.5 Sq Ft"
                className="w-full bg-blue-50 border border-blue-200 rounded-md px-2 py-1.5 text-xs font-black focus:ring-2 focus:ring-blue-500 outline-none text-blue-800 placeholder:text-blue-300"
              />
            </div>
          </div>
        )}
      </div>

      <div className="flex-1 relative z-0">
        <MapContainer 
          center={safeCenter} 
          zoom={16} 
          style={{ height: '100%', width: '100%' }}
          preferCanvas={true}
        >
          <MapController onMapInit={setMapInstance} onMove={setCenterCoords} />
          {mapStyle === 'satellite' ? (
            <TileLayer attribution='&copy; ESRI' url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}" maxZoom={19} />
          ) : (
            <TileLayer attribution='&copy; OpenStreetMap' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" maxZoom={19} />
          )}
          <LocationMarker onPointAdd={addPoint} />
          <GeomanControls setPoints={setPoints} surveyMode={surveyMode} />
          <ProMappingToolbox surveyMode={surveyMode} onPreCache={preCacheCurrentRegion} isCaching={!!cachingProgress} />
          <EdgeLabels 
            points={normalizedPoints[0] || []} 
            manualMeasurements={manualMeasurements} 
            onSegmentClick={handleSegmentClick} 
          />

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
                      const newP = [...prev];
                      if (Array.isArray(newP[0])) newP[0][i] = { lat, lng };
                      else newP[i] = { lat, lng };
                      return newP;
                    });
                  }
                }}
              />
            ) : null
          ))}

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

        <div className="absolute top-2 right-2 z-[500]">
          <button 
            onClick={(e) => { e.stopPropagation(); setMapStyle(s => s === 'satellite' ? 'street' : 'satellite'); }} 
            className="flex items-center gap-1 px-2.5 py-1 bg-white/90 backdrop-blur-sm rounded-lg shadow-md border border-gray-300 text-[10px] font-black pointer-events-auto"
          >
            {mapStyle === 'satellite' ? '🛰 SAT' : '🗺 MAP'}
          </button>
        </div>
        <div className="absolute top-12 right-2 z-[500]">
          <button 
            onClick={(e) => { e.stopPropagation(); setAutoFollow(!autoFollow); }} 
            className={`flex items-center gap-1 px-2 py-1 rounded-lg shadow-md border text-[10px] font-black transition-all pointer-events-auto ${autoFollow ? 'bg-blue-600 text-white' : 'bg-white/90 text-gray-400'}`}
          >
            {autoFollow ? '📍 FOLLOWING' : '📍 FOLLOW'}
          </button>
        </div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none z-[400] text-yellow-400 drop-shadow-[0_0_3px_rgba(0,0,0,1)]"><Crosshair size={32} strokeWidth={2.5} /></div>
        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 z-[500] pointer-events-auto w-[90%] md:w-auto">
          <button onClick={copyToClipboard} className="flex items-center gap-2 px-3 py-1 bg-white/90 backdrop-blur-sm rounded-lg shadow-md border border-gray-300 hover:bg-white transition-all active:scale-95 group mx-auto">
            <div className="flex flex-col items-start leading-tight">
              <span className="text-[8px] font-black text-gray-400 uppercase">Target GPS</span>
              <span className="text-[10px] md:text-xs font-bold text-gray-800">{(centerCoords?.lat || 0).toFixed(6)}, {(centerCoords?.lng || 0).toFixed(6)}</span>
            </div>
            <div className="pl-2 border-l border-gray-200">{copied ? <Check size={12} className="text-green-600" /> : <Copy size={12} />}</div>
          </button>
        </div>
      </div>

      <div className="absolute bottom-10 md:bottom-6 left-0 right-0 z-[1000] flex justify-between px-4 md:px-6 pointer-events-none">
        <div className="flex flex-col gap-3 pointer-events-auto">
          <button onClick={undoPoint} disabled={points.length === 0} className="w-12 h-12 flex items-center justify-center bg-white rounded-full shadow-lg border border-gray-200 disabled:opacity-40 active:scale-90"><RotateCcw size={22} /></button>
          <button onClick={clearPoints} disabled={points.length === 0} className="w-12 h-12 flex items-center justify-center bg-white text-red-500 rounded-full shadow-lg border border-gray-200 disabled:opacity-40 active:scale-90"><Trash2 size={22} /></button>
        </div>
        <div className="flex items-center gap-4 pointer-events-auto">
          <button onClick={dropCenterPin} className="w-16 h-16 bg-teal-600 text-white rounded-full shadow-2xl border-4 border-white active:scale-95"><Crosshair size={28} /></button>
          <button onClick={toggleTracking} className={`w-16 h-16 rounded-full shadow-2xl border-4 border-white active:scale-95 ${tracking ? 'bg-red-500 animate-pulse' : 'bg-blue-600'}`}>{tracking ? <Navigation size={28} /> : <MapPin size={28} />}</button>
        </div>
        <div className="flex flex-col gap-2 pointer-events-auto items-center">
          <button onClick={() => { setSurveyMode(m => m === 'area' ? 'path' : 'area'); clearPoints(); }} className={`w-12 h-12 flex flex-col items-center justify-center rounded-full shadow-lg border-2 text-[9px] font-black transition-colors ${surveyMode === 'path' ? 'bg-red-500 text-white' : 'bg-white text-gray-700'}`}>{surveyMode === 'area' ? '📐' : '📏'} <span>{surveyMode === 'area' ? 'AREA' : 'PATH'}</span></button>
        </div>
      </div>
    </div>
  );
}
