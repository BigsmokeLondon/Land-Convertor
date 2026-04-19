export function AboutTab() {
  const version = '1.6.2';
  return (
    <div className="max-w-3xl mx-auto space-y-5 text-gray-800 pb-12">

      {/* Hero Banner */}
      <div className="bg-gradient-to-br from-[#1B5E20] to-[#2E7D32] text-white p-6 rounded-2xl shadow-lg">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-black tracking-tight leading-tight mb-1">ARENA SITEPRO</h2>
            <p className="text-green-200 text-xs font-semibold">Professional Field Surveying & Mapping Suite</p>
            <p className="text-green-300 text-[10px] mt-1">Global GIS Ready · Multi-Standard Support</p>
          </div>
          <div className="text-right flex-shrink-0">
            <span className="bg-white/20 text-white text-[10px] font-black px-2 py-1 rounded-full">v{version}</span>
          </div>
        </div>
      </div>

      {/* Purpose */}
      <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-200">
        <h3 className="text-base font-bold text-[#1976D2] mb-2">🔷 Purpose</h3>
        <p className="text-sm leading-relaxed text-gray-600">
          This application provides instant, professionally accurate land unit conversions for field surveyors, real estate developers, and civil engineers.
          It handles complex geometric calculations and multi-regional standards with high-precision GIS tools.
        </p>
      </div>

      {/* Legal Standards */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="bg-gray-50 px-5 py-3 border-b border-gray-200">
          <h3 className="font-bold text-gray-800">⚖️ Regional Measurement Standards</h3>
        </div>
        <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="bg-[#E3F2FD] p-3 rounded-xl border border-blue-200">
            <h4 className="font-black text-[#1565C0] text-sm">Punjab Legal</h4>
            <p className="text-xl font-black text-[#1976D2] mt-1">225 <span className="text-sm font-bold">sq ft</span></p>
            <p className="text-[10px] text-blue-700 mt-1">Official standard for Fard, Mutations (Intiqal), and urban land registration across Punjab.</p>
          </div>
          <div className="bg-[#E0F2F1] p-3 rounded-xl border border-teal-200">
            <h4 className="font-black text-[#00695C] text-sm">Lahore LDA</h4>
            <p className="text-xl font-black text-teal-700 mt-1">250 <span className="text-sm font-bold">sq ft</span></p>
            <p className="text-[10px] text-teal-700 mt-1">Used by Lahore Development Authority (LDA) in approved housing schemes and planned developments.</p>
          </div>
          <div className="bg-[#FFF9C4] p-3 rounded-xl border border-yellow-300">
            <h4 className="font-black text-[#E65100] text-sm">Traditional</h4>
            <p className="text-xl font-black text-orange-600 mt-1">272 <span className="text-sm font-bold">sq ft</span></p>
            <p className="text-[10px] text-yellow-800 mt-1">Rural / KPK builders' reference. NOT legally valid in Punjab urban records. Always check which standard applies.</p>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="bg-gray-50 px-5 py-3 border-b border-gray-200">
          <h3 className="font-bold text-gray-800">🛠️ Features & Modules</h3>
        </div>
        <div className="divide-y divide-gray-100">

          {/* Converter */}
          <div className="px-5 py-4 flex gap-3">
            <span className="text-2xl flex-shrink-0">🔄</span>
            <div>
              <h4 className="font-bold text-sm text-gray-800">Unit Converter</h4>
              <p className="text-xs text-gray-500 mt-0.5">Instantly converts between Sq Ft, Marla, Kanal, and Sq Karam across all three regional standards simultaneously. Supports Sq Ft → Marla and reverse. Export results to <strong>PDF</strong> or <strong>Excel</strong>.</p>
            </div>
          </div>

          {/* Reverse Lookup */}
          <div className="px-5 py-4 flex gap-3">
            <span className="text-2xl flex-shrink-0">↔️</span>
            <div>
              <h4 className="font-bold text-sm text-gray-800">Reverse Lookup</h4>
              <p className="text-xs text-gray-500 mt-0.5">Enter a value in <em>any</em> unit and instantly see all other unit equivalents colour-coded by standard — blue (Punjab Legal), teal (LDA), amber (Traditional).</p>
            </div>
          </div>

          {/* Area Calculator */}
          <div className="px-5 py-4 flex gap-3">
            <span className="text-2xl flex-shrink-0">📐</span>
            <div>
              <h4 className="font-bold text-sm text-gray-800">Area Calculator (Irregular Plots)</h4>
              <p className="text-xs text-gray-500 mt-0.5">Supports rectangles, right triangles, 4-sided and 5-sided irregular plots via Heron's Triangulation. Also includes a Shoelace (X/Y Coordinates) mode for data sourced from Patwari maps or AutoCAD drawings.</p>
            </div>
          </div>

          {/* Visualization */}
          <div className="px-5 py-4 flex gap-3">
            <span className="text-2xl flex-shrink-0">📊</span>
            <div>
              <h4 className="font-bold text-sm text-gray-800">Visualisation</h4>
              <p className="text-xs text-gray-500 mt-0.5">Bar chart comparing the same plot area expressed in Marla under all three regional standards side-by-side — instantly shows how much the standard chosen affects your recorded size.</p>
            </div>
          </div>

          {/* Map Survey */}
          <div className="px-5 py-4 flex gap-3">
            <span className="text-2xl flex-shrink-0">🗺️</span>
            <div>
              <h4 className="font-bold text-sm text-gray-800">Map Survey (Field Tool)</h4>
              <p className="text-xs text-gray-500 mt-0.5 space-y-1">
                A professional field survey tool built on satellite imagery. Key features:
              </p>
              <ul className="text-xs text-gray-500 mt-1 space-y-0.5 list-disc list-inside">
                <li><strong>Ultimate Pro Mapping Toolbox</strong> — one-tap access to advanced GIS drawing and cutting tools</li>
                <li><strong>Continuous Draw Mode (Plus icon)</strong> — high-speed boundary sketching without manual panning</li>
                <li><strong>Manual Tape Measurements</strong> — click boundary edges to enter physical on-site verification readings</li>
                <li><strong>Offline Map Pre-caching (Cloud icon)</strong> — download a 2km region for field use in zero-signal areas</li>
                <li><strong>GPS Coordinate Search</strong> — paste lat/lng coordinates directly into the search bar</li>
                <li><strong>Mobile-Optimized Layout</strong> — snap-navigation and compact GPS coordinate display for field use</li>
                <li><strong>Precision Crosshair Pinning</strong> — pan map under yellow crosshair, tap Add Pin for GPS-independent accuracy</li>
                <li><strong>GPS Walk-and-Track</strong> — record your walk with continuous tracking, 5ft anti-jitter filtering and Auto-Follow mode</li>
                <li><strong>📐 Area Mode</strong> — draws a filled polygon and calculates total area in Sq Ft + Marla</li>
                <li><strong>📏 Path Mode</strong> — measures cumulative boundary length in feet and metres as you walk</li>
                <li><strong>🛰 SAT / 🗺 MAP Toggle</strong> — switch between ESRI satellite imagery and OpenStreetMap</li>
                <li><strong>📍 Auto-Follow</strong> — keep the map centered on your position during surveys</li>
                <li><strong>City Search</strong> — fly to any city or global region by name</li>
                <li><strong>Digital Compass with N marker</strong> — align with Patwari north/south orientation</li>
                <li><strong>Screenshot, KML and PDF exports</strong> — field-ready documentation</li>
              </ul>
            </div>
          </div>

          {/* Notes */}
          <div className="px-5 py-4 flex gap-3">
            <span className="text-2xl flex-shrink-0">📝</span>
            <div>
              <h4 className="font-bold text-sm text-gray-800">Field Notes</h4>
              <p className="text-xs text-gray-500 mt-0.5">Private, per-device notes tab — create, edit and save as many notes as needed. Stores khasra numbers, owner names, next steps or measurements between sessions. <strong>Data is held locally on your device only</strong> and is never transmitted to any server.</p>
            </div>
          </div>

        </div>
      </div>

      {/* Exports */}
      <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-200">
        <h3 className="text-base font-bold text-teal-700 mb-3">💾 Professional Exports</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-center">
            <div className="text-2xl mb-1">📄</div>
            <div className="font-bold text-sm text-red-700">Map PDF Report</div>
            <div className="text-[10px] text-red-600 mt-1">A4 report with coordinates table, area stats, legal warning & M.A. Industries branding</div>
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 text-center">
            <div className="text-2xl mb-1">📊</div>
            <div className="font-bold text-sm text-blue-700">Excel Export</div>
            <div className="text-[10px] text-blue-600 mt-1">Converter history exported as a formatted .xlsx spreadsheet for records</div>
          </div>
          <div className="bg-green-50 border border-green-200 rounded-xl p-3 text-center">
            <div className="text-2xl mb-1">🌐</div>
            <div className="font-bold text-sm text-green-700">KML File</div>
            <div className="text-[10px] text-green-600 mt-1">Import into Google Earth Pro or AutoCAD to overlay your survey on professional models</div>
          </div>
        </div>
      </div>

      {/* Liability Notice */}
      <div className="bg-red-50 p-5 rounded-2xl shadow-sm border border-red-200">
        <h3 className="text-base font-bold text-red-700 mb-2">⚠️ Liability Notice</h3>
        <p className="text-sm leading-relaxed text-red-900">
          This report is generated using GIS satellite positioning and manual tape measurements. 
          While these values provide a highly accurate estimation for on-site verification, this document does not constitute a legal land title or an official government survey. 
          Arena SitePro and its developers take no responsibility for legal inaccuracies or financial decisions made based on this report.
          Always verify plot boundaries physically with a licensed government surveyor before executing any mutation or sale deed.
        </p>
      </div>

      {/* Version History */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="bg-gray-50 px-5 py-3 border-b border-gray-200">
          <h3 className="font-bold text-gray-800">📋 Version History</h3>
        </div>
        <div className="divide-y divide-gray-100 text-xs">
          {[
            { v: '1.6.2', label: 'Offline Map Pre-caching, GPS Coordinate Paste, Expanded Legal Disclosure' },
            { v: '1.6.1', label: 'Manual Tape Measurements, Verified Area Adjusted Reports, PDF Summary Box scaling' },
            { v: '1.6.0', label: 'Pro Mapping Toolbox, Continuous Draw Mode, Mobile Nav Snapping, Hybrid GIS Engine' },
            { v: '1.5', label: 'GPS Walk-and-Track (Continuous), Auto-Follow Map Mode, 5ft Jitter Filtering' },
            { v: '1.4', label: 'Path Mode, SAT/MAP Toggle, Compass N, Perimeter Ft readout' },
            { v: '1.3', label: 'Notes Tab, Lahore LDA standard, Converter PDF & Excel, VizTab LDA bar, Map search bar' },
            { v: '1.2', label: 'Floating mobile map controls, yellow crosshair, GPS toggle, City/Region search, Screenshot export' },
            { v: '1.1', label: 'Map Survey Tab, KML export, Area Calculator polygon modes, digital compass' },
            { v: '1.0', label: 'Core converter, Reverse Lookup, Visualization chart, Urdu/English toggle, Excel export' },
          ].map(r => (
            <div key={r.v} className="px-5 py-3 flex gap-3 items-start">
              <span className="bg-[#2E7D32] text-white text-[9px] font-black px-1.5 py-0.5 rounded-full flex-shrink-0 mt-0.5">v{r.v}</span>
              <span className="text-gray-600">{r.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Diagnostics */}
      <div className="bg-gray-100 p-5 rounded-2xl shadow-sm border border-gray-200">
        <h3 className="text-base font-bold text-gray-700 mb-2">🔧 Diagnostics</h3>
        <p className="text-xs text-gray-500 mb-4">If the app is behaving unexpectedly or not remembering your settings, try resetting the local storage.</p>
        <button 
          onClick={() => { if(confirm('Reset all saved settings, notes and history?')) { localStorage.clear(); window.location.reload(); } }}
          className="bg-white text-red-600 border border-red-200 px-4 py-2 rounded-xl text-xs font-bold hover:bg-red-50 transition active:scale-95 shadow-sm"
        >
          Reset Application Data (Local)
        </button>
      </div>

      {/* Footer */}
      <div className="bg-[#1B5E20] text-white p-6 rounded-2xl text-center shadow-lg">
        <p className="text-green-300 text-[10px] uppercase tracking-widest font-bold mb-2">Software developed and brought to you by</p>
        <p className="text-xl font-black tracking-widest">M.A. INDUSTRIES INC.</p>
        <p className="text-green-300 text-xs mt-1">© {new Date().getFullYear()} · All Rights Reserved</p>
        <div className="mt-4 pt-4 border-t border-white/20">
          <p className="text-[10px] text-green-400">Built as a Progressive Web App (PWA) · Works offline · No data collected</p>
        </div>
      </div>

    </div>
  );
}
