@echo off
:: ============================================================
:: Build_Tauri_Desktop.bat
:: Syncs source from network drive to local C:\ then builds
:: the Tauri desktop installer (.exe)
::
:: Usage: Double-click or run from admin command prompt
:: Output: C:\LandConverterDev\src-tauri\target\release\bundle\
:: ============================================================

setlocal EnableDelayedExpansion

set SOURCE=Z:\Data\Camwood Ondrive\OneDrive - Camwood Limited\Arena\AI\AntiGavity\land-converter-pwa
set LOCAL=C:\Users\Admin\Documents\land-converter-pwa
set LOG=%LOCAL%\build_log.txt

echo.
set /p VERSION="Enter build version (e.g. 1.5.0): "
if "%VERSION%"=="" (
    echo [ERROR] Version cannot be empty.
    pause
    exit /b 1
)

echo.
echo =====================================================
echo   LAND CONVERTER - TAURI DESKTOP BUILD SCRIPT
echo =====================================================
echo   Source : %SOURCE%
echo   Local  : %LOCAL%
echo   Version: %VERSION%
echo   Time   : %DATE% %TIME%
echo =====================================================
echo.

:: ── STEP 1: Create local build dir if needed ─────────────
if not exist "%LOCAL%" (
    echo [1/5] Creating local build directory...
    mkdir "%LOCAL%"
) else (
    echo [1/5] Local build directory exists. OK.
)

:: ── STEP 2: Sync source files (exclude heavy dirs) ───────
echo.
echo [2/5] Syncing source files from network drive...
echo       (Skipping node_modules, dist, src-tauri\target)
echo.

robocopy "%SOURCE%" "%LOCAL%" ^
    /E ^
    /XD node_modules dist ".git" ".github" ^
    /XD "src-tauri\target" ^
    /XF "*.log" "build_log.txt" ^
    /NFL /NDL /NJH /NJS ^
    /MT:8

if %ERRORLEVEL% GTR 7 (
    echo.
    echo [ERROR] Robocopy failed with error %ERRORLEVEL%
    echo         Check that %SOURCE% is accessible.
    pause
    exit /b 1
)
echo Sync complete.

:: ── STEP 2.5: Auto-Patch versions in Local C:\ ──────────
echo.
echo [2.5/6] Patching files to version %VERSION%...
cd /d "%LOCAL%"

:: Patch package.json
powershell -Command "(Get-Content package.json) -replace '\"version\":\s*\".*?\"', '\"version\": \"%VERSION%\"' | Set-Content package.json"

:: Patch tauri.conf.json
powershell -Command "(Get-Content src-tauri\tauri.conf.json) -replace '\"version\":\s*\".*?\"', '\"version\": \"%VERSION%\"' | Set-Content src-tauri\tauri.conf.json"

:: Patch AboutTab.tsx (UI)
powershell -Command "(Get-Content src\components\AboutTab.tsx) -replace \"const version = '.*?'\", \"const version = '%VERSION%'\" | Set-Content src\components\AboutTab.tsx"

echo        Successfully patched project to v%VERSION%.

:: ── STEP 3: npm install (only if package.json changed) ───
echo.
echo [3/5] Checking npm packages...
cd /d "%LOCAL%"

if not exist "node_modules\@tauri-apps\cli" (
    echo       @tauri-apps/cli not found. Running full install...
    call npm install
    if %ERRORLEVEL% NEQ 0 (
        echo [ERROR] npm install failed.
        pause
        exit /b 1
    )
    call npm install --save-dev @tauri-apps/cli
    if %ERRORLEVEL% NEQ 0 (
        echo [ERROR] Tauri CLI install failed.
        pause
        exit /b 1
    )
    echo       Packages installed OK.
) else (
    echo       Packages already installed. Skipping.
    echo       (Delete C:\LandConverterDev\node_modules to force reinstall)
)

:: ── STEP 4: Build Web assets ──────────────────────────────
echo.
echo [4/6] Building Web assets... (Vite)
echo.
call npm run build
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo [ERROR] Web build failed. Check output above.
    pause
    exit /b 1
)

:: ── STEP 5: Build Tauri desktop app ───────────────────────
echo.
echo [5/6] Building Tauri desktop app... (Rust)
echo       This compiles Rust code and may take 5-15 minutes
echo       on the first run. Subsequent builds are much faster.
echo.

call npm run tauri:build

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo [ERROR] Tauri build failed. Check output above.
    pause
    exit /b 1
)

:: ── STEP 6: Archive versioned iteration ─────────────────────
echo.
echo [6/6] Archiving iteration %VERSION%...

set BUNDLE=%LOCAL%\src-tauri\target\release\bundle
set REL_DIR=%LOCAL%\releases\v%VERSION%
if not exist "%REL_DIR%" mkdir "%REL_DIR%"

if exist "%BUNDLE%\nsis\" (
    xcopy "%BUNDLE%\nsis\*.exe" "%REL_DIR%\" /Y /Q
) else if exist "%BUNDLE%\msi\" (
    xcopy "%BUNDLE%\msi\*.msi" "%REL_DIR%\" /Y /Q
)

echo Iteration archived to: %REL_DIR%
echo.

echo =====================================================
echo   BUILD COMPLETE (Version %VERSION%)
echo =====================================================
echo.
echo   Check your USB stick or releases folder:
echo   %REL_DIR%
echo.
echo =====================================================

echo.
echo Done. Press any key to exit.
pause >nul
