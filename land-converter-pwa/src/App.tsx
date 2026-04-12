import { useState } from 'react';
import { translations } from './locales';
import { Settings, BarChart2, Calculator, ArrowLeftRight, Info } from 'lucide-react';
import { ConverterTab } from './components/ConverterTab';
import { AreaCalculatorTab } from './components/AreaCalculatorTab';
import { VizTab } from './components/VizTab';
import { ReverseLookupTab } from './components/ReverseLookupTab';
import { AboutTab } from './components/AboutTab';

export default function App() {
  const [isUrdu, setIsUrdu] = useState(false);
  const [activeTab, setActiveTab] = useState('converter');
  const t = isUrdu ? translations.ur : translations.en;

  const tabs = [
    { id: 'converter', icon: <ArrowLeftRight size={20} />, label: t.tabConverter },
    { id: 'viz', icon: <BarChart2 size={20} />, label: t.tabViz },
    { id: 'lookup', icon: <Settings size={20} />, label: t.tabLookup },
    { id: 'area', icon: <Calculator size={20} />, label: t.tabArea },
    { id: 'about', icon: <Info size={20} />, label: t.tabAbout }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 pb-16 md:pb-0 font-sans">
      {/* Header */}
      <header className="bg-[#2E7D32] text-white p-4 shadow-md sticky top-0 z-50">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-xl md:text-2xl font-bold tracking-tight">{t.appTitle}</h1>
            <p className="text-sm text-green-100 hidden md:block">{t.subtitle}</p>
          </div>
          <button 
            onClick={() => setIsUrdu(!isUrdu)}
            className="bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-lg border border-white/40 shadow-sm transition backdrop-blur-sm text-sm font-semibold"
          >
            {isUrdu ? 'English' : 'اردو'}
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-4xl mx-auto p-4 md:p-6 md:mt-4 bg-white md:rounded-xl md:shadow-sm">
        {activeTab === 'converter' && <ConverterTab t={t} />}
        {activeTab === 'viz' && <VizTab data={[{legalMarla: 12, tradMarla: 14}, {legalMarla: 3, tradMarla: 3.5}]} />}
        {activeTab === 'lookup' && <ReverseLookupTab />}
        {activeTab === 'area' && <AreaCalculatorTab t={t} />}
        {activeTab === 'about' && <AboutTab />}
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="fixed bottom-0 w-full bg-white border-t border-gray-200 md:hidden flex justify-around p-2 pb-safe z-50">
        {tabs.map(tab => (
          <button 
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex flex-col items-center p-2 rounded-xl transition-colors ${activeTab === tab.id ? 'text-[#2E7D32] bg-green-50' : 'text-gray-500'}`}
          >
            {tab.icon}
            <span className="text-[10px] mt-1 font-medium">{tab.label}</span>
          </button>
        ))}
      </nav>

      {/* Desktop Sidebar Navigation (Optional Alternative for Desktop) */}
      <nav className="hidden md:flex max-w-4xl mx-auto w-full gap-2 mt-4 px-4 pb-8">
        {tabs.map(tab => (
          <button 
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition flex-1 justify-center ${activeTab === tab.id ? 'bg-[#2E7D32] text-white shadow-md' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}
