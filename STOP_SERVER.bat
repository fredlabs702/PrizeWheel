@echo off
echo ========================================
echo    Stopping Prize Wheel Server
echo ========================================
echo.

REM Find all Python processes listening on port 8000
echo Searching for Python servers on port 8000...
echo.

REM Get PIDs of processes using port 8000
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :8000 ^| findstr LISTENING') do (
    echo Found server process: %%a
    taskkill /PID %%a /F >nul 2>&1
    if !errorlevel! EQU 0 (
        echo   [✓] Stopped process %%a
    ) else (
        echo   [!] Process %%a may have already stopped
    )
)

echo.
echo ========================================
echo All servers on port 8000 have been stopped
echo ========================================
echo.
pause
