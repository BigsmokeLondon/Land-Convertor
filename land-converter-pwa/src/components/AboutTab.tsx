export function AboutTab({ t }: { t: any }) {
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
        <h3 className="text-base font-bold text-[#1976D2] mb-2">🔷 {t.aboutPurposeTitle || "Purpose"}</h3>
        <p className="text-sm leading-relaxed text-gray-600">
          {t.aboutPurposeDesc || "This application provides instant, professionally accurate land unit conversions for field surveyors, real estate developers, and civil engineers. It handles complex geometric calculations and multi-regional standards with high-precision GIS tools."}
        </p>
      </div>

      {/* Legal Standards */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="bg-gray-50 px-5 py-3 border-b border-gray-200">
          <h3 className="font-bold text-gray-800">⚖️ {t.aboutStandardsTitle || "Regional Measurement Standards"}</h3>
        </div>

        {/* Pakistan / Punjab */}
        <div className="px-4 pt-4 pb-2">
          <h4 className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-2">Pakistan / Punjab</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <div className="bg-[#E3F2FD] p-3 rounded-xl border border-blue-200">
              <h4 className="font-black text-[#1565C0] text-sm">{t.aboutPunjabLegal || "Punjab Legal"}</h4>
              <p className="text-xl font-black text-[#1976D2] mt-1">225 <span className="text-sm font-bold">sq ft / Marla</span></p>
              <p className="text-[10px] text-blue-700 mt-1">{t.aboutPunjabLegalDesc || "Official standard for Fard, Mutations (Intiqal), and urban land registration across Punjab."}</p>
            </div>
            <div className="bg-[#E0F2F1] p-3 rounded-xl border border-teal-200">
              <h4 className="font-black text-[#00695C] text-sm">{t.aboutLahoreLDA || "Lahore LDA"}</h4>
              <p className="text-xl font-black text-teal-700 mt-1">250 <span className="text-sm font-bold">sq ft / Marla</span></p>
              <p className="text-[10px] text-teal-700 mt-1">{t.aboutLahoreLDADesc || "Used by Lahore Development Authority (LDA) in approved housing schemes and planned developments."}</p>
            </div>
            <div className="bg-[#FFF9C4] p-3 rounded-xl border border-yellow-300">
              <h4 className="font-black text-[#E65100] text-sm">{t.aboutTraditional || "Traditional"}</h4>
              <p className="text-xl font-black text-orange-600 mt-1">272 <span className="text-sm font-bold">sq ft / Marla</span></p>
              <p className="text-[10px] text-yellow-800 mt-1">{t.aboutTraditionalDesc || "Rural / KPK builders' reference. NOT legally valid in Punjab urban records."}</p>
            </div>
            <div className="bg-[#F3E5F5] p-3 rounded-xl border border-purple-200">
              <h4 className="font-black text-[#7B1FA2] text-sm">Rural / Revenue</h4>
              <p className="text-xl font-black text-purple-700 mt-1">272.25 <span className="text-sm font-bold">sq ft / Marla</span></p>
              <p className="text-[10px] text-purple-700 mt-1">Revenue department standard used in rural Punjab land records (1 Kanal = 20 Marla = 5,445 sq ft).</p>
            </div>
          </div>
        </div>

        {/* India */}
        <div className="px-4 pt-3 pb-2">
          <h4 className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-2">India</h4>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {[
              { name: 'Kanal (J&K)', val: '5,445', unit: 'Kanal', note: 'J&K / Himachal Pradesh' },
              { name: 'Bigha (UP/Bihar)', val: '27,000', unit: 'Bigha', note: '1 Bigha = 20 Biswa' },
              { name: 'Katha (W. Bengal)', val: '720', unit: 'Katha', note: 'West Bengal standard' },
              { name: 'Katha (Bihar)', val: '1,361', unit: 'Katha', note: 'Bihar standard' },
              { name: 'Katha (Assam)', val: '2,880', unit: 'Katha', note: 'Assam standard' },
              { name: 'Dhur (Bihar)', val: '68', unit: 'Dhur', note: 'Bihar sub-unit' },
              { name: 'Guntha', val: '1,089', unit: 'Guntha', note: 'Maharashtra / Karnataka' },
              { name: 'Cent', val: '435.6', unit: 'Cent', note: 'Tamil Nadu / Kerala' },
            ].map(s => (
              <div key={s.name} className="bg-orange-50 p-2.5 rounded-lg border border-orange-200">
                <p className="font-black text-orange-800 text-xs">{s.name}</p>
                <p className="text-base font-black text-orange-600">{s.val} <span className="text-[10px] font-bold">sq ft</span></p>
                <p className="text-[9px] text-orange-600 mt-0.5">{s.note}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Nepal */}
        <div className="px-4 pt-3 pb-2">
          <h4 className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-2">Nepal</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {[
              { name: 'Ropani', val: '5,476', note: 'Hills (1 Ropani = 16 Aana)' },
              { name: 'Bigha (Terai)', val: '6,772', note: '1 Bigha = 20 Katha' },
              { name: 'Katha', val: '3,645', note: 'Nepal standard' },
              { name: 'Dhur', val: '182.25', note: 'Nepal sub-unit' },
            ].map(s => (
              <div key={s.name} className="bg-green-50 p-2.5 rounded-lg border border-green-200">
                <p className="font-black text-green-800 text-xs">{s.name}</p>
                <p className="text-base font-black text-green-600">{s.val} <span className="text-[10px] font-bold">sq ft</span></p>
                <p className="text-[9px] text-green-600 mt-0.5">{s.note}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Universal */}
        <div className="px-4 pt-3 pb-4">
          <h4 className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-2">Universal</h4>
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-gray-100 p-2.5 rounded-lg border border-gray-300">
              <p className="font-black text-gray-700 text-xs">Acre</p>
              <p className="text-base font-black text-gray-800">43,560 <span className="text-[10px] font-bold">sq ft</span></p>
            </div>
            <div className="bg-gray-100 p-2.5 rounded-lg border border-gray-300">
              <p className="font-black text-gray-700 text-xs">Hectare</p>
              <p className="text-base font-black text-gray-800">107,639 <span className="text-[10px] font-bold">sq ft</span></p>
            </div>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="bg-gray-50 px-5 py-3 border-b border-gray-200">
          <h3 className="font-bold text-gray-800">🛠️ {t.aboutFeaturesTitle || "Features & Modules"}</h3>
        </div>
        <div className="divide-y divide-gray-100">

          {/* Converter */}
          <div className="px-5 py-4 flex gap-3">
            <span className="text-2xl flex-shrink-0">🔄</span>
            <div>
              <h4 className="font-bold text-sm text-gray-800">{t.aboutUnitConverter || "Unit Converter"}</h4>
              <p className="text-xs text-gray-500 mt-0.5">{t.aboutUnitConverterDesc || "Instantly converts between Sq Ft, Marla, Kanal, and Sq Karam across all three regional standards simultaneously. Supports Sq Ft → Marla and reverse. Export results to PDF or Excel."}</p>
            </div>
          </div>

          {/* Reverse Lookup */}
          <div className="px-5 py-4 flex gap-3">
            <span className="text-2xl flex-shrink-0">↔️</span>
            <div>
              <h4 className="font-bold text-sm text-gray-800">{t.aboutReverseLookup || "Reverse Lookup"}</h4>
              <p className="text-xs text-gray-500 mt-0.5">{t.aboutReverseLookupDesc || "Enter a value in any unit and instantly see all other unit equivalents colour-coded by standard: blue (Punjab Legal), teal (LDA), amber (Traditional)."}</p>
            </div>
          </div>

          {/* Area Calculator */}
          <div className="px-5 py-4 flex gap-3">
            <span className="text-2xl flex-shrink-0">📐</span>
            <div>
              <h4 className="font-bold text-sm text-gray-800">{t.aboutAreaCalculator || "Area Calculator (Irregular Plots)"}</h4>
              <p className="text-xs text-gray-500 mt-0.5">{t.aboutAreaCalculatorDesc || "Supports rectangles, right triangles, 4-sided and 5-sided irregular plots via Heron's Triangulation. Also includes a Shoelace (X/Y Coordinates) mode for data sourced from Patwari maps or AutoCAD drawings."}</p>
            </div>
          </div>

          {/* Visualization */}
          <div className="px-5 py-4 flex gap-3">
            <span className="text-2xl flex-shrink-0">📊</span>
            <div>
              <h4 className="font-bold text-sm text-gray-800">{t.aboutVisualisation || "Visualisation"}</h4>
              <p className="text-xs text-gray-500 mt-0.5">{t.aboutVisualisationDesc || "Bar chart comparing the same plot area expressed in Marla under all three regional standards side-by-side — instantly shows how much the standard chosen affects your recorded size."}</p>
            </div>
          </div>

          {/* Map Survey */}
          <div className="px-5 py-4 flex gap-3">
            <span className="text-2xl flex-shrink-0">🗺️</span>
            <div>
              <h4 className="font-bold text-sm text-gray-800">{t.aboutMapSurvey || "Map Survey (Field Tool)"}</h4>
              <p className="text-xs text-gray-500 mt-0.5 space-y-1">
                {t.aboutMapSurveyDesc || "A professional field survey tool built on satellite imagery. Key features:"}
              </p>
              <ul className="text-xs text-gray-500 mt-1 space-y-0.5 list-disc list-inside">
                <li>{t.aboutFeature1 || "Ultimate Pro Mapping Toolbox — one-tap access to advanced GIS drawing and cutting tools"}</li>
                <li>{t.aboutFeature2 || "Continuous Draw Mode (Plus icon) — high-speed boundary sketching without manual panning"}</li>
                <li>{t.aboutFeature3 || "Manual Tape Measurements — click boundary edges to enter physical on-site verification readings"}</li>
                <li>{t.aboutFeature4 || "Offline Map Pre-caching (Cloud icon) — download a 2km region for field use in zero-signal areas"}</li>
                <li>{t.aboutFeature5 || "GPS Coordinate Search — paste lat/lng coordinates directly into the search bar"}</li>
                <li>{t.aboutFeature6 || "Mobile-Optimized Layout — snap-navigation and compact GPS coordinate display for field use"}</li>
                <li>{t.aboutFeature7 || "Precision Crosshair Pinning — pan map under yellow crosshair, tap Add Pin for GPS-independent accuracy"}</li>
                <li>{t.aboutFeature8 || "GPS Walk-and-Track — record your walk with continuous tracking, 5ft anti-jitter filtering and Auto-Follow mode"}</li>
                <li>{t.aboutFeature9 || "Area Mode — draws a filled polygon and calculates total area in Sq Ft + Marla"}</li>
                <li>{t.aboutFeature10 || "Path Mode — measures cumulative boundary length in feet and metres as you walk"}</li>
                <li>{t.aboutFeature11 || "SAT / MAP Toggle — switch between ESRI satellite imagery and OpenStreetMap"}</li>
                <li>{t.aboutFeature12 || "Auto-Follow — keep the map centered on your position during surveys"}</li>
                <li>{t.aboutFeature13 || "City Search — fly to any city or global region by name"}</li>
                <li>{t.aboutFeature14 || "Digital Compass with N marker — align with Patwari north/south orientation"}</li>
                <li>{t.aboutFeature15 || "Screenshot, KML and PDF exports — field-ready documentation"}</li>
              </ul>
            </div>
          </div>

          {/* Notes */}
          <div className="px-5 py-4 flex gap-3">
            <span className="text-2xl flex-shrink-0">📝</span>
            <div>
              <h4 className="font-bold text-sm text-gray-800">{t.aboutFieldNotes || "Field Notes"}</h4>
              <p className="text-xs text-gray-500 mt-0.5">{t.aboutFieldNotesDesc || "Private, per-device notes tab — create, edit and save as many notes as needed. Stores khasra numbers, owner names, next steps or measurements between sessions. Data is held locally on your device only and is never transmitted to any server."}</p>
            </div>
          </div>

        </div>
      </div>

      {/* Exports */}
      <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-200">
        <h3 className="text-base font-bold text-teal-700 mb-3">💾 {t.aboutExportsTitle || "Professional Exports"}</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-center">
            <div className="text-2xl mb-1">📄</div>
            <div className="font-bold text-sm text-red-700">{t.aboutMapPdf || "Map PDF Report"}</div>
            <div className="text-[10px] text-red-600 mt-1">{t.aboutMapPdfDesc || "A4 report with coordinates table, area stats, legal warning & M.A. Industries branding"}</div>
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 text-center">
            <div className="text-2xl mb-1">📊</div>
            <div className="font-bold text-sm text-blue-700">{t.aboutExcelExport || "Excel Export"}</div>
            <div className="text-[10px] text-blue-600 mt-1">{t.aboutExcelExportDesc || "Converter history exported as a formatted .xlsx spreadsheet for records"}</div>
          </div>
          <div className="bg-green-50 border border-green-200 rounded-xl p-3 text-center">
            <div className="text-2xl mb-1">🌐</div>
            <div className="font-bold text-sm text-green-700">{t.aboutKmlFile || "KML File"}</div>
            <div className="text-[10px] text-green-600 mt-1">{t.aboutKmlFileDesc || "Import into Google Earth Pro or AutoCAD to overlay your survey on professional models"}</div>
          </div>
        </div>
      </div>

      {/* Liability Notice */}
      <div className="bg-red-50 p-5 rounded-2xl shadow-sm border border-red-200">
        <h3 className="text-base font-bold text-red-700 mb-2">⚠️ {t.aboutLiabilityTitle || "Liability Notice"}</h3>
        <p className="text-sm leading-relaxed text-red-900">
          {t.aboutLiabilityDesc || "This report is generated using GIS satellite positioning and manual tape measurements. While these values provide a highly accurate estimation for on-site verification, this document does not constitute a legal land title or an official government survey. Arena SitePro and its developers take no responsibility for legal inaccuracies or financial decisions made based on this report. Always verify plot boundaries physically with a licensed government surveyor before executing any mutation or sale deed."}
        </p>
      </div>

      {/* Version History */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="bg-gray-50 px-5 py-3 border-b border-gray-200">
          <h3 className="font-bold text-gray-800">📋 {t.aboutVersionHistory || "Version History"}</h3>
        </div>
        <div className="divide-y divide-gray-100 text-xs">
          {[
            { v: '1.7.0', label: 'Multi-Region Standards (Katha, Dhur, Ropani, Guntha, Cent, Bigha, Acre, Hectare), 16 South Asian Languages, Full Info Tab Translation, Grouped Optgroup Selector, Universal Conversions (Acres/Hectares/m²)' },
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
        <h3 className="text-base font-bold text-gray-700 mb-2">🔧 {t.aboutDiagnostics || "Diagnostics"}</h3>
        <p className="text-xs text-gray-500 mb-4">{t.aboutDiagnosticsDesc || "If the app is behaving unexpectedly or not remembering your settings, try resetting the local storage."}</p>
        <button 
          onClick={() => { if(confirm('Reset all saved settings, notes and history?')) { localStorage.clear(); window.location.reload(); } }}
          className="bg-white text-red-600 border border-red-200 px-4 py-2 rounded-xl text-xs font-bold hover:bg-red-50 transition active:scale-95 shadow-sm"
        >
          {t.aboutResetBtn || "Reset Application Data (Local)"}
        </button>
      </div>

      {/* Footer */}
      <div className="bg-[#1B5E20] text-white p-6 rounded-2xl text-center shadow-lg">
        <p className="text-green-300 text-[10px] uppercase tracking-widest font-bold mb-2">{t.aboutSoftwareBy || "Software developed and brought to you by"}</p>
        <p className="text-xl font-black tracking-widest">M.A. INDUSTRIES INC.</p>
        <p className="text-green-300 text-xs mt-1">© {new Date().getFullYear()} · {t.aboutAllRights || "All Rights Reserved"}</p>
        <div className="mt-4 pt-4 border-t border-white/20">
          <p className="text-[10px] text-green-400">{t.aboutPwa || "Built as a Progressive Web App (PWA) · Works offline · No data collected"}</p>
        </div>
      </div>

    </div>
  );
}
