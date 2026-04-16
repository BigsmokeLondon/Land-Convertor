# Desktop Build & Packaging Guide

This guide explains how to generate the standalone Windows installer for the **Ultimate Pak Land Survey Tool**.

## 🚀 The Build Workflow

We use a "Local Build Pipeline" to avoid file-locking issues caused by network drives and cloud syncing.

1.  **Work** as usual in your project on the `Z:` drive.
2.  **Build** the desktop app by running **`Build_Tauri_Desktop.bat`** (Right-click -> **Run as Administrator**).
3.  **Distribute** the generated `.exe` installer.

---

## 📂 Key Desktop Files

| File | Purpose |
|---|---|
| **`Build_Tauri_Desktop.bat`** | The main automation script. It syncs code from `Z:` to `C:\`, compiles the app, and provides the installer link. |
| **`src-tauri/`** | Core desktop configuration (App name, window settings, and icons). |
| **`vite.config.tauri.ts`** | A special build config that ensures paths work inside the native Windows container. |

---

## 📦 Installer Location

After a successful build, your installer will be found at:
`C:\LandConverterDev\src-tauri\target\release\bundle\nsis\Land Converter_1.0.0_x64-setup.exe`

- **Format**: NSIS (.exe)
- **Size**: ~2.5 MB
- **Installation**: Installs to `Program Files` and adds a Start Menu shortcut.

---

## 🛠️ Maintenance & Troubleshooting

### Repacking Icons
If you change the app icons, they are located in `src-tauri/icons`. Tauri uses these to brand the `.exe` and the taskbar icon.

### Mismatched Settings
If you change the version number, update it in `src-tauri/tauri.conf.json`.

---

## ✅ System Prerequisites
To build the app, the following must be installed on the PC:
- **Rust**: [rustup.rs](https://rustup.rs) (Required for the `tauri build` step).
- **Node.js**: Already installed.
