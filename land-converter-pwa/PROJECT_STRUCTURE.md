# 📂 Project Structure: Arena SitePro

This document outlines the organization of the codebase, specifically highlighting the integration of the GIS engine, i18n system, regional standards architecture, and the build automation system.

---

## 🏗️ Core Application Flow

### 1. Bootstrapping (`src/main.tsx`)
The entry point of the application is simplified to prioritize render speed while establishing a bridge to CDN plugins.
- **Leaflet Bridge**: Exposes the React-bundled Leaflet instance to `window.L` to ensure plugin compatibility.
- **Dynamic GIS Loader**: Failsafe script injection that ensures Geoman and Turf are initialized before the map survey tools are enabled, eliminating race conditions on hard refreshes.
- **Native Launch**: Standard React 19 mounting for 100% startup reliability.


### 2. Main Layout & Resilience (`src/App.tsx`)
Manages the tab switching logic, regional standard selection, and language state.
- **Regional Standards Engine**: 19 `REGIONAL_STANDARDS` entries organized by geographic region (Pakistan/Punjab, India North/East/South, Nepal, Universal). Each entry carries `id`, `unit` (sq ft), `unitName`, `group`, and optional `subUnit` metadata. Region is persisted via `la_region_id` in localStorage.
- **Language State**: String-based language key (`la_language`) drives the entire i18n system. Supports 16 South Asian languages.
- **Grouped Dropdown**: Header uses `<optgroup>` elements to organize regional standards by geography.
- **System Safe Mode**: A startup `useEffect` that monitors `localStorage`. It automatically detects corrupted JSON or malformed geometries and sanitizes the state to prevent "White Screen" crashes.

---

## 🧩 Components (`src/components/`)

### 🛰️ `MapSurveyTab.tsx`
The primary GIS interface.
- **Deep Sanitizer 2.0**: A multi-stage geometric filter that cleans every coordinate point during the render loop.
- **GIS Data Import**: Handles `.zip` (Shapefile) and `.kml` (Google Earth) parsing using programmatic buffers and DOM parsers.
- **ProMappingToolbox**: Custom floating UI for toggling Draw, Edit, and Cut modes.
- **POIMarker**: Specialized child component for Point of Interest notes with auto-expansion, dragging, and PDF-safe rendering.
- **LocationMarker**: Handles GPS tracking and "Click to Drop" logic with conflict prevention.

### 📐 `ConverterTab.tsx`
Handles the mathematical logic for unit conversions using `src/utils/calculations.ts`.
- **Core Punjab Rows**: Always displays Punjab Legal, LDA, Traditional, and Rural/Revenue conversions.
- **Dynamic Regional Unit Row**: When a non-Punjab region is selected, renders an additional highlighted row showing the conversion in that region's native unit (Katha, Guntha, Ropani, etc.) with sub-unit if applicable.
- **Universal Conversions**: Always shows Acres, Hectares, and Square Metres at the bottom.
- Supports historical tracking of calculations with export to PDF/Excel.

### ↔️ `ReverseLookupTab.tsx`
Enter a value in any unit and see all equivalents.
- **Dynamic Unit List**: Core Punjab units + Acre/Hectare/m² + the currently selected regional unit (if non-Punjab).
- **Colour-Coded Results**: Blue (Punjab Legal), Teal (LDA), Orange (Traditional), Purple (Rural), Green (Regional), Grey (Universal).

### 📊 `VizTab.tsx`, `NotesTab.tsx`
Supportive features for visualizing comparative plot sizes and tracking on-site field notes with persistent storage.

### ℹ️ `AboutTab.tsx`
Comprehensive Info & Legal reference page.
- **Fully Translatable**: All section headings, feature descriptions, and legal disclaimers are driven by the `t` translation object.
- **Regional Standards Reference**: Visual cards organized by Pakistan/Punjab, India, Nepal, and Universal with colour-coded regions.
- **Version History**: Tracks all releases from v1.0 to v1.7.0.

---

## 🌐 Internationalization (`src/locales.ts`)

The translation system supports **16 languages**: English, Urdu, Hindi, Bengali, Punjabi, Nepali, Marathi, Sinhala, Tamil, Telugu, Gujarati, Malayalam, Kannada, Odia, Pashto, and Sindhi.

Each language dictionary contains:
- **UI Labels**: Tab names, button text, shape selectors, unit labels.
- **Legal Disclaimer**: Full legal disclaimer text for PDF export.
- **About Page Content**: All section headings, feature descriptions, standards descriptions, and footer text.

---

## 🧰 Utilities (`src/utils/`)

- **`calculations.ts`**: Core area calculation logic (Heron's formula, Shoelace algorithm). Includes constants for all Punjab standards plus Acre, Hectare, and Square Metres.
- **`exporting.ts`**: Professional PDF generation (jsPDF) with support for "Official Measurement Certificates" in the user's selected language. Also handles KML/CSV formatting.
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
- **Current Development**: Version 1.7.0
- **Standards**: 19 regional measurement standards across Pakistan, India, Nepal, and Universal.
- **Persistence**: Application utilizes `useLocalStorage` hooks across all tabs to ensure data (points, metadata, settings, language, region) survives navigation and reloads.
