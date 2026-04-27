@echo off
setlocal EnableDelayedExpansion
title NutriLens - Deploy to Cloud Run

echo ============================================================
echo  NutriLens - Deploy to Cloud Run (asia-south1)
echo ============================================================
echo.

set PROJECT_ID=hack2skill-494608
set SERVICE_NAME=nutrilens-web
set REGION=asia-south1
set IMAGE=%REGION%-docker.pkg.dev/%PROJECT_ID%/nutrilens/%SERVICE_NAME%:latest

:: Check gcloud
gcloud --version >nul 2>&1
if errorlevel 1 (
    echo  ERROR: gcloud not found. Run setup.bat first.
    pause & exit /b 1
)

:: Check Docker
docker --version >nul 2>&1
if errorlevel 1 (
    echo  Docker not found. Using gcloud builds instead...
    set USE_CLOUD_BUILD=1
) else (
    set USE_CLOUD_BUILD=0
    echo  Docker found. Building locally.
)

echo.
echo [1/4] Setting project...
gcloud config set project %PROJECT_ID%
gcloud config set run/region %REGION%

echo.
echo [2/4] Configuring Docker auth for Artifact Registry...
gcloud auth configure-docker %REGION%-docker.pkg.dev --quiet

echo.
if "%USE_CLOUD_BUILD%"=="1" (
    echo [3/4] Building with Cloud Build and pushing...
    cd /d "%~dp0apps\web"
    gcloud builds submit --tag %IMAGE% .
) else (
    echo [3/4] Building Docker image locally...
    cd /d "%~dp0apps\web"
    docker build -t %IMAGE% .
    echo  Pushing image...
    docker push %IMAGE%
)

echo.
echo [4/4] Deploying to Cloud Run...

:: Load env vars from .env.local for deployment
set ENV_VARS=
for /f "tokens=1,2 delims==" %%a in ('findstr /v "^#" "%~dp0apps\web\.env.local"') do (
    if not "%%a"=="" if not "%%b"=="" (
        set ENV_VARS=!ENV_VARS!%%a=%%b,
    )
)
:: Remove trailing comma
if defined ENV_VARS set ENV_VARS=!ENV_VARS:~0,-1!

gcloud run deploy %SERVICE_NAME% ^
    --image %IMAGE% ^
    --region %REGION% ^
    --platform managed ^
    --allow-unauthenticated ^
    --memory 512Mi ^
    --cpu 1 ^
    --port 3000

echo.
echo ============================================================
echo  Deployment complete!
for /f "tokens=*" %%u in ('gcloud run services describe %SERVICE_NAME% --region %REGION% --format "value(status.url)" 2^>nul') do (
    echo  Live URL: %%u
)
echo ============================================================
pause
