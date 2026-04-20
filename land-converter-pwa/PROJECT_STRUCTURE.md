# 📂 Project Structure: Arena SitePro

This document outlines the organization of the codebase, specifically highlighting the integration of the GIS engine, data resilience, and the build automation system.

---

## 🏗️ Core Application Flow

### 1. Bootstrapping (`src/main.tsx`)
The entry point of the application is simplified to prioritize render speed while establishing a bridge to CDN plugins.
- **Leaflet Bridge**: Exposes the React-bundled Leaflet instance to `window.L` to ensure plugin compatibility.
- **Native Launch**: Standard React 19 mounting for 100% startup reliability.

### 2. Main Layout & Resilience (`src/App.tsx`)
Manages the tab switching logic and global state.
- **System Safe Mode**: A startup `useEffect` that monitors `localStorage`. It automatically detects corrupted JSON or malformed geometries and sanitizes the state to prevent "White Screen" crashes.
- **Identity Sync**: Ensures regional legal standards (unit/name) are consistent across the entire app instance.

---

## 🧩 Components (`src/components/`)

### 🛰️ `MapSurveyTab.tsx`
The primary GIS interface.
- **Deep Sanitizer 2.0**: A multi-stage geometric filter that cleans every coordinate point during the render loop. This ensures that even "messy" Shapefile imports remain stable.
- **GIS Data Import**: Handles `.zip` (Shapefile) and `.kml` (Google Earth) parsing using programmatic buffers and DOM parsers.
- **ProMappingToolbox**: Custom floating UI for toggling Draw, Edit, and Cut modes. Syncs button styles with the engine's active state.
- **LocationMarker**: Handles GPS tracking and "Click to Drop" logic with conflict prevention.

### 📐 `ConverterTab.tsx` & `AreaCalculatorTab.tsx`
Handle the mathematical logic for unit conversions using `src/utils/calculations.ts`. Supports historical tracking of calculations.

### 🧪 Utils, VizTab, NotesTab & AboutTab
Supportive features for identifying standards, visualizing comparative plot sizes, and tracking on-site field notes with persistent storage.

---

## 🧰 Utilities (`src/utils/`)

- **`calculations.ts`**: Core Haversine and area calculation logic.
- **`exporting.ts`**: Professional PDF generation (jsPDF) with support for "Official Measurement Certificates", and KML/CSV formatting.
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
- **Current Development**: Version 1.6.2
- **Standard**: Punjab Revenue Act (225) compliant with LDA (250) and Traditional (272) fallbacks.
- **Persistence**: Application utilizes `useLocalStorage` hooks across all tabs to ensure data (points, metadata, settings) survives navigation and reloads.
