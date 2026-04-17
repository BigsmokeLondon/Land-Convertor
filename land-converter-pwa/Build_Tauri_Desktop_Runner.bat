@echo off
pushd "%~dp0"
powershell -ExecutionPolicy Bypass -File .\Build_Tauri_Desktop.ps1
popd
pause
