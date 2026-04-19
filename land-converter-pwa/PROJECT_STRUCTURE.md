# 📂 Project Structure: SiteMaster Survey Pro

This document outlines the organization of the codebase, specifically highlighting the integration of the GIS engine and the build automation system.

---

## 🏗️ Core Application Flow

### 1. Bootstrapping (`src/main.tsx`)
The entry point of the application is synchronized to wait for external GIS dependencies.
- **`injectGIS`**: Programmatically loads Turf.js and Leaflet-Geoman via CDN.
- **Synchronized Launch**: The React application only renders once `window.L` is patched and ready.

### 2. Main Layout (`src/App.tsx`)
Manages the tab switching logic and the state for high-level settings (Language, Legal Standard).

---

## 🧩 Components (`src/components/`)

### 🛰️ `MapSurveyTab.tsx`
The primary GIS interface.
- **`GeomanControls`**: Bridge between the Leaflet-Geoman engine and React state. Handles the conversion of visual layers to coordinate data.
- **`ProMappingToolbox`**: Custom floating UI for toggling Draw, Edit, and Cut modes. Syncs button styles with the engine's active state.
- **`LocationMarker`**: Handles GPS tracking and "Click to Drop" logic with conflict prevention for drawing modes.

### 📐 `ConverterTab.tsx` & `AreaCalculatorTab.tsx`
Handle the mathematical logic for unit conversions using `src/utils/calculations.ts`.

### 🧪 Reverse LookupTab.tsx, VizTab.tsx & AboutTab.tsx
Provide utility functions for identifying standards, visualizing comparative plot sizes, and tracking version history.

### 🧭 `CompassTool.tsx`
Self-contained component that listens to `deviceorientation` events to provide a digital compass with a North (N) reference, essential for Patwari map alignment.

---

## 🧰 Utilities (`src/utils/`)

- **`calculations.ts`**: Core Haversine and area calculation logic.
- **`exporting.ts`**: Professional PDF generation (jsPDF) with support for "Official Measurement Certificates", and KML/CSV formatting. Includes metadata injection for surveyor and client details.
- **`ExcelExport.ts`**: Specialized handler for Excel-ready coordinate sheets.

---

## ⚙️ Build & Synchronization

### Network-to-Local Bridge
To bypass filesystem locking issues on network/cloud drives during the Rust build phase, the project uses a synchronization pipeline:
- **`Build_Tauri_Desktop_Runner.bat`**: A wrapper that triggers the PowerShell sync.
- **`Build_Tauri_Desktop.ps1`**:
    1. **Sync**: Uses Robocopy to mirror the `Z:` master to `C:`.
    2. **Patch**: Automatically updates versions in `package.json`, `tauri.conf.json`, and `AboutTab.tsx`.
    3. **Build**: Runs Vite build and Tauri compilation on the local high-speed drive.

### Versioning & State
- **Current Development**: Version 1.6.0
- **Standard**: Punjab Revenue Act (225) compliant.
- **Persistence**: Application utilizes `useLocalStorage` hooks across all tabs to ensure data (points, metadata, settings) survives navigation and reloads.
