@echo off
setlocal
title NutriLens - Local Dev

echo ============================================================
echo  NutriLens - Local Dev Server
echo ============================================================
echo.

cd /d "%~dp0apps\web"

if not exist "node_modules" (
    echo  node_modules missing. Installing dependencies...
    pnpm install
    echo.
)

echo  Starting at http://localhost:3000
echo  Press Ctrl+C to stop.
echo.
pnpm dev
