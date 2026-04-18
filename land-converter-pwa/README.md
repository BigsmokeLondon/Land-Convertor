# 🌍 Land Converter Pro (v1.5.0)

**The Ultimate Land Measurement & GIS Suite for Pakistan.**

A high-performance Professional Web App (PWA) and Desktop Tool (Tauri) designed for precise land conversion, boundary surveying, and official report generation using Pakistan's legal and traditional standards.

---

## 🚀 Core Features

### 📐 Precision Converter
- **Punjab Legal Scale**: Mastered at 225 sq ft per Marla.
- **LDA/Revenue Standards**: Support for 250, 272, and 272.25 scales.
- **Bi-Lingual**: Full support for English and Urdu with real-time switching.

### 🗺️ Pro Mapping Toolbox
- **Continuous Draw**: Plot complex polygons with real-time area/perimeter calculations.
- **Node Editing**: Drag and drop existing boundary points to refine surveys.
- **Hole Cutting**: Subtract unwanted areas (roads, buildings) from larger plots.
- **Satellite Capture**: High-resolution map screenshots with perfectly aligned overlays.

### 📊 Professional Exports
- **Official PDF Report**: Branded data sheets with point coordinates and legal disclaimers.
- **GIS Boundary (KML)**: Export your data directly to Google Earth.
- **Coordinate Sheet (CSV)**: Export raw GPS data for Excel.

### 🔍 Utility Suite
- **Reverse Lookup**: Identify standards based on square footage.
- **Compass Tool**: Integrated field orientation.
- **Data Persistence**: "Offline First" architecture—your pins and notes stay even after a refresh.

---

## 🛠️ Technical Stack

- **Core**: React 19 + TypeScript + Vite
- **Styling**: Tailwind CSS + Lucide Icons
- **Mapping**: Leaflet + React-Leaflet
- **GIS Engines**: 
  - **Turf.js**: High-precision geometric calculations (Area, Perimeter, Distance).
  - **Leaflet-Geoman**: Professional-grade geometry editing and drawing.
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
