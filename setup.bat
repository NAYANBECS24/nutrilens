@echo off
setlocal EnableDelayedExpansion
title NutriLens Setup

echo ============================================================
echo  NutriLens - Google Cloud + Firebase Setup
echo ============================================================
echo.

:: ── 1. Check Node.js ─────────────────────────────────────────
echo [1/8] Checking Node.js...
node --version >nul 2>&1
if errorlevel 1 (
    echo  ERROR: Node.js not found. Install from https://nodejs.org
    pause & exit /b 1
)
for /f "tokens=*" %%v in ('node --version') do echo  Found Node.js %%v

:: ── 2. Install pnpm if missing ────────────────────────────────
echo.
echo [2/8] Checking pnpm...
pnpm --version >nul 2>&1
if errorlevel 1 (
    echo  Installing pnpm...
    npm install -g pnpm
) else (
    for /f "tokens=*" %%v in ('pnpm --version') do echo  Found pnpm %%v
)

:: ── 3. Install Firebase CLI if missing ───────────────────────
echo.
echo [3/8] Checking Firebase CLI...
firebase --version >nul 2>&1
if errorlevel 1 (
    echo  Installing firebase-tools...
    npm install -g firebase-tools
) else (
    for /f "tokens=*" %%v in ('firebase --version') do echo  Found firebase %%v
)

:: ── 4. Install Google Cloud SDK if missing ───────────────────
echo.
echo [4/8] Checking Google Cloud SDK (gcloud)...

:: Try common gcloud install paths on Windows
set GCLOUD_PATH=
if exist "%LOCALAPPDATA%\Google\Cloud SDK\google-cloud-sdk\bin\gcloud.cmd" (
    set GCLOUD_PATH=%LOCALAPPDATA%\Google\Cloud SDK\google-cloud-sdk\bin\gcloud.cmd
)
if exist "C:\Program Files (x86)\Google\Cloud SDK\google-cloud-sdk\bin\gcloud.cmd" (
    set GCLOUD_PATH=C:\Program Files (x86)\Google\Cloud SDK\google-cloud-sdk\bin\gcloud.cmd
)

gcloud --version >nul 2>&1
if errorlevel 1 (
    if defined GCLOUD_PATH (
        echo  Found gcloud at: %GCLOUD_PATH%
        set PATH=%PATH%;%LOCALAPPDATA%\Google\Cloud SDK\google-cloud-sdk\bin
        doskey gcloud="%GCLOUD_PATH%" $*
    ) else (
        echo  gcloud not found. Installing via winget...
        winget install --id Google.CloudSDK --silent --accept-package-agreements --accept-source-agreements
        echo.
        echo  IMPORTANT: gcloud was just installed. Please:
        echo    1. Close this window
        echo    2. Open a NEW Command Prompt or PowerShell
        echo    3. Run setup.bat again
        pause
        exit /b 0
    )
) else (
    for /f "tokens=1,2" %%a in ('gcloud --version 2^>nul ^| findstr /i "SDK"') do echo  Found %%a %%b
)

:: ── 5. Set GCP project ───────────────────────────────────────
echo.
echo [5/8] Setting GCP project to hack2skill-494608...
gcloud config set project hack2skill-494608
gcloud config set run/region asia-south1

:: ── 6. Application Default Credentials ───────────────────────
echo.
echo [6/8] Setting up Application Default Credentials (ADC)...
echo  This will open your browser to sign in with your Google account.
echo  Sign in with the account that owns project hack2skill-494608
echo.
gcloud auth application-default login
gcloud auth login

:: ── 7. Enable required APIs ──────────────────────────────────
echo.
echo [7/8] Enabling required Google Cloud APIs...
gcloud services enable run.googleapis.com ^
    cloudbuild.googleapis.com ^
    artifactregistry.googleapis.com ^
    speech.googleapis.com ^
    vision.googleapis.com ^
    aiplatform.googleapis.com ^
    firestore.googleapis.com ^
    firebase.googleapis.com ^
    --project hack2skill-494608

:: Create Artifact Registry repo for Docker images
gcloud artifacts repositories create nutrilens ^
    --repository-format=docker ^
    --location=asia-south1 ^
    --description="NutriLens Docker images" ^
    --project hack2skill-494608 2>nul
echo  Artifact Registry repo ready.

:: ── 8. Firebase login + init ─────────────────────────────────
echo.
echo [8/8] Logging in to Firebase and linking project...
firebase login
firebase use hack2skill-494608 --add

:: ── Install npm deps ─────────────────────────────────────────
echo.
echo Installing project dependencies...
cd /d "%~dp0apps\web"
pnpm install

echo.
echo ============================================================
echo  Setup complete!
echo  Next steps:
echo    1. Fill in .env.local with your Firebase config values
echo       (get them from Firebase console > Project Settings)
echo    2. Add your Gemini API key to .env.local as GEMINI_API_KEY
echo    3. Run run-local.bat to test locally
echo    4. Run deploy.bat to deploy to Cloud Run
echo ============================================================
pause
