@echo off
echo.
echo ========================================
echo   PRIZE WHEEL - CLEANUP SCRIPT
echo ========================================
echo.
echo This will DELETE the following files:
echo   - debug.html
echo   - app_debug.js
echo   - app_old_backup.js
echo   - DEBUG_INSTRUCTIONS.md
echo   - IMPLEMENTATION_COMPLETE.md
echo   - OPEN_APP.html
echo.
echo ========================================
echo.

pause

echo.
echo Deleting files...
echo.

if exist "debug.html" (
    del "debug.html"
    echo [DELETED] debug.html
) else (
    echo [SKIP] debug.html not found
)

if exist "app_debug.js" (
    del "app_debug.js"
    echo [DELETED] app_debug.js
) else (
    echo [SKIP] app_debug.js not found
)

if exist "app_old_backup.js" (
    del "app_old_backup.js"
    echo [DELETED] app_old_backup.js
) else (
    echo [SKIP] app_old_backup.js not found
)

if exist "DEBUG_INSTRUCTIONS.md" (
    del "DEBUG_INSTRUCTIONS.md"
    echo [DELETED] DEBUG_INSTRUCTIONS.md
) else (
    echo [SKIP] DEBUG_INSTRUCTIONS.md not found
)

if exist "IMPLEMENTATION_COMPLETE.md" (
    del "IMPLEMENTATION_COMPLETE.md"
    echo [DELETED] IMPLEMENTATION_COMPLETE.md
) else (
    echo [SKIP] IMPLEMENTATION_COMPLETE.md not found
)

if exist "OPEN_APP.html" (
    del "OPEN_APP.html"
    echo [DELETED] OPEN_APP.html
) else (
    echo [SKIP] OPEN_APP.html not found
)

echo.
echo ========================================
echo   CLEANUP COMPLETE!
echo ========================================
echo.
echo Your project is now clean and production-ready.
echo.

pause
