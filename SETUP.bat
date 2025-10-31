@echo off
:: Prize Wheel - Automatic Setup Script
:: This script installs everything needed on a new laptop

cls
echo ========================================
echo   PRIZE WHEEL - AUTOMATIC SETUP
echo ========================================
echo.
echo This will set up Prize Wheel on your laptop:
echo   1. Check/Install Python
echo   2. Configure Windows Firewall
echo   3. Test the server
echo   4. Create desktop shortcuts
echo.
echo ========================================
pause

:: Check if running as Administrator
net session >nul 2>&1
if %errorLevel% NEQ 0 (
    echo.
    echo ========================================
    echo   ADMINISTRATOR RIGHTS REQUIRED
    echo ========================================
    echo.
    echo This setup needs administrator rights to:
    echo   - Install Python (if needed)
    echo   - Configure Windows Firewall
    echo.
    echo Please right-click this file and select:
    echo   "Run as administrator"
    echo.
    pause
    exit /b 1
)

cls
echo ========================================
echo   STEP 1: CHECKING PYTHON
echo ========================================
echo.

:: Check if Python is installed
python --version >nul 2>&1
if %errorLevel% EQU 0 (
    echo ✅ Python is already installed!
    python --version
    goto :firewall
)

echo ❌ Python is not installed
echo.
echo ========================================
echo   INSTALLING PYTHON
echo ========================================
echo.
echo Downloading Python installer...
echo.

:: Create temp directory
if not exist "%TEMP%\PrizeWheelSetup" mkdir "%TEMP%\PrizeWheelSetup"
cd /d "%TEMP%\PrizeWheelSetup"

:: Download Python installer using PowerShell
echo Please wait... Downloading Python 3.11
powershell -Command "& {[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12; Invoke-WebRequest -Uri 'https://www.python.org/ftp/python/3.11.9/python-3.11.9-amd64.exe' -OutFile 'python-installer.exe'}"

if not exist "python-installer.exe" (
    echo.
    echo ❌ Download failed!
    echo.
    echo Please manually install Python:
    echo 1. Go to: https://www.python.org/downloads/
    echo 2. Download Python 3.11 or higher
    echo 3. During install: CHECK "Add Python to PATH"
    echo 4. Run this setup again
    echo.
    pause
    exit /b 1
)

echo.
echo Installing Python...
echo ⚠️ IMPORTANT: The installer will open
echo    Make sure to CHECK "Add Python to PATH"!
echo.
pause

:: Install Python silently with PATH
start /wait python-installer.exe /quiet InstallAllUsers=1 PrependPath=1 Include_test=0

:: Wait for installation
timeout /t 5 >nul

:: Verify installation
python --version >nul 2>&1
if %errorLevel% NEQ 0 (
    echo.
    echo ❌ Python installation may have failed
    echo.
    echo Please install manually and run setup again:
    echo https://www.python.org/downloads/
    echo.
    pause
    exit /b 1
)

echo.
echo ✅ Python installed successfully!
python --version

:: Clean up installer
cd /d C:\Prizewheel
rmdir /s /q "%TEMP%\PrizeWheelSetup" >nul 2>&1

:firewall
echo.
echo ========================================
echo   STEP 2: CONFIGURING FIREWALL
echo ========================================
echo.

:: Check if firewall rule exists
netsh advfirewall firewall show rule name="Prize Wheel Server" >nul 2>&1
if %errorLevel% EQU 0 (
    echo Firewall rule already exists, removing old rule...
    netsh advfirewall firewall delete rule name="Prize Wheel Server"
)

echo Creating firewall rule for port 8000...
netsh advfirewall firewall add rule name="Prize Wheel Server" dir=in action=allow protocol=TCP localport=8000 profile=any

if %errorLevel% EQU 0 (
    echo ✅ Firewall configured successfully!
) else (
    echo ⚠️ Firewall configuration failed
    echo    You may need to allow port 8000 manually
)

:test_server
echo.
echo ========================================
echo   STEP 3: TESTING SERVER
echo ========================================
echo.

cd /d C:\Prizewheel

:: Check if we're in the right directory
if not exist "index.html" (
    echo ❌ ERROR: Prize Wheel files not found!
    echo.
    echo Please make sure you:
    echo 1. Extracted the ZIP file
    echo 2. Placed files in C:\Prizewheel
    echo 3. Run this script from C:\Prizewheel
    echo.
    pause
    exit /b 1
)

echo Starting test server...
start /min python -m http.server 8000 --bind 0.0.0.0
timeout /t 3 >nul

:: Test if server is running
netstat -ano | findstr :8000 | findstr LISTENING >nul 2>&1
if %errorLevel% EQU 0 (
    echo ✅ Server started successfully!
) else (
    echo ⚠️ Server may not have started
    echo    Will continue with setup...
)

:: Stop test server
taskkill /F /IM python.exe >nul 2>&1
timeout /t 2 >nul

:shortcuts
echo.
echo ========================================
echo   STEP 4: CREATING SHORTCUTS
echo ========================================
echo.

:: Create Desktop Shortcut for Server
set SCRIPT="%TEMP%\CreateShortcut.vbs"
echo Set oWS = WScript.CreateObject("WScript.Shell") > %SCRIPT%
echo sLinkFile = "%USERPROFILE%\Desktop\Prize Wheel Server.lnk" >> %SCRIPT%
echo Set oLink = oWS.CreateShortcut(sLinkFile) >> %SCRIPT%
echo oLink.TargetPath = "C:\Prizewheel\START_NETWORK_SERVER.bat" >> %SCRIPT%
echo oLink.WorkingDirectory = "C:\Prizewheel" >> %SCRIPT%
echo oLink.Description = "Start Prize Wheel Server" >> %SCRIPT%
echo oLink.IconLocation = "C:\Windows\System32\shell32.dll,13" >> %SCRIPT%
echo oLink.Save >> %SCRIPT%
cscript /nologo %SCRIPT%
del %SCRIPT%

if exist "%USERPROFILE%\Desktop\Prize Wheel Server.lnk" (
    echo ✅ Desktop shortcut created
) else (
    echo ⚠️ Could not create desktop shortcut
)

:: Create Desktop Shortcut for Network Setup Page
set SCRIPT="%TEMP%\CreateShortcut2.vbs"
echo Set oWS = WScript.CreateObject("WScript.Shell") > %SCRIPT%
echo sLinkFile = "%USERPROFILE%\Desktop\Prize Wheel - QR Code.lnk" >> %SCRIPT%
echo Set oLink = oWS.CreateShortcut(sLinkFile) >> %SCRIPT%
echo oLink.TargetPath = "http://localhost:8000/network-setup.html" >> %SCRIPT%
echo oLink.Description = "Prize Wheel QR Code Page" >> %SCRIPT%
echo oLink.IconLocation = "C:\Windows\System32\shell32.dll,14" >> %SCRIPT%
echo oLink.Save >> %SCRIPT%
cscript /nologo %SCRIPT%
del %SCRIPT%

:get_ip
echo.
echo ========================================
echo   GETTING NETWORK INFORMATION
echo ========================================
echo.

:: Get IP address
for /f "tokens=2 delims=:" %%a in ('ipconfig ^| findstr /c:"IPv4 Address"') do set IP=%%a
set IP=%IP:~1%

if defined IP (
    echo ✅ Your laptop IP address: %IP%
) else (
    echo ⚠️ Could not detect IP address
    set IP=YOUR-LAPTOP-IP
)

:complete
cls
echo ========================================
echo   ✅ SETUP COMPLETE!
echo ========================================
echo.
echo Prize Wheel is ready to use!
echo.
echo ========================================
echo   QUICK START
echo ========================================
echo.
echo ON THIS LAPTOP:
echo   1. Double-click desktop shortcut: "Prize Wheel Server"
echo   2. Browser opens to: http://localhost:8000
echo.
echo ON PHONES/TABLETS:
echo   1. Connect to same WiFi as laptop
echo   2. Open browser
echo   3. Go to: http://%IP%:8000
echo.
echo ========================================
echo   DESKTOP SHORTCUTS CREATED
echo ========================================
echo.
echo ⭐ Prize Wheel Server
echo    - Starts the server
echo    - Opens app in browser
echo.
echo ⭐ Prize Wheel - QR Code
echo    - Opens QR code page
echo    - For mobile device connections
echo.
echo ========================================
echo   WHAT TO DO NEXT
echo ========================================
echo.
echo 1. TEST THE APP:
echo    - Double-click "Prize Wheel Server" on desktop
echo    - Fill out form and spin wheel
echo.
echo 2. CONFIGURE PRIZES:
echo    - Click ⚙️ Settings button
echo    - Click "Open Settings"
echo    - Add/edit your prizes
echo.
echo 3. PRINT QR CODE:
echo    - Double-click "Prize Wheel - QR Code"
echo    - Print the page
echo    - Post at your booth
echo.
echo 4. READ DOCUMENTATION:
echo    - LAPTOP_INSTALLATION.md (overview)
echo    - NETWORK_SETUP_GUIDE.md (detailed guide)
echo.
echo ========================================
echo   FOR TRADE SHOWS
echo ========================================
echo.
echo OPTION A: WiFi Hotspot (Recommended)
echo   1. Settings → Network → Mobile Hotspot
echo   2. Turn ON hotspot
echo   3. Name: "PrizeWheel"
echo   4. Devices connect to your hotspot
echo.
echo OPTION B: Venue WiFi
echo   1. Connect laptop to venue WiFi
echo   2. Run ipconfig to get IP
echo   3. Share IP with devices
echo.
echo ========================================
echo.
echo 🎉 Ready to test? 
echo    Double-click the desktop shortcut!
echo.
echo ========================================
pause

:: Offer to start server now
echo.
choice /C YN /M "Would you like to start the server now"
if errorlevel 2 goto :end
if errorlevel 1 goto :start_now

:start_now
echo.
echo Starting Prize Wheel Server...
start "" "C:\Prizewheel\START_NETWORK_SERVER.bat"
timeout /t 2 >nul

:end
echo.
echo Setup complete! Enjoy your Prize Wheel! 🎡
echo.
pause
exit /b 0