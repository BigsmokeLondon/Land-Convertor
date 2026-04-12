import { useState } from 'react';
import { calculateHerons, calculateShoelace, SQFT_PER_MARLA_LEGAL, SQFT_PER_MARLA_TRAD } from '../utils/calculations';

export function AreaCalculatorTab({ t }: { t: any }) {
  const [shape, setShape] = useState('rect');
  const [inputs, setInputs] = useState<Record<string, number>>({});
  
  const updateInput = (key: string, val: string) => {
    setInputs(prev => ({ ...prev, [key]: parseFloat(val) || 0 }));
  };

  let sqftArea = 0;
  
  if (shape === 'rect') {
    sqftArea = (inputs['w'] || 0) * (inputs['l'] || 0);
  } else if (shape === 'sq') {
    sqftArea = Math.pow(inputs['s'] || 0, 2);
  } else if (shape === 'circle') {
    sqftArea = Math.PI * Math.pow(inputs['r'] || 0, 2);
  } else if (shape === 'parallelogram' || shape === 'rect-tri') {
    sqftArea = (inputs['b'] || 0) * (inputs['h'] || 0);
    if (shape === 'rect-tri') sqftArea /= 2;
  } else if (shape === 'trapezoid') {
    sqftArea = ((inputs['b1'] || 0) + (inputs['b2'] || 0)) / 2 * (inputs['h'] || 0);
  } else if (shape === 'tri') {
    sqftArea = calculateHerons(inputs['s1'] || 0, inputs['s2'] || 0, inputs['s3'] || 0);
  } else if (shape === 'equi-tri') {
    sqftArea = (Math.sqrt(3) / 4) * Math.pow(inputs['s'] || 0, 2);
  } else if (shape === 'coords') {
    const pts = [];
    for (let i = 0; i < 6; i++) {
      if (inputs[`x${i}`] !== undefined && inputs[`y${i}`] !== undefined) {
        pts.push({ x: inputs[`x${i}`], y: inputs[`y${i}`] });
      }
    }
    sqftArea = calculateShoelace(pts);
  } else if (shape === 'irr4' || shape === 'irr5' || shape === 'irr6') {
    // Basic dynamic Triangulation method approximation summing multiple Herons
    // Tri 1
    const a1 = calculateHerons(inputs['s1'] || 0, inputs['s2'] || 0, inputs['dia1'] || 0);
    // Tri 2
    const a2 = calculateHerons(inputs['s3'] || 0, inputs['s4'] || 0, inputs['dia1'] || 0);
    sqftArea = a1 + a2;
    // Tri 3
    if (shape === 'irr5' || shape === 'irr6') {
      const a3 = calculateHerons(inputs['s5'] || 0, inputs['dia2'] || 0, inputs['dia1'] || 0);
      sqftArea += a3;
    }
    // Tri 4
    if (shape === 'irr6') {
      const a4 = calculateHerons(inputs['s6'] || 0, inputs['dia2'] || 0, inputs['dia3'] || 0);
      sqftArea += a4;
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-20">
      <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-200">
        <label className="block text-gray-700 font-bold mb-3">{t.chooseShape}</label>
        <select 
          className="w-full bg-gray-50 border border-gray-300 text-gray-900 rounded-lg p-3 font-semibold outline-none focus:ring-2 focus:ring-green-500"
          value={shape}
          onChange={e => { setShape(e.target.value); setInputs({}); }}
        >
          <option value="rect">Rectangle (Length × Width)</option>
          <option value="sq">Square (Side × Side)</option>
          <option value="circle">Circle (Radius)</option>
          <option value="tri">Triangle (Heron's Formula)</option>
          <option value="rect-tri">Right-Angled Triangle</option>
          <option value="equi-tri">Equilateral Triangle</option>
          <option value="parallelogram">Parallelogram</option>
          <option value="trapezoid">Trapezoid</option>
          <option value="irr4">Irregular 4-Sided (Triangulation)</option>
          <option value="irr5">Irregular 5-Sided (Triangulation)</option>
          <option value="irr6">Irregular 6-Sided (Triangulation)</option>
          <option value="coords">Irregular Polygon (Coordinates X, Y)</option>
        </select>
      </div>

      <div className="bg-gray-50 p-6 rounded-2xl border border-dashed border-gray-300 min-h-[140px] flex items-center justify-center">
        <div className="w-full">
        {shape === 'rect' && (
          <div className="flex gap-4">
            <div className="flex-1"><label className="text-xs font-bold text-gray-500">Length (ft)</label><input type="number" onChange={e => updateInput('l', e.target.value)} className="mt-1 w-full p-3 rounded-lg" /></div>
            <div className="flex-1"><label className="text-xs font-bold text-gray-500">Width (ft)</label><input type="number" onChange={e => updateInput('w', e.target.value)} className="mt-1 w-full p-3 rounded-lg" /></div>
          </div>
        )}
        {(shape === 'sq' || shape === 'equi-tri') && (
          <div className="w-1/2 mx-auto"><label className="text-xs font-bold text-gray-500">Side (ft)</label><input type="number" onChange={e => updateInput('s', e.target.value)} className="mt-1 w-full p-3 rounded-lg" /></div>
        )}
        {shape === 'circle' && (
          <div className="w-1/2 mx-auto"><label className="text-xs font-bold text-gray-500">Radius (ft)</label><input type="number" onChange={e => updateInput('r', e.target.value)} className="mt-1 w-full p-3 rounded-lg" /></div>
        )}
        {(shape === 'parallelogram' || shape === 'rect-tri') && (
          <div className="flex gap-4">
            <div className="flex-1"><label className="text-xs font-bold text-gray-500">Base (ft)</label><input type="number" onChange={e => updateInput('b', e.target.value)} className="mt-1 w-full p-3 rounded-lg" /></div>
            <div className="flex-1"><label className="text-xs font-bold text-gray-500">Height (ft)</label><input type="number" onChange={e => updateInput('h', e.target.value)} className="mt-1 w-full p-3 rounded-lg" /></div>
          </div>
        )}
        {shape === 'trapezoid' && (
          <div className="flex gap-2">
            <div className="flex-1"><label className="text-xs font-bold text-gray-500">Base 1 (ft)</label><input type="number" onChange={e => updateInput('b1', e.target.value)} className="mt-1 w-full p-3 rounded-lg" /></div>
            <div className="flex-1"><label className="text-xs font-bold text-gray-500">Base 2 (ft)</label><input type="number" onChange={e => updateInput('b2', e.target.value)} className="mt-1 w-full p-3 rounded-lg" /></div>
            <div className="flex-1"><label className="text-xs font-bold text-gray-500">Height (ft)</label><input type="number" onChange={e => updateInput('h', e.target.value)} className="mt-1 w-full p-3 rounded-lg" /></div>
          </div>
        )}
        {shape === 'tri' && (
          <div className="flex gap-2">
            {[1, 2, 3].map(i => (
              <div key={i} className="flex-1"><label className="text-[10px] font-bold text-gray-500">Side {i} (ft)</label><input type="number" onChange={e => updateInput(`s${i}`, e.target.value)} className="mt-1 w-full p-2 rounded-lg" /></div>
            ))}
          </div>
        )}
        {(shape === 'irr4' || shape === 'irr5' || shape === 'irr6') && (
          <div className="grid grid-cols-3 gap-2">
            {[1, 2, 3, 4].concat(shape === 'irr5' || shape === 'irr6' ? [5] : []).concat(shape === 'irr6' ? [6] : []).map(i => (
               <div key={`s${i}`}><label className="text-[10px] font-bold text-gray-500">Side {i} (ft)</label><input type="number" onChange={e => updateInput(`s${i}`, e.target.value)} className="mt-1 w-full p-2 rounded border border-gray-200" /></div>
            ))}
            {[1].concat((shape === 'irr5' || shape === 'irr6') ? [2] : []).concat(shape === 'irr6' ? [3] : []).map(i => (
               <div key={`dia${i}`}><label className="text-[10px] font-bold text-blue-500">Diagonal {i} (ft)</label><input type="number" onChange={e => updateInput(`dia${i}`, e.target.value)} className="mt-1 w-full p-2 rounded border border-blue-200 bg-blue-50" /></div>
            ))}
          </div>
        )}
        {shape === 'coords' && (
          <div className="grid grid-cols-2 gap-4">
            {[0,1,2,3,4,5].map(i => (
              <div key={i} className="flex gap-2 bg-white p-2 rounded-lg shell">
                <input type="number" placeholder={`X${i+1}`} onChange={e => updateInput(`x${i}`, e.target.value)} className="w-1/2 p-2 bg-gray-50 border border-gray-200 rounded" />
                <input type="number" placeholder={`Y${i+1}`} onChange={e => updateInput(`y${i}`, e.target.value)} className="w-1/2 p-2 bg-gray-50 border border-gray-200 rounded" />
              </div>
            ))}
            <p className="col-span-2 text-xs text-gray-500 text-center mt-2">Enter coordinates in clockwise order. Leave 5/6 blank if not needed.</p>
          </div>
        )}
        </div>
      </div>

      <div className="bg-[#2E7D32] p-6 rounded-2xl text-white shadow-md text-center">
        <p className="text-green-100 font-medium mb-1">Calculated Area</p>
        <h2 className="text-4xl font-black mb-4">{sqftArea.toFixed(2)} <span className="text-xl font-normal">Sq Ft</span></h2>
        
        <div className="grid grid-cols-2 gap-4 mt-6">
          <div className="bg-white/10 p-3 rounded-xl border border-white/20">
            <p className="text-xs text-green-200">Legal Marla</p>
            <p className="text-lg font-bold">{(sqftArea / SQFT_PER_MARLA_LEGAL).toFixed(4)}</p>
          </div>
          <div className="bg-white/10 p-3 rounded-xl border border-white/20">
            <p className="text-xs text-green-200">Trad Marla</p>
            <p className="text-lg font-bold">{(sqftArea / SQFT_PER_MARLA_TRAD).toFixed(4)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
