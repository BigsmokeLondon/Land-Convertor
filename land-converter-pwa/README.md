# 🌍 Arena SitePro (v1.6.3)


**The Professional GIS Field Surveying & Mapping Suite.**

A high-performance Professional Web App (PWA) and Desktop Tool (Tauri) designed for precise land conversion, boundary surveying, and official report generation using global GIS standards and regional legal scales.

---

## 🚀 Core Features

### 📐 Precision Converter
- **Punjab Legal Scale**: Mastered at 225 sq ft per Marla.
- **LDA/Revenue Standards**: Support for 250, 272, and 272.25 scales.
- **Bi-Lingual**: Full support for English and Urdu with real-time switching.

- **Pro GIS Engine Stability (New v1.6.3)**: Dynamic, failsafe script loader that prevents GIS tools from dropping out on hard refreshes.
- **Premium POI Site Notes**: Integrated "Glassmorphism" map markers with auto-expanding text fields, draggable pins, and native reliable deletion.
- **System Safe Mode**: Intelligent startup recovery that bypasses corrupted local memory.


### 📊 Professional Exports
- **Official Measurement Certificate**: Professional PDF reports with Surveyor, Client, and Location metadata.
- **POI Label Capture**: Automated capture of on-map site notes in PDF reports with optimized, clutter-free layouts.
- **On-Site Verification Page**: Automated area adjustment scaling and detailed GIS vs. Tape comparison tables in PDF reports.

- **GIS Boundary (KML)**: Export polygons directly to Google Earth Pro.
- **Coordinate Sheet (CSV)**: Export raw GPS data for Excel.

### 🔍 Utility Suite
- **Digital Compass**: Integrated orientation tool with North (N) alignment.
- **Reverse Lookup**: Identify standards based on square footage.
- **Map Diagnostics**: Instant view repair and localized storage reset for data stability.
- **Sticky Persistence**: "Offline First" architecture—automatically saves report metadata and survey points.

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
