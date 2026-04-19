import { useEffect } from 'react';
import { useLocalStorage } from './hooks/useLocalStorage';
// REDEPLOY PING: Restoring yesterday's stable version - cache invalidate
import { translations } from './locales';
import { Settings, BarChart2, Calculator, ArrowLeftRight, Info, Map as MapIcon, Globe, NotebookPen } from 'lucide-react';
import { ConverterTab } from './components/ConverterTab';
import { AreaCalculatorTab } from './components/AreaCalculatorTab';
import { VizTab } from './components/VizTab';
import { ReverseLookupTab } from './components/ReverseLookupTab';
import { AboutTab } from './components/AboutTab';
import { MapSurveyTab } from './components/MapSurveyTab';
import { NotesTab } from './components/NotesTab';

const REGIONAL_STANDARDS = [
  { id: 'punjab_legal', name: 'Punjab Legal', unit: 225 },
  { id: 'lahore_lda', name: 'Lahore LDA', unit: 250 },
  { id: 'traditional', name: 'Traditional', unit: 272 },
  { id: 'rural_revenue', name: 'Rural/Revenue', unit: 272.25 },
];

export default function App() {
  const [isUrdu, setIsUrdu] = useLocalStorage('la_is_urdu', false);
  const [activeTab, setActiveTab] = useLocalStorage('la_active_tab', 'map');
  const [region, setRegion] = useLocalStorage('la_region', REGIONAL_STANDARDS[0]);
  const [converterHistory, setConverterHistory] = useLocalStorage<any[]>('la_converter_history', []);
  
  // Debug Persistence & Sanitization
  useEffect(() => {
    const validTabs = ['map', 'area', 'converter', 'lookup', 'viz', 'notes', 'about'];
    if (!validTabs.includes(activeTab)) {
      console.warn('Invalid tab detected, resetting to map:', activeTab);
      setActiveTab('map');
    }
    
    // Ensure region is valid and matches its reference
    if (!region || typeof region.unit === 'undefined') {
       setRegion(REGIONAL_STANDARDS[0]);
    } else {
       const matched = REGIONAL_STANDARDS.find(r => r.unit === region.unit);
       if (!matched) {
          console.warn('Invalid region detected, resetting to default:', region);
          setRegion(REGIONAL_STANDARDS[0]);
       } else {
          // Identity sync (ensures region === REGIONAL_STANDARDS[i])
          setRegion(matched);
       }
    }

    console.log('App Mounted & Sanitized. Active Tab:', activeTab);
  }, []);
  
  const t = isUrdu ? translations.ur : translations.en;

  const tabs = [
    { id: 'map', icon: <MapIcon size={20} />, label: t.tabMap },
    { id: 'area', icon: <Calculator size={20} />, label: t.tabArea },
    { id: 'converter', icon: <ArrowLeftRight size={20} />, label: t.tabConverter },
    { id: 'lookup', icon: <Settings size={20} />, label: t.tabLookup },
    { id: 'viz', icon: <BarChart2 size={20} />, label: t.tabViz },
    { id: 'notes', icon: <NotebookPen size={20} />, label: 'Notes' },
    { id: 'about', icon: <Info size={20} />, label: t.tabAbout }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 pb-20 md:pb-0 font-sans">
      {/* Header */}
      <header className="bg-[#2E7D32] text-white p-3 shadow-md sticky top-0 z-50">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-2 md:gap-0">
          <div>
            <h1 className="text-xs md:text-sm font-black tracking-tight flex items-center gap-2">
              <Globe size={18} /> {t.appTitle}
            </h1>
          </div>
          <div className="flex items-center gap-2 w-full md:w-auto">
            <select 
              value={region?.unit || 225}
              onChange={(e) => setRegion(REGIONAL_STANDARDS.find(r => r.unit === Number(e.target.value))!)}
              className="bg-white/10 text-white border border-white/30 rounded-lg px-2 py-1.5 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-white flex-1 md:w-auto option-text-dark"
            >
              {REGIONAL_STANDARDS.map(r => (
                <option key={r.id} value={r.unit} className="text-gray-900">{r.name} ({r.unit} sq ft)</option>
              ))}
            </select>
            <button 
              onClick={() => setIsUrdu(!isUrdu)}
              className="bg-white/20 hover:bg-white/30 px-4 py-1.5 rounded-lg border border-white/40 shadow-sm transition backdrop-blur-sm text-xs font-bold"
            >
              {isUrdu ? 'EN' : 'اردو'}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-4xl mx-auto p-3 md:p-6 bg-white md:rounded-xl md:shadow-sm md:mt-4">
        {activeTab === 'map' && <MapSurveyTab regionalDenominator={region.unit} regionalName={region.name} />}
        {activeTab === 'converter' && <ConverterTab t={t} initialHistory={converterHistory} onHistoryUpdate={setConverterHistory} />}
        {activeTab === 'viz' && <VizTab data={converterHistory} />}
        {activeTab === 'lookup' && <ReverseLookupTab />}
        {activeTab === 'area' && <AreaCalculatorTab t={t} regionalDenominator={region.unit} />}
        {activeTab === 'notes' && <NotesTab />}
        {activeTab === 'about' && <AboutTab />}
      </main>

      {/* Mobile Bottom Navigation (Scrollable internally) */}
      <nav className="fixed bottom-0 w-full bg-white border-t border-gray-200 md:hidden flex overflow-x-auto p-2 pb-safe z-50 snap-x">
        {tabs.map(tab => (
          <button 
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex flex-col items-center min-w-[72px] p-2 rounded-xl transition-colors snap-center ${activeTab === tab.id ? 'text-[#2E7D32] bg-green-50 shadow-inner' : 'text-gray-500'}`}
          >
            <div className={`transition-transform duration-200 ${activeTab === tab.id ? 'scale-110' : 'scale-100'}`}>
              {tab.icon}
            </div>
            <span className="text-[9px] mt-1 font-bold whitespace-nowrap">{tab.label}</span>
          </button>
        ))}
      </nav>

      {/* Desktop Sidebar Navigation */}
      <nav className="hidden md:flex max-w-4xl mx-auto w-full gap-2 mt-4 px-4 pb-8 flex-wrap">
        {tabs.map(tab => (
          <button 
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold transition flex-1 justify-center whitespace-nowrap ${activeTab === tab.id ? 'bg-[#2E7D32] text-white shadow-md' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}
