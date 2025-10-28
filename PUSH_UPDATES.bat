@echo off
echo ========================================
echo   Pushing Prize Wheel Updates to GitHub
echo ========================================
echo.

cd /d C:\PrizeWheel

echo Adding files...
git add .

echo.
echo Committing changes...
git commit -m "Add settings security with confirmation modal - hide prize management from customers"

echo.
echo Pushing to GitHub...
git push origin main

echo.
echo ========================================
echo   SUCCESS! Updates pushed to GitHub
echo ========================================
echo.
echo Your changes will be live at:
echo https://fredlabs702.github.io/PrizeWheel/
echo.
echo Wait 1-2 minutes for GitHub Pages to update
echo.
pause
