# 🏗️ Desktop Build Guide: Arena SitePro

This guide explains how to compile the Arena SitePro standalone Windows application (.exe) using the integrated Tauri and PowerShell automation pipeline.

---

## 📋 Prerequisites

1.  **Rust**: Installed via [rustup.rs](https://rustup.rs/).
2.  **Node.js**: v18 or higher.
3.  **Visual Studio Build Tools**: 2022 recommended (C++ Build Tools).

---

## 🚀 The Automated Build Pipeline

The project includes a robust automation script to handle the complexities of cloud/network drive file locking and versioning.

### Step 1: Execute the Runner
Double-click the **`Build_Tauri_Desktop_Runner.bat`** file in the root directory.

### Step 2: Input Version
A GUI prompt will appear asking for the build version (e.g., `1.6.0`).
- The script automatically patches `package.json`, `tauri.conf.json`, and the `AboutTab.tsx` UI with this version.

### Step 3: Local Drive Synchronization (The Bridge)
Because Rust/Cargo compilation can fail or be extremely slow on network drives (like OneDrive Z:), the script:
1. Uses **Robocopy** to sync all source files (excluding `node_modules` and `target`) to **`C:\Users\Admin\Documents\land-converter-pwa`**.
2. Performs all compilation steps on the high-speed local drive.

### Step 4: Full Compilation
The script then executes:
1. `npm run build` (Vite web assets).
2. `npm run tauri:build` (Rust binary and NSIS/MSI installer bundling).

---

## 📦 Resulting Files

Once complete, the script will archive the installer to:
`C:\Users\Admin\Documents\land-converter-pwa\releases\v[VERSION]\`

- **NSIS Setup (.exe)**: The primary standalone installer.

---

## 🛠️ Troubleshooting

- **Sync Failure**: Ensure there are no open files in the local build directory that Robocopy might struggle to overwrite.
- **Tauri/Cargo Errors**: Usually caused by a missing Rust target. Run `rustup target add x86_64-pc-windows-msvc`.
- **CORS Errors in Built App**: The build process automatically configures Tauri to allow secure external CDN requests for GIS scripts.
