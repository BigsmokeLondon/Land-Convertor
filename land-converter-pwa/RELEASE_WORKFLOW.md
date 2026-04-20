# 🚀 Release Workflow: Arena SitePro

This document outlines the standard procedure for committing changes and deploying new versions of the Arena SitePro PWA.

---

## 🏗️ Standard Release Flow (v1.6.2+)

### 1. Verification (On C: Drive)
Before committing, always ensure the local build on the **C:** drive was successful:
1.  Run the **Build_Tauri_Desktop_Runner.bat**.
2.  Check for the "Process Finished" message and ensure no TypeScript errors were reported.
3.  Test the app in the browser at `http://localhost:5173/Land-Convertor/`.

### 2. Version Control (On Z: Drive)
**IMPORTANT**: All Git commands must be executed from the **Z:** (Master) drive to ensure the cloud-synced master is always the source of truth.

1.  **Check current status**:
    ```bash
    git status
    ```
2.  **Create a New Branch (Recommended)**:
    ```bash
    git checkout -b release/v1.6.2
    ```
3.  **Stage Changes**:
    ```bash
    git add .
    ```
4.  **Commit**:
    ```bash
    git commit -m "v1.6.2: Restored GIS engine, fixed Shapefile import, and enabled Safe Mode"
    ```

### 3. Deployment (To GitHub Pages)
The PWA is automatically deployed via GitHub Actions when changes reach the **`main`** branch.

1.  **Push the branch**:
    ```bash
    git push origin release/v1.6.2
    ```
2.  **Merge to Main**: 
    - Go to GitHub and open a **Pull Request**.
    - Resolve any conflicts and **Merge** into the `main` branch.
3.  **Monitor Actions**:
    - Tap the **Actions** tab on your GitHub repository.
    - Wait for the "Deploy PWA to GitHub Pages" workflow to finish (green checkmark).

---

## 🛡️ Recovery & Safety
If a build fails or a sync accidentally overwrites the **C:** drive fixes:
- The **Z:** drive is now the master source of truth.
- Re-run the sync/build script to restore the `C:` drive state from the now-fixed `Z:` master.

---
**Version:** 1.6.2  
**Maintainer:** M.A. Industries  
**Last Updated:** April 20, 2026
