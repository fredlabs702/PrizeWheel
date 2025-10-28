@echo off
echo ========================================
echo   Prize Wheel - Starting Local Server
echo ========================================
echo.

REM Check if port 8000 is already in use
netstat -ano | findstr :8000 | findstr LISTENING >nul 2>&1
if %errorlevel% EQU 0 (
    echo [!] WARNING: Port 8000 is already in use!
    echo.
    echo A server is already running. Options:
    echo 1. Use the existing server
    echo 2. Stop it first with STOP_SERVER.bat
    echo.
    choice /C 12 /M "Choose option"
    if errorlevel 2 (
        echo.
        echo Please run STOP_SERVER.bat first, then try again.
        echo.
        pause
        exit /b 1
    )
    echo.
    echo Opening browser to existing server...
    start http://localhost:8000
    echo.
    echo Server is already running at:
    echo   http://localhost:8000
    echo   http://192.168.2.78:8000
    echo.
    pause
    exit /b 0
)

echo Starting new server...
echo.
echo The app will open in your browser at:
echo   http://localhost:8000
echo.
echo Network Access (for tablet):
echo   http://192.168.2.78:8000
echo.
echo Press Ctrl+C to stop the server
echo Or run STOP_SERVER.bat from another window
echo ========================================
echo.

cd /d "%~dp0"
start http://localhost:8000
python -m http.server 8000 --bind 0.0.0.0
