@echo off
echo ========================================
echo   NETWORK SERVER SETUP - PRIZE WHEEL
echo ========================================
echo.
echo This will configure your laptop to allow
echo phones and tablets to connect to the Prize Wheel.
echo.
pause

echo.
echo [1/4] Getting your laptop's IP address...
for /f "tokens=2 delims=:" %%a in ('ipconfig ^| findstr /c:"IPv4 Address"') do set IP=%%a
set IP=%IP:~1%
echo     Your IP: %IP%

echo.
echo [2/4] Checking firewall rules...
netsh advfirewall firewall show rule name="Python HTTP Server" >nul 2>&1
if %errorlevel% EQU 0 (
    echo     Firewall rule already exists
) else (
    echo     Creating firewall rule...
    netsh advfirewall firewall add rule name="Python HTTP Server" dir=in action=allow protocol=TCP localport=8000
    if %errorlevel% EQU 0 (
        echo     ✅ Firewall rule created successfully!
    ) else (
        echo     ⚠️  Failed to create firewall rule
        echo     You may need to run this as Administrator
        echo     Right-click and "Run as administrator"
    )
)

echo.
echo [3/4] Stopping any existing servers...
taskkill /F /IM python.exe 2>nul
timeout /t 2 >nul

echo.
echo [4/4] Starting network-accessible server...
cd /d C:\Prizewheel
start "" "C:\Windows\System32\cmd.exe" /k "python -m http.server 8000 --bind 0.0.0.0"
timeout /t 3 >nul

echo.
echo ========================================
echo   ✅ SERVER IS RUNNING!
echo ========================================
echo.
echo 📱 CONNECT FROM YOUR DEVICES:
echo.
echo    ON THIS LAPTOP:
echo    http://localhost:8000
echo.
echo    ON PHONES/TABLETS (Same WiFi):
echo    http://%IP%:8000
echo.
echo ========================================
echo.
echo 📋 SETUP INSTRUCTIONS:
echo.
echo 1. Make sure your phone/tablet is on the SAME WiFi
echo 2. Open browser on phone/tablet
echo 3. Type: http://%IP%:8000
echo 4. Bookmark it for easy access!
echo.
echo 💡 OFFLINE MODE:
echo    After first load, the app works offline!
echo    Service Worker caches everything.
echo.
echo ========================================
echo.
echo Server will keep running until you:
echo  - Close this window
echo  - Press Ctrl+C
echo  - Run STOP_SERVER.bat
echo.
pause

start http://localhost:8000
