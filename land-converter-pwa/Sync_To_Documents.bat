@echo off
echo ==============================================
echo Mirroring Z: workspace to C: Documents
echo ==============================================

robocopy "Z:\Data\Camwood Ondrive\OneDrive - Camwood Limited\Arena\AI\AntiGavity\land-converter-pwa" "C:\Users\Admin\Documents\land-converter-pwa" /MIR /XD node_modules .git /XF .env Sync_To_Documents.bat

echo.
echo Sync Complete! Your Documents folder is now a perfect mirror.
pause
