@echo off
:: ============================================================
:: Build_Tauri_Desktop.bat (CLASSIC ROBUST VERSION)
:: ============================================================

:: ENSURE WE START IN THE CORRECT DRIVE/FOLDER
pushd "%~dp0"
echo [DEBUG] Script successfully started from: %CD%
pause

set "SOURCE=%CD%"
set "LOCAL=C:\Users\Admin\Documents\land-converter-pwa"
set "LOG=%LOCAL%\build_log.txt"

echo.
set /p VERSION="Enter build version (e.g. 1.5.0): "
if "%VERSION%"=="" goto ERREMPTY

echo.
echo =====================================================
echo   LAND CONVERTER - TAURI DESKTOP BUILD SCRIPT
echo =====================================================
echo   Source : %SOURCE%
echo   Local  : %LOCAL%
echo   Version: %VERSION%
echo =====================================================
echo.

:: ── STEP 1: Create local build dir ──
if exist "%LOCAL%" goto STEP2
echo [1/6] Creating local build directory...
mkdir "%LOCAL%"

:STEP2
:: ── STEP 2: Sync source files ──
echo.
echo [2/6] Syncing source files from network drive...
robocopy "%SOURCE%" "%LOCAL%" /E /XD node_modules dist ".git" ".github" "src-tauri\target" /XF "*.log" "build_log.txt" /NFL /NDL /NJH /NJS /MT:8
if %ERRORLEVEL% GTR 7 goto ERRROBO
echo Sync complete.

:: ── STEP 2.5: Auto-Patch versions ──
echo.
echo [2.5/6] Patching files to version %VERSION%...
pushd "%LOCAL%"
powershell -Command "(Get-Content package.json) -replace '\"version\":\s*\".*?\"', '\"version\": \"%VERSION%\"' | Set-Content package.json"
powershell -Command "(Get-Content src-tauri\tauri.conf.json) -replace '\"version\":\s*\".*?\"', '\"version\": \"%VERSION%\"' | Set-Content src-tauri\tauri.conf.json"
powershell -Command "$c = Get-Content src\components\AboutTab.tsx; $c -replace 'const version = \x27.*?\x27', 'const version = \x27%VERSION%\x27' | Set-Content src\components\AboutTab.tsx"
popd
echo Successfully patched project.

:: ── STEP 3: npm install ──
echo.
echo [3/6] Checking npm packages...
pushd "%LOCAL%"
if exist "node_modules\@tauri-apps\cli" goto STEP4
echo @tauri-apps/cli not found. Running install...
call npm install
if %ERRORLEVEL% NEQ 0 goto ERRNPM
call npm install --save-dev @tauri-apps/cli
:STEP4
popd

:: ── STEP 4: Build Web assets ──
echo.
echo [4/6] Building Web assets...
pushd "%LOCAL%"
call npm run build
if %ERRORLEVEL% NEQ 0 goto ERRVITE
popd

:: ── STEP 5: Build Tauri app ──
echo.
echo [5/6] Building Tauri desktop app (Rust)...
pushd "%LOCAL%"
call npm run tauri:build
if %ERRORLEVEL% NEQ 0 goto ERRTAURI
popd

:: ── STEP 6: Archive version ──
echo.
echo [6/6] Archiving iteration %VERSION%...
set "BUNDLE=%LOCAL%\src-tauri\target\release\bundle"
set "REL_DIR=%LOCAL%\releases\v%VERSION%"
if not exist "%REL_DIR%" mkdir "%REL_DIR%"
if exist "%BUNDLE%\nsis\" xcopy "%BUNDLE%\nsis\*.exe" "%REL_DIR%\" /Y /Q
if exist "%BUNDLE%\msi\" xcopy "%BUNDLE%\msi\*.msi" "%REL_DIR%\" /Y /Q

echo.
echo =====================================================
echo   BUILD COMPLETE (Version %VERSION%)
echo =====================================================
goto DONE

:ERREMPTY
echo [ERROR] Version cannot be empty.
goto END

:ERRROBO
echo [ERROR] Robocopy failed.
goto END

:ERRNPM
echo [ERROR] npm install failed.
goto END

:ERRVITE
echo [ERROR] Web build failed.
popd
goto END

:ERRTAURI
echo [ERROR] Tauri build failed.
popd
goto END

:DONE
echo Done. Success!
:END
popd
pause
