import { useEffect } from 'react';
import { useLocalStorage } from './hooks/useLocalStorage';
import { translations } from './locales';
import { Settings, BarChart2, Calculator, ArrowLeftRight, Info, Map as MapIcon, Globe, NotebookPen } from 'lucide-react';
import { ConverterTab } from './components/ConverterTab';
import { AreaCalculatorTab } from './components/AreaCalculatorTab';
import { VizTab } from './components/VizTab';
import { ReverseLookupTab } from './components/ReverseLookupTab';
import { AboutTab } from './components/AboutTab';
import { MapSurveyTab } from './components/MapSurveyTab';
import { NotesTab } from './components/NotesTab';

const REGIONAL_STANDARDS: RegionalStandard[] = [
  // ── Pakistan / Punjab ──────────────────────────────
  { id: 'punjab_legal', name: 'Punjab Legal', unit: 225, unitName: 'Marla', group: 'Pakistan / Punjab', subUnit: { name: 'Kanal', factor: 20 } },
  { id: 'lahore_lda', name: 'Lahore LDA', unit: 250, unitName: 'Marla', group: 'Pakistan / Punjab', subUnit: { name: 'Kanal', factor: 20 } },
  { id: 'traditional', name: 'Traditional', unit: 272, unitName: 'Marla', group: 'Pakistan / Punjab', subUnit: { name: 'Kanal', factor: 20 } },
  { id: 'rural_revenue', name: 'Rural/Revenue', unit: 272.25, unitName: 'Marla', group: 'Pakistan / Punjab', subUnit: { name: 'Kanal', factor: 20 } },

  // ── India — North ─────────────────────────────────
  { id: 'india_kanal', name: 'J&K / Himachal', unit: 5445, unitName: 'Kanal', group: 'India — North', subUnit: { name: 'Marla', factor: 20 } },
  { id: 'india_bigha_up', name: 'UP / Bihar Bigha', unit: 27000, unitName: 'Bigha', group: 'India — North', subUnit: { name: 'Biswa', factor: 20 } },

  // ── India — East ──────────────────────────────────
  { id: 'katha_wb', name: 'Katha (West Bengal)', unit: 720, unitName: 'Katha', group: 'India — East' },
  { id: 'katha_bihar', name: 'Katha (Bihar)', unit: 1361, unitName: 'Katha', group: 'India — East' },
  { id: 'katha_assam', name: 'Katha (Assam)', unit: 2880, unitName: 'Katha', group: 'India — East' },
  { id: 'dhur_bihar', name: 'Dhur (Bihar)', unit: 68, unitName: 'Dhur', group: 'India — East' },

  // ── India — West & South ──────────────────────────
  { id: 'guntha', name: 'Guntha (Maharashtra / Karnataka)', unit: 1089, unitName: 'Guntha', group: 'India — West & South' },
  { id: 'cent', name: 'Cent (Tamil Nadu / Kerala)', unit: 435.6, unitName: 'Cent', group: 'India — South' },

  // ── Nepal ─────────────────────────────────────────
  { id: 'ropani', name: 'Ropani (Nepal Hills)', unit: 5476, unitName: 'Ropani', group: 'Nepal', subUnit: { name: 'Aana', factor: 16 } },
  { id: 'dhur_nepal', name: 'Dhur (Nepal)', unit: 182.25, unitName: 'Dhur', group: 'Nepal' },
  { id: 'katha_nepal', name: 'Katha (Nepal)', unit: 3645, unitName: 'Katha', group: 'Nepal' },
  { id: 'bigha_nepal', name: 'Bigha (Nepal Terai)', unit: 6772.41, unitName: 'Bigha', group: 'Nepal', subUnit: { name: 'Katha', factor: 20 } },

  // ── Universal ─────────────────────────────────────
  { id: 'acre', name: 'Acre', unit: 43560, unitName: 'Acre', group: 'Universal' },
  { id: 'hectare', name: 'Hectare', unit: 107639.1, unitName: 'Hectare', group: 'Universal' },
];

interface RegionalStandard {
  id: string;
  name: string;
  unit: number;
  unitName: string;
  group: string;
  subUnit?: { name: string; factor: number };
}

export default function App() {
  const [language, setLanguage] = useLocalStorage('la_language', 'en');
  const [activeTab, setActiveTab] = useLocalStorage('la_active_tab', 'map');
  const [regionId, setRegionId] = useLocalStorage('la_region_id', 'punjab_legal');
  const [converterHistory, setConverterHistory] = useLocalStorage<any[]>('la_converter_history', []);
  
  const region = REGIONAL_STANDARDS.find(r => r.id === regionId) || REGIONAL_STANDARDS[0];

  useEffect(() => {
    const validTabs = ['map', 'area', 'converter', 'lookup', 'viz', 'notes', 'about'];
    if (!validTabs.includes(activeTab)) {
      setActiveTab('map');
    }

    // SANITIZE POINTS: Prevent crash from Shapefile corruption
    try {
      const storedPoints = localStorage.getItem('la_map_points');
      if (storedPoints) {
        const parsed = JSON.parse(storedPoints);
        if (!Array.isArray(parsed)) {
          localStorage.setItem('la_map_points', '[]');
          window.location.reload();
        }
      }
    } catch (e) {
       localStorage.setItem('la_map_points', '[]');
    }
  }, []);
  
  const t = translations[language] || translations.en;

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
              value={regionId}
              onChange={(e) => setRegionId(e.target.value)}
              className="bg-white/10 text-white border border-white/30 rounded-lg px-2 py-1.5 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-white flex-1 md:w-auto [&>option]:text-gray-900 [&>optgroup]:text-gray-600 [&>optgroup]:font-bold"
            >
              {Array.from(new Set(REGIONAL_STANDARDS.map(r => r.group))).map(group => (
                <optgroup key={group} label={group}>
                  {REGIONAL_STANDARDS.filter(r => r.group === group).map(r => (
                    <option key={r.id} value={r.id}>{r.name} ({r.unit.toLocaleString()} sq ft / {r.unitName})</option>
                  ))}
                </optgroup>
              ))}
            </select>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="bg-white/20 text-white border border-white/40 rounded-lg px-2 py-1.5 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-white shadow-sm transition backdrop-blur-sm [&>option]:text-gray-900"
            >
              <option value="en">EN</option>
              <option value="ur">اردو</option>
              <option value="hi">हिंदी</option>
              <option value="bn">বাংলা</option>
              <option value="pa">ਪੰਜਾਬੀ</option>
              <option value="ne">नेपाली</option>
              <option value="mr">मराठी</option>
              <option value="si">සිංහල</option>
              <option value="ta">தமிழ்</option>
              <option value="te">తెలుగు</option>
              <option value="gu">ગુજરાતી</option>
              <option value="ml">മലയാളം</option>
              <option value="kn">ಕನ್ನಡ</option>
              <option value="or">ଓଡ଼ିଆ</option>
              <option value="ps">پښتو</option>
              <option value="sd">سنڌي</option>
            </select>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-4xl mx-auto p-3 md:p-6 bg-white md:rounded-xl md:shadow-sm md:mt-4">
        {activeTab === 'map' && <MapSurveyTab regionalDenominator={region.unit} regionalName={region.unitName} />}
        {activeTab === 'converter' && (
          <ConverterTab 
            t={t} 
            region={region}
            initialHistory={converterHistory} 
            onHistoryUpdate={setConverterHistory} 
          />
        )}
        {activeTab === 'viz' && <VizTab data={converterHistory} />}
        {activeTab === 'lookup' && <ReverseLookupTab region={region} />}
        {activeTab === 'area' && <AreaCalculatorTab t={t} regionalDenominator={region.unit} />}
        {activeTab === 'notes' && <NotesTab />}
        {activeTab === 'about' && <AboutTab t={t} />}
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="fixed bottom-0 w-full bg-white border-t border-gray-200 md:hidden flex overflow-x-auto p-2 pb-safe z-50">
        {tabs.map(tab => (
          <button 
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex flex-col items-center min-w-[72px] p-2 rounded-xl transition-colors ${activeTab === tab.id ? 'text-[#2E7D32] bg-green-50 shadow-inner' : 'text-gray-500'}`}
          >
            {tab.icon}
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
