@echo off
echo ========================================
echo   Prize Wheel - Starting Local Server
echo ========================================
echo.
echo The app will open in your browser at:
echo http://localhost:8000
echo.
echo Press Ctrl+C to stop the server
echo ========================================
echo.

cd /d "%~dp0"
start http://localhost:8000
python -m http.server 8000
