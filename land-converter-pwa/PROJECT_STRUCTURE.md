# Project Structure \& File Glossary

## Overview

The **Ultimate Pak Land Survey Tool** is a Progressive Web App (PWA) designed for land measurements and conversions, specifically tailored for revenue officials and surveyors in Pakistan. It supports regional standards (Punjab Legal, Lahore LDA, etc.) and provides a bilingual interface (English/Urdu).

\---

## 🛠️ Core Application Files

Located in `src/`

* **`main.tsx`**: The entry point of the React application. It bootstraps the app and renders it into the DOM.
* **`App.tsx`**: The main application component. It manages the global state (language, active tab, regional standards) and provides the navigation layout for both mobile and desktop.
* **`locales.ts`**: Contains the dictionary for translations. This is where all English and Urdu text strings are stored and managed.
* **`App.css`**: Contains global styles and custom utility classes for the application's unique visual identity.
* **`index.css`**: Tailwind CSS directives and base styles.

\---

## 🧩 Feature Components

Located in `src/components/`

* **`MapSurveyTab.tsx`**: 🌍 **The Flagship Feature.** An interactive map tool (using Leaflet) that allows users to mark points on a map to calculate land area or measure paths/perimeters in real-time using GPS or manual clicks.
* **`AreaCalculatorTab.tsx`**: 📐 A manual calculator for irregular polygons. Users can input sides and diagonals to calculate complex field areas using Heron's formula.
* **`ConverterTab.tsx`**: 🔄 A multi-unit converter for traditional Pakistani units like Kanal, Marla, Sarsai, and Karam, as well as modern units like Square Feet and Acres.
* **`ReverseLookupTab.tsx`**: 🔍 Allows users to input a single value in one unit and see its equivalent across all other land measurement units simultaneously.
* **`VizTab.tsx`**: 📊 Visualizes the history of conversions and calculations using charts, helping users track their work session.
* **`NotesTab.tsx`**: 📝 A digital notepad for surveyors to record field observations directly within the app.
* **`AboutTab.tsx`**: ℹ️ Provides legal references, unit definitions, and contact information for the tool.
* **`CompassTool.tsx`**: 🧭 A utility component that helps surveyors with orientation (integrated into the map).

\---

## ⚙️ Project Configuration

Located in the root directory

* **`vite.config.ts`**: Configuration for the Vite build tool. Includes the PWA plugin configuration which enables offline capabilities and home-screen installation.
* **`package.json`**: Lists all project dependencies (React, Leaflet, Lucide, Tailwind) and scripts for development and building.
* **`tailwind.config.js`**: Customizes the Tailwind CSS framework colors, fonts, and responsive breakpoints.
* **`tsconfig.json`**: TypeScript configuration for the project, ensuring code quality and type safety.

\---

## 🚀 Utility \& Support Scripts

Located in the root directory

* **`Launch\_Web\_App.bat`**: A Windows batch script to quickly start the development server locally.
* **`Sync\_To\_Documents.bat`**: A custom script used to synchronize project files to a local Documents folder for backup or versioning outside of Git.
* **`patch.py`, `patch2.py`, etc.**: Python scripts (likely from the legacy version) used for specific logic updates or data processing during the migration to the PWA.

\---

## 📱 Public Assets

Located in `public/`

* **`manifest.json`**: Defines how the PWA looks when installed on a mobile device (icons, theme colors, etc.).
* **`icons/`**: Contains the app icons in various sizes required for mobile installation.

