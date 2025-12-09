# MongoDB Installation Script for Student Activity Platform
Write-Host "MongoDB Installation Script" -ForegroundColor Green
Write-Host "=============================" -ForegroundColor Green

# Check if MongoDB is already installed
$mongoInstalled = Get-Command mongod -ErrorAction SilentlyContinue
if ($mongoInstalled) {
    Write-Host "MongoDB is already installed!" -ForegroundColor Yellow
    $version = mongod --version
    Write-Host "Version: $version" -ForegroundColor Green
} else {
    Write-Host "MongoDB not found. Installing..." -ForegroundColor Yellow
    
    # Option 1: Try Chocolatey
    try {
        $chocoInstalled = Get-Command choco -ErrorAction SilentlyContinue
        if ($chocoInstalled) {
            Write-Host "Installing MongoDB via Chocolatey..." -ForegroundColor Blue
            choco install mongodb -y
            Write-Host "MongoDB installed via Chocolatey!" -ForegroundColor Green
        } else {
            Write-Host "Chocolatey not found. Please install MongoDB manually." -ForegroundColor Red
            Write-Host "Download from: https://www.mongodb.com/try/download/community" -ForegroundColor Yellow
        }
    } catch {
        Write-Host "Chocolatey installation failed. Please install MongoDB manually." -ForegroundColor Red
        Write-Host "Download from: https://www.mongodb.com/try/download/community" -ForegroundColor Yellow
    }
}

# Try to start MongoDB service
Write-Host "Starting MongoDB service..." -ForegroundColor Blue
try {
    $service = Get-Service -Name "MongoDB" -ErrorAction SilentlyContinue
    if ($service) {
        if ($service.Status -eq "Running") {
            Write-Host "MongoDB service is already running!" -ForegroundColor Green
        } else {
            Start-Service -Name "MongoDB"
            Write-Host "MongoDB service started!" -ForegroundColor Green
        }
    } else {
        Write-Host "MongoDB service not found. Starting MongoDB manually..." -ForegroundColor Yellow
        # Create data directory if it doesn't exist
        if (!(Test-Path "C:\data\db")) {
            New-Item -ItemType Directory -Path "C:\data\db" -Force
        }
        # Start MongoDB manually (this will block the terminal)
        Write-Host "Starting MongoDB manually..." -ForegroundColor Blue
        Write-Host "Press Ctrl+C to stop MongoDB when done" -ForegroundColor Yellow
        mongod --dbpath "C:\data\db"
    }
} catch {
    Write-Host "Failed to start MongoDB service: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "You may need to start MongoDB manually:" -ForegroundColor Yellow
    Write-Host "1. Create directory: C:\data\db" -ForegroundColor White
    Write-Host "2. Run: mongod --dbpath 'C:\data\db'" -ForegroundColor White
}

# Verify installation
Write-Host "Verifying MongoDB installation..." -ForegroundColor Blue
try {
    $mongoVersion = mongosh --version 2>$null
    if ($mongoVersion) {
        Write-Host "MongoDB Shell is working!" -ForegroundColor Green
        Write-Host "Version: $mongoVersion" -ForegroundColor White
    } else {
        Write-Host "MongoDB Shell not found, but server might be working." -ForegroundColor Yellow
    }
} catch {
    Write-Host "MongoDB verification failed, but installation might still work." -ForegroundColor Yellow
}

Write-Host "`nMongoDB Setup Complete!" -ForegroundColor Green
Write-Host "Next steps:" -ForegroundColor Blue
Write-Host "1. Open MongoDB Compass" -ForegroundColor White
Write-Host "2. Connect to: mongodb://localhost:27017" -ForegroundColor White
Write-Host "3. Run the setup commands from MONGODB_SETUP.md" -ForegroundColor White

# Try to open MongoDB Compass
try {
    Start-Process "mongodb://localhost:27017"
} catch {
    Write-Host "Could not open MongoDB Compass automatically." -ForegroundColor Yellow
    Write-Host "Please open it manually and connect to: mongodb://localhost:27017" -ForegroundColor White
}

Read-Host "Press Enter to continue..."
