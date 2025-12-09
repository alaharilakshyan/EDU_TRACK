@echo off
echo Starting Student Activity Platform in development mode...

REM Start backend
echo Starting backend server...
cd backend
start "Backend Server" cmd /k "npm run dev"

REM Wait for backend to start
timeout /t 5 /nobreak >nul

REM Start frontend
echo Starting frontend...
cd ../frontend
start "Frontend Server" cmd /k "npm start"

echo.
echo Development servers started!
echo Frontend: http://localhost:3000
echo Backend: http://localhost:5000
echo.
echo Close this window to stop all servers
pause
