@echo off
title Land Converter Builder

echo ====================================================
echo        Land Converter - EXE Builder  Past without ""
echo ====================================================
echo.

:: Ask for Python file path
set /p pyfile=Enter full path to your .py file: 

:: Check if file exists
if not exist "%pyfile%" (
    echo.
    echo ERROR: File not found. Please check the path.
    pause
    exit /b
)

echo.
echo Building executable...
echo.

:: Run PyInstaller
pyinstaller --onefile --noconsole "%pyfile%"

echo.
echo ============================================
echo Build complete.
echo Your EXE is located in the "dist" folder.
echo ============================================
pause
