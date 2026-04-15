import { useState, useEffect } from 'react';
import { translations } from './locales';
import { Settings, BarChart2, Calculator, ArrowLeftRight, Info, Map as MapIcon, Globe, NotebookPen } from 'lucide-react';
import { ConverterTab } from './components/ConverterTab';
import { AreaCalculatorTab } from './components/AreaCalculatorTab';
import { VizTab } from './components/VizTab';
import { ReverseLookupTab } from './components/ReverseLookupTab';
import { AboutTab } from './components/AboutTab';
import { MapSurveyTab } from './components/MapSurveyTab';
import { NotesTab } from './components/NotesTab';
import { Field } from './types/survey';

const REGIONAL_STANDARDS = [
  { id: 'punjab_legal', name: 'Punjab Legal', unit: 225 },
  { id: 'lahore_lda', name: 'Lahore LDA', unit: 250 },
  { id: 'traditional', name: 'Traditional', unit: 272.25 },
];

const LANGUAGES = [
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'ur', name: 'اردو', flag: '🇵🇰' },
  { code: 'hi', name: 'हिन्दी', flag: '🇮🇳' },
  { code: 'bn', name: 'বাংলা', flag: '🇧🇩' },
  { code: 'si', name: 'සිංහල', flag: '🇱🇰' },
  { code: 'ar', name: 'العربية', flag: '🇦🇪' },
  { code: 'tr', name: 'Türkçe', flag: '🇹🇷' },
];

const DEFAULT_FIELD: Field = {
  id: 'f1',
  name: 'Field 1',
  points: [],
  color: '#2E7D32',
};

export default function App() {
  const [langCode, setLangCode] = useState(() => localStorage.getItem('app_lang') || 'en');
  const [activeTab, setActiveTab] = useState('map');
  const [region, setRegion] = useState(REGIONAL_STANDARDS[0]);
  const [converterHistory, setConverterHistory] = useState<any[]>([]);
  
  // Survey State Persistence
  const [fields, setFields] = useState<Field[]>(() => {
    const saved = localStorage.getItem('survey_fields');
    return saved ? JSON.parse(saved) : [DEFAULT_FIELD];
  });
  const [activeFieldId, setActiveFieldId] = useState(() => {
    return localStorage.getItem('active_field_id') || 'f1';
  });

  useEffect(() => {
    localStorage.setItem('survey_fields', JSON.stringify(fields));
  }, [fields]);

  useEffect(() => {
    localStorage.setItem('active_field_id', activeFieldId);
  }, [activeFieldId]);
  
  useEffect(() => {
    localStorage.setItem('app_lang', langCode);
  }, [langCode]);

  // Handle translation safely (fallback to English if lang not exists yet)
  const t = (translations as any)[langCode] || translations.en;
  const isRTL = ['ur', 'ar'].includes(langCode);

  const tabs = [
    { id: 'map', icon: <MapIcon size={20} />, label: t.tabMap || 'Map Survey' },
    { id: 'area', icon: <Calculator size={20} />, label: t.tabArea || 'Area Calculator' },
    { id: 'converter', icon: <ArrowLeftRight size={20} />, label: t.tabConverter || 'Converter' },
    { id: 'lookup', icon: <Settings size={20} />, label: t.tabLookup || 'Lookup' },
    { id: 'viz', icon: <BarChart2 size={20} />, label: t.tabViz || 'Viz' },
    { id: 'notes', icon: <NotebookPen size={20} />, label: 'Notes' },
    { id: 'about', icon: <Info size={20} />, label: t.tabAbout || 'About' }
  ];

  return (
    <div className={`flex flex-col min-h-screen bg-gray-50 pb-20 md:pb-0 font-sans ${isRTL ? 'rtl' : 'ltr'}`} dir={isRTL ? 'rtl' : 'ltr'}>
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
              value={region.unit}
              onChange={(e) => setRegion(REGIONAL_STANDARDS.find(r => r.unit === Number(e.target.value))!)}
              className="bg-white/10 text-white border border-white/30 rounded-lg px-2 py-1.5 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-white flex-1 md:w-auto option-text-dark"
            >
              {REGIONAL_STANDARDS.map(r => (
                <option key={r.id} value={r.unit} className="text-gray-900">{r.name} ({r.unit} sq ft)</option>
              ))}
            </select>
            
            <select 
              value={langCode}
              onChange={(e) => setLangCode(e.target.value)}
              className="bg-white/20 text-white border border-white/40 rounded-lg px-3 py-1.5 text-xs font-bold focus:outline-none backdrop-blur-sm"
            >
              {LANGUAGES.map(l => (
                <option key={l.code} value={l.code} className="text-gray-900">{l.flag} {l.name}</option>
              ))}
            </select>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-4xl mx-auto p-3 md:p-6 bg-white md:rounded-xl md:shadow-sm md:mt-4">
        {/* We use 'hidden' instead of conditional rendering to keep map state alive even if not lifted */}
        <div className={activeTab === 'map' ? 'block' : 'hidden'}>
          <MapSurveyTab 
            regionalDenominator={region.unit} 
            fields={fields}
            setFields={setFields}
            activeFieldId={activeFieldId}
            setActiveFieldId={setActiveFieldId}
          />
        </div>
        
        {activeTab === 'converter' && <ConverterTab t={t} onHistoryUpdate={setConverterHistory} />}
        {activeTab === 'viz' && <VizTab data={converterHistory} />}
        {activeTab === 'lookup' && <ReverseLookupTab />}
        {activeTab === 'area' && <AreaCalculatorTab t={t} />}
        {activeTab === 'notes' && <NotesTab />}
        {activeTab === 'about' && <AboutTab />}
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="fixed bottom-0 w-full bg-white border-t border-gray-200 md:hidden flex overflow-x-auto p-2 pb-safe z-50">
        {tabs.map(tab => (
          <button 
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex flex-col items-center min-w-[60px] p-2 rounded-xl transition-colors ${activeTab === tab.id ? 'text-[#2E7D32] bg-green-50 shadow-inner' : 'text-gray-500'}`}
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

