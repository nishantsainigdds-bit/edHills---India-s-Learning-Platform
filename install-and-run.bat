@echo off
echo ============================================
echo   edHills Backend - Installing Dependencies
echo ============================================
echo.

:: Check if npm is available
where npm >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] npm / Node.js not found in PATH.
    echo Please install Node.js from https://nodejs.org/
    echo After installing, re-run this script.
    pause
    exit /b 1
)

echo [OK] Node.js / npm found.
echo.
echo Installing packages: express, cors, bcryptjs, jsonwebtoken...
npm install
echo.
if %errorlevel% equ 0 (
    echo ============================================
    echo   Installation complete!
    echo   Run the server: npm start
    echo   Then open:  http://localhost:5000/login.html
    echo ============================================
) else (
    echo [ERROR] Installation failed. Check the error above.
)
pause
