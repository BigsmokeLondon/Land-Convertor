# 🗺️ Tester’s Guide: Arena SitePro
**Version:** 1.6.0
**Focus:** Accuracy, Pro Mapping Toolbox, and High-Res Reporting

---

## 1. App Introduction
The **Arena SitePro** is a specialized utility designed for land measurement and GIS surveying. It includes a synchronized GIS engine (Geoman + Turf) for field operations and professional report exporting.

---

## 2. Technical Anatomy
*   **Synchronized GIS Bootstrap:** The app uses a sequential bootstrapper in `main.tsx`. It waits for Turf and Geoman to load from CDN and patch the global Leaflet instance before launching the UI.
*   **Pro Mapping Toolbox:** Built using Leaflet-Geoman, allowing for multi-ring polygon support and interactive node editing.
*   **Canvas-First Rendering:** Vectors (polygons/lines) are rendered on a canvas for 100% screenshot alignment accuracy.

---

## 3. Key Features to Test

### 📍 Pro Mapping Toolbox (v1.6 Optimized)
1. **Continuous Draw Mode (+ Icon):** Enable the plus icon (turns green). Plot 4+ points to create a shape. Verify the map doesn't jitter during high-speed sketching.
2. **Node Editing (Pin Icon):** Enable the pin icon (turns blue). Drag any existing corner. The area at the top should update instantly.
3. **Cutting Mode (Trash/Cut Icon):** Select a polygon, then use the cut tool to draw a "hole" inside it. Verify that the total area calculation subtracts the hole correctly.

### 📏 Export Suites & Professional Reports
1. **Report Details (+) Button:** Click the green plus button in the top-right. Enter a Surveyor Name and Client Name.
2. **Metadata Persistence:** Switch to the Converter tab and back. Verify the names you entered are still there.
3. **Official PDF Export:** Click the Save (Disk) icon. Open the PDF.
    - **Verification:** Does it say "OFFICIAL MEASUREMENT CERTIFICATE"? Do your names appear in the metadata rows? Is there a coordinate table on page 2?
4. **KML Export:** Import the resulting KML into Google Earth Pro to verify the geometry matches perfectly.

### 🧭 Field Utilities
1. **Digital Compass:** On a mobile device, rotate the phone. Verify the compass icon tracks North correctly.
2. **Repair Map (Wrench):** If the map seems "shifted" or stuck, tap the Red Wrench button in the search bar. The app should reload and reset centering logic.

---

## 4. Edge Cases to Verify
*   **The "Bootstrapping" Screen:** Upon first launch (or after a reset), you should see a brief "Bootstrapping GIS..." screen.
*   **Hole Cutting:** Ensure cutting a hole inside a polygon correctly subtracts the area. Try cutting a triangular hole in a square.
*   **Search Fly-To:** Use the search bar for "Lahore, Pakistan". Verify the map fly-to animation is smooth and centers correctly.

---

## 5. How to Report Issues
Provide the following:
1. **Device:** (e.g., Samsung S23, Windows 11 Desktop)
2. **Standard:** (e.g. 225 or 250 Marla scale used)
3. **Reproduce steps:** (e.g. "Clicked Draw, then toggled Edit")
