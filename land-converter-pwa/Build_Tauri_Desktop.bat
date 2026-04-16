@echo off
:: ============================================================
:: Build_Tauri_Desktop.bat
:: Syncs source from network drive to local C:\ then builds
:: the Tauri desktop installer (.exe)
:: ============================================================

setlocal EnableDelayedExpansion

:: ENSURE WE START IN THE CORRECT DRIVE/FOLDER
cd /d "%~dp0"

:: DEBUG PAUSE (Remove this line once you confirm the window stays open)
echo [DEBUG] Script started from: %CD%
pause

:: QUOTED PATHS TO HANDLE SPACES/DASHES
:: We use %CD% instead of %~dp0 to avoid the trailing backslash escaping the quote
set "SOURCE=%CD%"
set "LOCAL=C:\Users\Admin\Documents\land-converter-pwa"
set "LOG=%LOCAL%\build_log.txt"

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
    echo [1/6] Creating local build directory...
    mkdir "%LOCAL%"
) else (
    echo [1/6] Local build directory exists. OK.
)

:: ── STEP 2: Sync source files (exclude heavy dirs) ───────
echo.
echo [2/6] Syncing source files from network drive...
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

:: Patch AboutTab.tsx (UI) - Handling single quotes carefully
powershell -Command "$c = Get-Content src\components\AboutTab.tsx; $c -replace 'const version = \x27.*?\x27', 'const version = \x27%VERSION%\x27' | Set-Content src\components\AboutTab.tsx"

echo        Successfully patched project to v%VERSION%.

:: ── STEP 3: npm install (only if package.json changed) ───
echo.
echo [3/6] Checking npm packages...
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
    echo       Note: Delete %LOCAL%\node_modules to force reinstall
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
echo   Check your releases folder:
echo   %REL_DIR%
echo.
echo =====================================================

echo.
echo Done. Press any key to exit.
pause >nul
