@echo off
REM Start Development Servers - Frontend & Backend
REM Batch Script for Windows

echo.
echo ========================================
echo   Real Estate Platform - Dev Servers
echo ========================================
echo.

REM Start Backend
echo Starting Backend Server (Port 4041)...
start "Backend Server" cmd /k "cd /d %~dp0backend && npm run dev"

REM Wait 3 seconds
timeout /t 3 /nobreak >nul

REM Start Frontend
echo Starting Frontend Server (Port 4040)...
start "Frontend Server" cmd /k "cd /d %~dp0 && npm run dev"

echo.
echo ========================================
echo   Servers Started Successfully!
echo ========================================
echo.
echo Frontend: http://localhost:4040
echo Backend:  http://localhost:4041
echo API:      http://localhost:4041/api
echo.
echo Press any key to exit this window...
echo (Servers will continue running in separate windows)
pause >nul
