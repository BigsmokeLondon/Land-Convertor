@echo off
title SiteMaster Web Server
echo =====================================================
echo   Starting SiteMaster Pro PWA
echo ==================================================
echo.
echo Please keep this black window open while using the app!
echo Closing this window will turn off the server.
echo.

:: Navigate to the local working directory to safely bypass OneDrive bugs
::cd /d "C:\Users\Admin\Documents\land-converter-pwa"

set "ORIG_DIR=%cd%"
cd /d "%~dp0"

:: ... do stuff ...

cd /d "%ORIG_DIR%"


:: Start the Node web server
start /b npm run dev

:: Wait 3 seconds for Vite to compile
timeout /t 3 /nobreak >nul

:: Automatically open the default web browser to the app
start http://localhost:5173
