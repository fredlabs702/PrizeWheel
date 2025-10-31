@echo off
echo ========================================
echo   PRIZE WHEEL - TRANSFER PACKAGE
echo ========================================
echo.
echo This script will help you prepare the
echo Prize Wheel app for transfer to laptop.
echo.
pause

echo.
echo Creating transfer package...
echo.

cd /d C:\Prizewheel

echo [1/3] Checking required files...
if not exist "index.html" (
    echo ERROR: index.html not found!
    pause
    exit /b 1
)
if not exist "app.js" (
    echo ERROR: app.js not found!
    pause
    exit /b 1
)
echo     ✅ All core files present

echo.
echo [2/3] Files ready for transfer:
echo.
echo Core App:
echo   - index.html
echo   - app.js  
echo   - styles.css
echo   - sw.js
echo   - manifest.json
echo   - icon-192.png
echo   - icon-512.png
echo   - assets/tap2lock-header.png
echo.
echo Utilities:
echo   - START_NETWORK_SERVER.bat
echo   - START_SERVER.bat
echo   - STOP_SERVER.bat
echo   - FORCE_CLEAR_CACHE.bat
echo.
echo Documentation:
echo   - LAPTOP_INSTALLATION.md ⭐ START HERE
echo   - NETWORK_SETUP_GUIDE.md
echo   - README.md
echo.
echo Setup Pages:
echo   - network-setup.html (QR code page)
echo.

echo [3/3] Transfer Instructions:
echo.
echo ========================================
echo   HOW TO TRANSFER TO LAPTOP
echo ========================================
echo.
echo METHOD 1: USB Drive
echo   1. Copy entire 'Prizewheel' folder to USB
echo   2. Plug USB into laptop
echo   3. Copy folder to C:\Prizewheel
echo   4. Read: LAPTOP_INSTALLATION.md
echo.
echo METHOD 2: Network Share
echo   1. Share Prizewheel folder on network
echo   2. Access from laptop
echo   3. Copy to C:\Prizewheel
echo   4. Read: LAPTOP_INSTALLATION.md
echo.
echo METHOD 3: Cloud (OneDrive/Dropbox)
echo   1. Upload Prizewheel folder
echo   2. Download on laptop
echo   3. Save to C:\Prizewheel
echo   4. Read: LAPTOP_INSTALLATION.md
echo.
echo ========================================
echo   WHAT TO DO ON LAPTOP
echo ========================================
echo.
echo 1. Copy folder to C:\Prizewheel
echo.
echo 2. Install Python (if needed):
echo    https://www.python.org/downloads/
echo    ⚠️ CHECK "Add Python to PATH"
echo.
echo 3. Double-click: START_NETWORK_SERVER.bat
echo.
echo 4. Read: LAPTOP_INSTALLATION.md
echo    (Complete setup instructions)
echo.
echo ========================================
echo.
echo 📁 Folder size: ~5MB
echo ⏱️ Transfer time: 1-2 minutes
echo.
echo Ready to transfer? Copy the Prizewheel folder!
echo.
pause

echo.
echo Opening folder in Explorer...
start explorer "C:\Prizewheel"
