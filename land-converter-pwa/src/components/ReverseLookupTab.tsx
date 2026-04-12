import { useState } from 'react';
import { 
  SQFT_PER_MARLA_LEGAL, SQFT_PER_KANAL_LEGAL, 
  SQFT_PER_MARLA_TRAD, SQFT_PER_KANAL_KPK, SQFT_PER_SQ_KARAM 
} from '../utils/calculations';

const units = [
  { id: 'sqft', label: 'Square Feet', factor: 1 },
  { id: 'legal_marla', label: 'Marla (Punjab Legal)', factor: SQFT_PER_MARLA_LEGAL },
  { id: 'legal_kanal', label: 'Kanal (Punjab Legal)', factor: SQFT_PER_KANAL_LEGAL },
  { id: 'trad_marla', label: 'Marla (Trad Ref)', factor: SQFT_PER_MARLA_TRAD },
  { id: 'kpk_kanal', label: 'Kanal (KPK Ref)', factor: SQFT_PER_KANAL_KPK },
  { id: 'karam', label: 'Sq. Karam', factor: SQFT_PER_SQ_KARAM }
];

export function ReverseLookupTab() {
  const [unit, setUnit] = useState('sqft');
  const [valStr, setValStr] = useState('');

  const val = parseFloat(valStr) || 0;
  const selectedUnit = units.find(u => u.id === unit) || units[0];
  
  // Calculate base sqft first
  const baseSqft = val * selectedUnit.factor;

  return (
    <div className="flex flex-col items-center">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 w-full max-w-lg mb-6">
        <div className="mb-4">
          <label className="text-gray-700 font-bold mb-2 block">Select Known Unit:</label>
          <select 
            className="w-full bg-gray-50 border border-gray-300 text-gray-900 rounded-lg p-3 font-semibold outline-none"
            value={unit}
            onChange={e => setUnit(e.target.value)}
          >
            {units.map(u => <option key={u.id} value={u.id}>{u.label}</option>)}
          </select>
        </div>
        <div>
          <label className="text-gray-700 font-bold mb-2 block">Enter Value:</label>
          <input 
            type="number" 
            value={valStr}
            onChange={(e) => setValStr(e.target.value)}
            className="w-full bg-gray-50 border border-gray-300 p-4 rounded-lg outline-none text-xl font-bold"
            placeholder="0.00"
          />
        </div>
      </div>

      <div className="w-full max-w-lg space-y-3">
        {units.map(u => {
          if (u.id === unit) return null; // skip the one currently selected
          const converted = baseSqft / u.factor;
          return (
            <div key={u.id} className="bg-white border border-gray-200 rounded-xl p-4 flex justify-between items-center shadow-sm">
              <span className="font-bold text-gray-600">{u.label}</span>
              <span className="text-xl font-black text-gray-800">{converted.toFixed(4)}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
