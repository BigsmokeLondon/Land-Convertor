# 🌍 Arena SitePro (v1.6.2)

**The Professional GIS Field Surveying & Mapping Suite.**

A high-performance Professional Web App (PWA) and Desktop Tool (Tauri) designed for precise land conversion, boundary surveying, and official report generation using global GIS standards and regional legal scales.

---

## 🚀 Core Features

### 📐 Precision Converter
- **Punjab Legal Scale**: Mastered at 225 sq ft per Marla.
- **LDA/Revenue Standards**: Support for 250, 272, and 272.25 scales.
- **Bi-Lingual**: Full support for English and Urdu with real-time switching.

### 🗺️ Pro Mapping Toolbox (v1.6.2 Optimized)
- **Shapefile & KML Import**: Professional support for zipped `.shp` and Google Earth `.kml` overlays.
- **Continuous Draw**: Plot complex polygons with real-time area/perimeter calculations.
- **Node Editing**: Drag and drop existing boundary points to refine surveys instantly.
- **Holes & Cutting**: Subtract unwanted areas (roads, buildings, "Gali") from larger plots.
- **Deep Sanitizer 2.0**: Specialized coordinate filtering that prevents app crashes from malformed GIS datasets.
- **Satellite Capture**: High-resolution map screenshots with 2x canvas scaling.
- **Manual Tape Measurements**: Click boundary edges to input actual physical tape readings for on-site verification.
- **Offline Map Support**: Regional pre-caching (2km radius) and lazy-caching for fieldwork without signal.
- **GPS Search Paste**: Paste coordinates directly into the search bar for instant, precision navigation.
- **System Safe Mode**: Intelligent startup recovery that bypasses corrupted local memory.

### 📊 Professional Exports
- **Official Measurement Certificate**: Professional PDF reports with Surveyor, Client, and Location metadata.
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
