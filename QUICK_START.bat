@echo off
echo.
echo ========================================
echo RHUDS - Quick Start
echo ========================================
echo.
echo Installing dependencies...
echo.
call npm install
echo.
echo.
echo ========================================
echo Starting Demo App...
echo ========================================
echo.
echo The demo app will open at: http://localhost:5173
echo.
cd packages\demo-app
call npm run dev
pause
