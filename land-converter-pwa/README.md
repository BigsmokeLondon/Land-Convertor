# 🌍 Arena SitePro (v1.7.0)


**The Professional GIS Field Surveying & Mapping Suite.**

A high-performance Professional Web App (PWA) and Desktop Tool (Tauri) designed for precise land conversion, boundary surveying, and official report generation using global GIS standards and regional legal scales.

---

## 🚀 Core Features

### 📐 Precision Converter
- **Multi-Region Standards**: 19 regional measurement standards across Pakistan, India, Nepal, and Universal (Acre/Hectare).
- **Pakistan / Punjab**: Punjab Legal (225), LDA (250), Traditional (272), Rural/Revenue (272.25) sq ft per Marla.
- **India**: Kanal (J&K), Bigha (UP/Bihar), Katha (West Bengal/Bihar/Assam), Dhur (Bihar), Guntha (Maharashtra/Karnataka), Cent (Tamil Nadu/Kerala).
- **Nepal**: Ropani (Hills), Bigha (Terai), Katha, Dhur.
- **Universal**: Acre (43,560 sq ft), Hectare (107,639 sq ft), Square Metres — always displayed alongside regional results.
- **Grouped Selector**: `<optgroup>` dropdown organises standards by geographic region for quick field selection.

### 🌐 Multi-Language Support (16 Languages)
- Full i18n across **English, Urdu, Hindi, Bengali, Punjabi, Nepali, Marathi, Sinhala, Tamil, Telugu, Gujarati, Malayalam, Kannada, Odia, Pashto, and Sindhi**.
- Complete translation of all UI labels, feature descriptions, legal disclaimers, and the Info & Legal reference page.
- PDF export engine outputs legal disclaimer in the user's selected language.

### 📊 Professional Exports
- **Official Measurement Certificate**: Professional PDF reports with Surveyor, Client, and Location metadata.
- **POI Label Capture**: Automated capture of on-map site notes in PDF reports with optimized, clutter-free layouts.
- **On-Site Verification Page**: Automated area adjustment scaling and detailed GIS vs. Tape comparison tables in PDF reports.
- **GIS Boundary (KML)**: Export polygons directly to Google Earth Pro.
- **Coordinate Sheet (CSV)**: Export raw GPS data for Excel.

### 🗺️ GIS Mapping Engine
- **Pro Mapping Toolbox**: One-tap access to advanced GIS drawing and cutting tools.
- **Continuous Draw Mode**: High-speed boundary sketching without manual panning.
- **Manual Tape Measurements**: Click boundary edges to enter physical on-site verification readings.
- **Offline Map Pre-caching**: Download a 2km region for field use in zero-signal areas.
- **GPS Walk-and-Track**: Continuous tracking with 5ft anti-jitter filtering and Auto-Follow mode.
- **Precision Crosshair Pinning**: Pan map under yellow crosshair for GPS-independent accuracy.

### 🔍 Utility Suite
- **Digital Compass**: Integrated orientation tool with North (N) alignment.
- **Reverse Lookup**: Identify standards based on any unit input — now includes Acre, Hectare, m², and dynamic regional units.
- **Map Diagnostics**: Instant view repair and localized storage reset for data stability.
- **Sticky Persistence**: "Offline First" architecture — automatically saves report metadata and survey points.

---

## 🛠️ Technical Stack

- **Core**: React 19 + TypeScript + Vite
- **Styling**: Tailwind CSS + Lucide Icons
- **Mapping**: Leaflet + React-Leaflet
- **GIS Engines**: 
  - **Turf.js**: High-precision geometric calculations (Area, Perimeter, Distance).
  - **Leaflet-Geoman**: Professional-grade geometry editing and drawing.
- **Caching**: Workbox (PWA) runtime caching for offline tile availability.
- **Exporting**: jsPDF, autoTable, html2canvas.
- **Desktop**: Tauri (Rust) for Windows standalone installers.
- **i18n**: Custom locale system with 16 South Asian language dictionaries (`src/locales.ts`).

---

## 📦 Installation & Setup

### For Development
1. Clone the repository.
2. Run `npm install`.
3. Start dev server: `npm run dev`.

### For Desktop Build
1. Ensure Rust is installed.
2. Run the automated build script: `.\Build_Tauri_Desktop_Runner.bat`.
3. The script automatically syncs sources from network drives and patches version numbers.

---

## 🛡️ License & Credits
Developed by **M.A. Industries Inc.**  
© 2026 M.A. Industries. All rights reserved.
