@echo off
echo Installing MongoDB for Student Activity Platform
echo ================================================

echo.
echo Step 1: Checking if Chocolatey is installed...
choco --version >nul 2>&1
if %errorlevel% neq 0 (
    echo Chocolatey not found. Installing Chocolatey first...
    powershell -Command "Set-ExecutionPolicy Bypass -Scope Process -Force; [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))"
    if %errorlevel% neq 0 (
        echo Failed to install Chocolatey. Please install manually from https://chocolatey.org/install
        pause
        exit /b 1
    )
) else (
    echo Chocolatey is already installed.
)

echo.
echo Step 2: Installing MongoDB using Chocolatey...
choco install mongodb --yes
if %errorlevel% neq 0 (
    echo Failed to install MongoDB via Chocolatey.
    echo Please download and install manually from: https://www.mongodb.com/try/download/community
    pause
    exit /b 1
)

echo.
echo Step 3: Installing MongoDB Compass...
choco install mongodb-compass --yes
if %errorlevel% neq 0 (
    echo MongoDB Compass installation failed, but MongoDB should still work.
)

echo.
echo Step 4: Starting MongoDB service...
net start MongoDB
if %errorlevel% neq 0 (
    echo Failed to start MongoDB service. Trying to create it first...
    mongod --install
    net start MongoDB
    if %errorlevel% neq 0 (
        echo MongoDB service failed to start. You may need to start it manually.
        echo Run: mongod --dbpath "C:\data\db"
    )
)

echo.
echo Step 5: Verifying MongoDB installation...
mongosh --version
if %errorlevel% neq 0 (
    echo MongoDB shell not found, but server might be working.
) else (
    echo MongoDB installation successful!
)

echo.
echo ================================================
echo MongoDB Setup Complete!
echo ================================================
echo.
echo Next steps:
echo 1. Open MongoDB Compass
echo 2. Connect to: mongodb://localhost:27017
echo 3. Run the setup commands from MONGODB_SETUP.md
echo.
echo Press any key to open MongoDB Compass...
pause >nul
"C:\Program Files\MongoDB\MongoDB Compass\MongoDBCompass.exe" 2>nul || start mongodb://localhost:27017

pause
