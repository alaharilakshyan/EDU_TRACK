@echo off
echo Setting up Student Activity Platform...

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo Error: Node.js is not installed. Please install Node.js 18+ first.
    pause
    exit /b 1
)

REM Setup backend
echo Setting up backend...
cd backend
call npm install

REM Copy environment file
if not exist .env (
    copy .env.example .env
    echo Created backend\.env - Please update with your configuration
)

cd ..

REM Setup frontend
echo Setting up frontend...
cd frontend
call npm install

REM Copy environment file
if not exist .env (
    copy .env.example .env
    echo Created frontend\.env - Please update with your configuration
)

cd ..

echo Setup complete!
echo.
echo Next steps:
echo 1. Update backend\.env with your database and API keys
echo 2. Update frontend\.env if needed
echo 3. Start MongoDB
echo 4. Start backend: cd backend ^&^& npm run dev
echo 5. Start frontend: cd frontend ^&^& npm start
echo.
pause
