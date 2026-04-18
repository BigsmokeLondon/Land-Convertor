# 🗺️ Tester’s Guide: Land Converter Pro
**Version:** 1.5.0
**Focus:** Accuracy, Pro Mapping Toolbox, and High-Res Reporting

---

## 1. App Introduction
The **Land Converter Pro** is a specialized utility designed for land measurement and GIS surveying, specifically following Pakistan's legal standards. It includes a synchronized GIS engine (Geoman + Turf) for field operations and professional report exporting.

---

## 2. Technical Anatomy
*   **Synchronized GIS Bootstrap:** The app uses a sequential bootstrapper in `main.tsx`. It waits for Turf and Geoman to load from CDN and patch the global Leaflet instance before launching the UI.
*   **Pro Mapping Toolbox:** Built using Leaflet-Geoman, allowing for multi-ring polygon support and interactive node editing.
*   **Canvas-First Rendering:** Vectors (polygons/lines) are rendered on a canvas for 100% screenshot alignment accuracy.

---

## 3. Key Features to Test

### 📍 Pro Mapping Toolbox (New in 1.5.0)
1. **Draw Mode (+ Icon):** Enable the plus icon. It should turn green. Plot 4+ points to create a shape.
2. **Node Editing (Pin Icon):** Enable the pin icon. It should turn blue. Drag any existing corner of your polygon. The area at the top should update instantly.
3. **Cutting Mode (Trash/Cut Icon):** Select a polygon, then use the cut tool to draw a "hole" inside it. Verify that the total area calculation subtracts the hole correctly.

### 📸 High-Res Screenshots
1. Create a complex survey with several markers and a polygon.
2. Click the **Camera** button.
3. **Verification:** Open the downloaded image.
    *   Are the markers perfectly aligned with the map?
    *   Are the zoom/attribution buttons hidden in the image?
    *   Is the image clear (High-res 2x scaling)?

### 📏 Export Suites
1. **PDF Report:** Verify the points table includes all coordinates.
2. **KML Export:** Import the resulting KML into Google Earth to verify the geometry matches.
3. **CSV Export:** Verify the latitudes/longitudes are correct in Excel.

---

## 4. Edge Cases to Verify
*   **The "Warming Up" Check:** Upon first launch, you should see a brief "Bootstrapping..." screen. This ensures you never enter the map with broken tools.
*   **Dual-Layer Polygons:** Ensure cutting a hole inside a polygon correctly updates both the Sq Ft and Marla counts.
*   **Search Fly-To:** Use the search bar for "Lahore, Pakistan". Verify the map centers correctly and doesn't break any active drawing modes.

---

## 5. How to Report Issues
Provide the following:
1. **Device:** (e.g., Samsung S23, Windows 11 Desktop)
2. **Standard:** (e.g. 225 or 250 Marla scale used)
3. **Reproduce steps:** (e.g. "Clicked Draw, then toggled Edit")
