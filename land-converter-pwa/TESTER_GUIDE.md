# 🗺️ Tester’s Guide: Arena SitePro
**Version:** 1.6.2
**Focus:** Accuracy, Pro Mapping Toolbox, and High-Res Reporting

---

## 1. App Introduction
The **Arena SitePro** is a specialized utility designed for land measurement and GIS surveying. It includes a synchronized GIS engine (Geoman + Turf) for field operations and professional report exporting.

---

## 2. Technical Anatomy
*   **GIS Engine Restoration:** The app uses a global Leaflet bridge to ensure absolute compatibility between the React bundle and external CDN plugins (Turf, Geoman).
*   **Deep Sanitizer 2.0:** Every coordinate imported via Shapefile or KML is passed through a high-performance sanitization ring to ensure geometry stability and performance.
*   **System Safe Mode:** A resilient startup architecture that monitors for initialization crashes and auto-recovers by sanitizing corrupted memory state.

---

## 3. Key Features to Test

### 📂 GIS Data Import (v1.6.2 New)
1. **Zipped Shapefile (↑ Icon):** Prepare a `.zip` archive containing `.shp`, `.shx`, and `.dbf` files. Drag or select the file using the upload icon in the Map tab.
    - **Verification**: Does the map automatically fly to the location? Does the area calculation update instantly?
2. **KML Overlay:** Import a `.kml` file. Verify that the boundaries match your Google Earth references.
3. **Multi-Ring Import**: Test a Shapefile that contains multiple polygons. Verify the "Deep Sanitizer" correctly separates them into distinct survey segments.

### 📍 Pro Mapping Toolbox (v1.6.2 Optimized)
1. **Continuous Draw Mode (+ Icon):** Enable the plus icon (turns green). Plot 4+ points to create a shape. Verify the map doesn't jitter during high-speed sketching.
2. **Node Editing (Pin Icon):** Enable the pin icon (turns blue). Drag any existing corner. The area at the top should update instantly.
3. **Cutting Mode (Trash/Cut Icon)**: Select a polygon, then use the cut tool to draw a "hole" inside it. Verify that the total area calculation subtracts the hole correctly.
4. **Manual Tape Input**: Click on a boundary edge (not a corner). An input prompt should appear. Enter "100" (ft). Verify that a "T: 100.00 ft" label appears at the midpoint of that segment.
5. **GPS Coordinate Search**: Paste `31.5204, 74.3587` into the search bar. The map should fly directly to that point without needing Nominatim results.

### 🛡️ Resilience & Safe Mode
1. **Startup Crash Recovery**: Force-insert broken JSON into the `la_map_points` key in LocalStorage. Refresh the app.
    - **Verification**: Does the app automatically detect the corruption, clear the memory, and launch safely?
2. **CDN Fallback**: If the internet is slow, verify the "Bootstrapping GIS..." screen appears until the engines are fully initialized.

### 📊 Export Suites & Professional Reports
1. **Report Details (+) Button:** Click the green plus button in the top-right. Enter a Surveyor Name and Client Name.
2. **Metadata Persistence:** Switch to the Converter tab and back. Verify the names you entered are still there.
3. **Official PDF Export**: Click the Save (Disk) icon. Open the PDF.
    - **Verification**: Does it say "OFFICIAL MEASUREMENT CERTIFICATE"? Do your names appear in the metadata rows? Is there a coordinate table on page 2?
    - **Manual Verification Page**: If you entered Tape measurements, verify there is an "On-Site Verification" page. Check that the "Verified Manual Area" box at the top matches your expectations.
4. **KML Export**: Import the resulting KML into Google Earth Pro to verify the geometry matches perfectly.

### 🧭 Field Utilities
1. **Digital Compass:** On a mobile device, rotate the phone. Verify the compass icon tracks North correctly.
2. **Repair Map (Wrench)**: If the map seems "shifted" or stuck, tap the Red Wrench button in the search bar. The app should reload and reset centering logic.
3. **Offline Map Download (Cloud Icon)**: Click the **Download Cloud** icon. A progress overlay should appear. Wait for it to finish.
    - **Verification**: Turn on Airplane Mode. Pan/Zoom in the 2km region around the download point. The images should remain crisp.

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
