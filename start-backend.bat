@echo off
setlocal enabledelayedexpansion

echo ╔════════════════════════════════════════════╗
echo ║  Pilgrim Fitness Tracker - Quick Start    ║
echo ╚════════════════════════════════════════════╝
echo.

REM Check if .env exists
if not exist .env (
    echo [WARNING] .env file not found. Creating from template...
    if exist .env.example (
        copy .env.example .env
        echo [SUCCESS] .env file created from .env.example
        echo [WARNING] Please edit .env and set your configurations
    ) else (
        echo [ERROR] .env.example not found. Please create .env manually
        pause
        exit /b 1
    )
)

REM Check if node_modules exists
if not exist node_modules (
    echo [INFO] Installing dependencies...
    call npm install
    if !errorlevel! equ 0 (
        echo [SUCCESS] Dependencies installed successfully
    ) else (
        echo [ERROR] Failed to install dependencies
        pause
        exit /b 1
    )
)

REM Check if MongoDB is running
echo [INFO] Checking MongoDB connection...
where mongosh >nul 2>&1
if !errorlevel! equ 0 (
    mongosh --eval "db.version()" --quiet >nul 2>&1
    if !errorlevel! equ 0 (
        echo [SUCCESS] MongoDB is running
    ) else (
        echo [WARNING] MongoDB is not running
        echo           Please start MongoDB first as a Windows service
        echo.
        set /p CONTINUE="Start backend anyway? (Y/N): "
        if /i not "!CONTINUE!"=="Y" exit /b 1
    )
) else (
    echo [WARNING] mongosh not found. Cannot verify MongoDB status
)

REM Start the backend
echo.
echo [INFO] Starting backend server...
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo.

if "%NODE_ENV%"=="production" (
    call npm start
) else (
    echo [TIP] Use 'npm run dev' for auto-reload during development
    call npm start
)

pause
