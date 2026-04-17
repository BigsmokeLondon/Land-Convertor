import { useState } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { ArrowDown, Download, Plus, FileText } from 'lucide-react';
import { 
  SQFT_PER_MARLA_LEGAL, SQFT_PER_KANAL_LEGAL, 
  SQFT_PER_MARLA_LDA, SQFT_PER_KANAL_LDA, 
  SQFT_PER_MARLA_TRAD, SQFT_PER_KANAL_TRAD,
  SQFT_PER_MARLA_RURAL, SQFT_PER_KANAL_RURAL,
  SQFT_PER_SQ_KARAM 
} from '../utils/calculations';
import { exportToExcel } from '../utils/ExcelExport';
import { generateConverterPDF } from '../utils/exporting';

export function ConverterTab({ t, initialHistory = [], onHistoryUpdate }: { t: any; initialHistory?: any[]; onHistoryUpdate?: (h: any[]) => void }) {
  const [sqftMode, setSqftMode] = useLocalStorage('la_conv_mode', true);
  const [inputVal, setInputVal] = useLocalStorage('la_conv_input', '');
  const [history, setHistory] = useState<any[]>(initialHistory);
  
  const val = parseFloat(inputVal) || 0;
  
  const results = sqftMode ? {
    sqft: val,
    legalMarla: val / SQFT_PER_MARLA_LEGAL,
    legalKanal: val / SQFT_PER_KANAL_LEGAL,
    ldaMarla: val / SQFT_PER_MARLA_LDA,
    ldaKanal: val / SQFT_PER_KANAL_LDA,
    tradMarla: val / SQFT_PER_MARLA_TRAD,
    tradKanal: val / SQFT_PER_KANAL_TRAD,
    ruralMarla: val / SQFT_PER_MARLA_RURAL,
    ruralKanal: val / SQFT_PER_KANAL_RURAL,
    karam: val / SQFT_PER_SQ_KARAM,
  } : {
    sqft: val * SQFT_PER_MARLA_LEGAL,
    legalMarla: val,
    legalKanal: val / 20.0,
    ldaMarla: (val * SQFT_PER_MARLA_LEGAL) / SQFT_PER_MARLA_LDA,
    ldaKanal: ((val * SQFT_PER_MARLA_LEGAL) / SQFT_PER_MARLA_LDA) / 20.0,
    tradMarla: (val * SQFT_PER_MARLA_LEGAL) / SQFT_PER_MARLA_TRAD,
    tradKanal: ((val * SQFT_PER_MARLA_LEGAL) / SQFT_PER_MARLA_TRAD) / 20.0,
    ruralMarla: (val * SQFT_PER_MARLA_LEGAL) / SQFT_PER_MARLA_RURAL,
    ruralKanal: ((val * SQFT_PER_MARLA_LEGAL) / SQFT_PER_MARLA_RURAL) / 20.0,
    karam: (val * SQFT_PER_MARLA_LEGAL) / SQFT_PER_SQ_KARAM,
  };

  const addToHistory = () => {
    if (val > 0) {
      const updated = [...history, results];
      setHistory(updated);
      onHistoryUpdate?.(updated);
    }
  };

  return (
    <div className="flex flex-col items-center pb-20">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-green-100 w-full max-w-lg mb-6">
        <label className="text-gray-700 font-semibold mb-2 block">
          {sqftMode ? 'Enter Square Feet:' : 'Enter Legal Marla:'}
        </label>
        <div className="flex bg-gray-50 rounded-xl overflow-hidden border border-gray-200">
          <input 
            type="number" 
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            className="w-full bg-transparent p-4 outline-none text-xl font-bold"
            placeholder="0.00"
          />
          <button 
            onClick={() => setSqftMode(!sqftMode)}
            className="bg-[#2E7D32] text-white px-4 font-bold flex items-center justify-center hover:bg-green-800 transition"
          >
            <ArrowDown size={18} className="mr-1" /> Switch
          </button>
        </div>
      </div>

      <div className="w-full max-w-lg space-y-3 mb-6">
        {/* Punjab Legal */}
        <div className="bg-[#E3F2FD] border border-[#1976D2] rounded-xl p-4 flex justify-between items-center shadow-sm">
          <span className="font-bold text-[#1976D2]">Marla (Punjab Legal 225)</span>
          <span className="text-xl font-black">{results.legalMarla.toFixed(2)}</span>
        </div>
        <div className="bg-[#E3F2FD] border border-[#1976D2] rounded-xl p-4 flex justify-between items-center shadow-sm">
          <span className="font-bold text-[#1976D2]">Kanal (Punjab Legal)</span>
          <span className="text-xl font-black">{results.legalKanal.toFixed(2)}</span>
        </div>

        {/* Lahore LDA */}
        <div className="bg-[#E0F2F1] border border-[#00897B] rounded-xl p-4 flex justify-between items-center shadow-sm">
          <span className="font-bold text-[#00897B]">Marla (Lahore LDA 250)</span>
          <span className="text-xl font-black">{results.ldaMarla.toFixed(2)}</span>
        </div>
        <div className="bg-[#E0F2F1] border border-[#00897B] rounded-xl p-4 flex justify-between items-center shadow-sm">
          <span className="font-bold text-[#00897B]">Kanal (Lahore LDA)</span>
          <span className="text-xl font-black">{results.ldaKanal.toFixed(2)}</span>
        </div>

        {/* Traditional */}
        <div className="bg-[#FFF3E0] border border-[#E65100] rounded-xl p-4 flex justify-between items-center shadow-sm text-[#E65100]">
          <span className="font-bold">Marla (Traditional 272)</span>
          <span className="text-xl font-black">{results.tradMarla.toFixed(2)}</span>
        </div>
        
        {/* Rural / Revenue */}
        <div className="bg-[#F3E5F5] border border-[#7B1FA2] rounded-xl p-4 flex justify-between items-center shadow-sm text-[#7B1FA2]">
          <span className="font-bold">Marla (Rural/Revenue 272.25)</span>
          <span className="text-xl font-black">{results.ruralMarla.toFixed(2)}</span>
        </div>
        <div className="bg-[#F3E5F5] border border-[#7B1FA2] rounded-xl p-4 flex justify-between items-center shadow-sm text-[#7B1FA2]">
          <span className="font-bold">Kanal (Rural / Revenue)</span>
          <span className="text-xl font-black">{results.ruralKanal.toFixed(2)}</span>
        </div>
      </div>
      
      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3 w-full max-w-lg">
        <button 
          onClick={addToHistory}
          className="flex-1 bg-green-50 text-green-700 border border-green-200 py-3 rounded-xl font-bold flex justify-center items-center gap-2 hover:bg-green-100 transition"
        >
          <Plus size={18} /> Add to History
        </button>
        <button 
          onClick={() => generateConverterPDF(results)}
          className="flex-1 bg-red-600 text-white py-3 rounded-xl font-bold flex justify-center items-center gap-2 hover:bg-red-700 transition shadow-sm"
        >
          <FileText size={18} /> Export PDF
        </button>
        <button 
          onClick={() => exportToExcel(history.length > 0 ? history : [results])}
          className="flex-1 bg-[#1976D2] text-white py-3 rounded-xl font-bold flex justify-center items-center gap-2 hover:bg-blue-800 transition shadow-sm"
        >
          <Download size={18} /> Export Excel
        </button>
      </div>

      {history.length > 0 && (
        <div className="w-full max-w-lg mt-6">
          <h3 className="font-bold text-gray-700 mb-2">History List ({history.length})</h3>
          <div className="space-y-2">
            {history.map((h, i) => (
              <div key={i} className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm flex justify-between items-center text-sm">
                <span className="text-gray-500 font-bold">#{i + 1}</span>
                <span className="text-gray-800">{h.sqft} sqft</span>
                <span className="text-[#1976D2] font-semibold">{h.legalMarla.toFixed(2)} Marla</span>
                <span className="text-[#00897B] font-semibold">{h.ldaMarla.toFixed(2)} LDA</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-8 text-center text-xs text-red-600 bg-red-50 p-4 rounded-lg max-w-lg">
        {t.legalAlert}
      </div>
    </div>
  );
}
