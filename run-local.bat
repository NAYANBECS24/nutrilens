@echo off
setlocal
title NutriLens - Local Dev Server

echo ============================================================
echo  NutriLens - Running Locally
echo ============================================================
echo.

:: Check .env.local has values
cd /d "%~dp0apps\web"
findstr /C:"NEXT_PUBLIC_FIREBASE_API_KEY=" .env.local >nul 2>&1
if errorlevel 1 (
    echo  WARNING: .env.local not found. Copy .env.example to .env.local and fill in values.
    echo.
)

:: Check if node_modules exist
if not exist "node_modules" (
    echo  Installing dependencies...
    pnpm install
    echo.
)

echo  Starting dev server at http://localhost:3000
echo  Press Ctrl+C to stop
echo.
pnpm dev
