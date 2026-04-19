@echo off
title SiteMaster Pro - Desktop Build Runner
echo =====================================================
echo   SITEMASTER PRO - TAURI BUILD RUNNER
echo =====================================================
echo.

:: --- Z-DRIVE RECOVERY (For Remote/Admin sessions) ---
if not exist Z:\ (
    echo [!] Z: drive not detected. Attempting to map from TS Client...
    net use Z: "\\tsclient\m" /persistent:no >nul 2>&1
)

:: Final check before proceeding
if not exist Z:\ (
    echo [ERROR] Z: drive is missing and could not be mapped.
    echo Please ensure your network drive is connected.
    pause
    exit /b
)

echo [OK] Z: drive confirmed.
echo.

echo [1] Launching PowerShell Build Pipeline...
echo     Location: "%~dp0"
echo.

:: We use -File with the absolute path %~dp0 to bypass working directory issues
powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0Build_Tauri_Desktop.ps1"

echo.
echo =====================================================
echo   Process Finished.
echo =====================================================
pause
