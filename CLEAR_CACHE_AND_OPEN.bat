@echo off
echo ========================================
echo   Force Browser Cache Refresh
echo ========================================
echo.
echo This will open the app with cache disabled.
echo.
echo After it opens, follow these steps:
echo.
echo 1. Press F12 (open Developer Tools)
echo 2. Right-click the Refresh button
echo 3. Select "Empty Cache and Hard Reload"
echo.
echo OR simply press: Ctrl + Shift + R
echo.
echo ========================================
echo.

REM Open browser with cache disabled flags
start chrome --disable-cache --disable-application-cache http://localhost:8000

echo Browser opened with cache disabled.
echo Remember to do a Hard Refresh!
echo.
pause
