# 🗺️ Tester’s Guide: Ultimate Pak Land Survey Tool
**Version:** 1.5.0
**Focus:** Accuracy, Data Persistence, and Field Reliability

---

## 1. App Introduction
The **Ultimate Pak Land Survey Tool** is a specialized utility designed for land measurement and unit conversion, specifically following the **Punjab Legal Standard (225 sq ft per Marla)**. It includes traditional references for informal cross-checking and a GPS-enabled mapping suite for field surveys.

---

## 2. Technical Anatomy (The "Makeup")
As a tester, it helps to know how the app handles your data:

*   **Platform:** It is a **Hybrid PWA/Desktop app**. It can run in a browser, be installed as a mobile app (PWA), or run as a standalone Windows app (Tauri).
*   **Data Handling (LocalStorage):** There is **no database**. All data you enter (notes, map pins, calculator values) is saved to your browser's local storage.
    *   *Test Note:* If you refresh the page, your data should stay. If you "Clear Browser Data/Cache," the app will be reset.
*   **GPS Engine:** Built using **Leaflet**. It uses your device's high-accuracy hardware to plot coordinates.
*   **Bilingual System:** Every label in the app is mapped to both English and Urdu.
*   **Offline First:** The app is designed to work in remote areas with zero internet after the initial load.

---

## 3. Top 5 Things to Test

### 🕒 Persistence (The "Sticky" Test)
1. Go to the **Converter** and enter a value.
2. Go to **Map Survey** and drop 3-4 pins.
3. Close the browser tab entirely and reopen it.
4. **Verification:** Are your values and pins still there? (They should be!)

### 📏 Calculation Accuracy
1. Go to the **Area Calculator**.
2. Select **"Rectangle"** and enter Width: 30ft, Length: 60ft.
3. Verify the result is **1,800 sq ft**.
4. Check the conversion: At 225 sq ft/Marla, this should show exactly **8 Marlas**.
5. Switch the language to **Urdu** and verify the numbers remain identical.

### 📍 GPS & Mapping (Field Test)
1. Open the **Map Survey** tab.
2. Tap the **"My Location"** icon.
3. Walk 10-20 steps. Does the blue dot track your movement accurately?
4. Try **"Path Mode"**: Drop pins along a straight line. Does the "Total Distance" update in real-time?
5. Try **"Area Mode"**: Close a polygon. Does it show the calculated acreage/kanal/marla?

### 📑 Exporting Data
1. Add some data to the **Notes** tab.
2. Create a small survey on the map.
3. Try the **Export to Excel** or **Save as PDF** buttons.
4. **Verification:** Does the file download? Is the data inside readable and correct?

### 🧭 Utilities
1. Test the **Compass Tool** (on a mobile device). compare it against a physical compass or another app.
2. Use **Reverse Lookup**: Enter a Square Foot value (e.g., 5445) and see if it correctly identifies it as 1 Kanal (at 225 scale).

---

## 4. Known "Edge Cases" to Try
Can you break the app? Try these:
*   **The Zero Test:** What happens if you enter "0" or negative numbers in the calculator?
*   **The Switcher:** Start a calculation in **English**, then switch to **Urdu** halfway through. Does it wipe your input or keep it?
*   **The Big Number:** Enter a massive number (e.g., 1,000,000 sq ft). Does the layout break or overlap?

---

## 5. How to Report Issues
If you find a bug, please note:
1. **Device:** (e.g., iPhone 14, Windows 11 PC)
2. **Browser:** (e.g., Chrome, Safari, Edge)
3. **The "What happened":** (e.g., "I clicked the map and it went blank")
4. **The "What I expected":** (e.g., "I expected it to drop a pin")
