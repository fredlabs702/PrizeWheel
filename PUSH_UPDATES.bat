@echo off
echo ========================================
echo   PRIZE WHEEL - PUSH TO GITHUB
echo ========================================
echo.

cd /d C:\Prizewheel

set GIT="C:\Program Files\Git\bin\git.exe"

echo Checking Git status...
%GIT% status
echo.
echo ========================================
echo.

echo Adding all changes...
%GIT% add .
echo ✅ Files staged
echo.

echo Current changes to commit:
%GIT% status --short
echo.
echo ========================================
echo.

set /p commit_msg="Enter commit message (or press Enter for default): "

if "%commit_msg%"=="" (
    set commit_msg=Clean up and production ready - removed debug files
)

echo.
echo Committing with message: "%commit_msg%"
%GIT% commit -m "%commit_msg%"
echo.

echo ========================================
echo.
echo Pushing to GitHub...
%GIT% push origin main

echo.
echo ========================================
echo   ✅ SUCCESS! Updates pushed to GitHub
echo ========================================
echo.
echo 🌐 Your changes will be live at:
echo    https://fredlabs702.github.io/PrizeWheel/
echo.
echo ⏱️  Wait 1-2 minutes for GitHub Pages to update
echo.
echo ========================================
pause