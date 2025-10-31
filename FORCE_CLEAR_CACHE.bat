@echo off
echo ========================================
echo   FORCE CLEAR CACHE - PRIZE WHEEL
echo ========================================
echo.
echo This will:
echo 1. Stop the server
echo 2. Clear browser cache data
echo 3. Start fresh server
echo 4. Open browser with force refresh
echo.
echo ========================================
pause

echo.
echo Stopping any running Python servers...
taskkill /F /IM python.exe 2>nul
timeout /t 2 >nul

echo.
echo Starting server...
cd /d C:\Prizewheel
start "" "C:\Windows\System32\cmd.exe" /k "python -m http.server 8000"
timeout /t 2 >nul

echo.
echo ========================================
echo   IMPORTANT BROWSER INSTRUCTIONS
echo ========================================
echo.
echo 1. Open Chrome/Edge
echo 2. Go to: http://localhost:8000
echo 3. Press F12 (Open DevTools)
echo 4. Go to Application tab
echo 5. Click "Service Workers" on left
echo 6. Click "Unregister" for all workers
echo 7. Click "Clear storage" on left
echo 8. Check all boxes and click "Clear site data"
echo 9. Press Ctrl+Shift+R (Hard Refresh)
echo 10. Close DevTools (F12)
echo.
echo ========================================
echo.
echo Opening browser...
start http://localhost:8000

echo.
echo Follow the instructions above to clear cache!
echo.
pause