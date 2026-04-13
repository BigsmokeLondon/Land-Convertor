import { useState } from 'react';
import { translations } from './locales';
import { Settings, BarChart2, Calculator, ArrowLeftRight, Info, Map as MapIcon, Globe } from 'lucide-react';
import { ConverterTab } from './components/ConverterTab';
import { AreaCalculatorTab } from './components/AreaCalculatorTab';
import { VizTab } from './components/VizTab';
import { ReverseLookupTab } from './components/ReverseLookupTab';
import { AboutTab } from './components/AboutTab';
import { MapSurveyTab } from './components/MapSurveyTab';

const REGIONAL_STANDARDS = [
  { id: 'punjab_legal', name: 'Punjab Legal', unit: 225 },
  { id: 'lahore_lda', name: 'Lahore LDA', unit: 250 },
  { id: 'traditional', name: 'Traditional', unit: 272.25 },
];

export default function App() {
  const [isUrdu, setIsUrdu] = useState(false);
  const [activeTab, setActiveTab] = useState('map'); // Default to map field app!
  const [region, setRegion] = useState(REGIONAL_STANDARDS[0]);
  
  const t = isUrdu ? translations.ur : translations.en;

  const tabs = [
    { id: 'map', icon: <MapIcon size={20} />, label: t.tabMap },
    { id: 'area', icon: <Calculator size={20} />, label: t.tabArea },
    { id: 'converter', icon: <ArrowLeftRight size={20} />, label: t.tabConverter },
    { id: 'lookup', icon: <Settings size={20} />, label: t.tabLookup },
    { id: 'viz', icon: <BarChart2 size={20} />, label: t.tabViz },
    { id: 'about', icon: <Info size={20} />, label: t.tabAbout }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 pb-20 md:pb-0 font-sans">
      {/* Header */}
      <header className="bg-[#2E7D32] text-white p-3 shadow-md sticky top-0 z-50">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-2 md:gap-0">
          <div>
            <h1 className="text-xl md:text-2xl font-black tracking-tight flex items-center gap-2">
              <Globe size={24} /> {t.appTitle}
            </h1>
          </div>
          <div className="flex items-center gap-2 w-full md:w-auto">
            <select 
              value={region.unit}
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
        {activeTab === 'map' && <MapSurveyTab regionalDenominator={region.unit} />}
        {activeTab === 'converter' && <ConverterTab t={t} />}
        {activeTab === 'viz' && <VizTab data={[{legalMarla: 12, tradMarla: 14}, {legalMarla: 3, tradMarla: 3.5}]} />}
        {activeTab === 'lookup' && <ReverseLookupTab />}
        {activeTab === 'area' && <AreaCalculatorTab t={t} />}
        {activeTab === 'about' && <AboutTab />}
      </main>

      {/* Mobile Bottom Navigation (Scrollable internally) */}
      <nav className="fixed bottom-0 w-full bg-white border-t border-gray-200 md:hidden flex overflow-x-auto p-2 pb-safe z-50">
        {tabs.map(tab => (
          <button 
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex flex-col items-center min-w-[70px] p-2 rounded-xl transition-colors ${activeTab === tab.id ? 'text-[#2E7D32] bg-green-50 shadow-inner' : 'text-gray-500'}`}
          >
            {tab.icon}
            <span className="text-[10px] mt-1 font-bold whitespace-nowrap">{tab.label}</span>
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
