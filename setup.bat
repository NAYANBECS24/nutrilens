@echo off
setlocal
title NutriLens Setup

echo ============================================================
echo  NutriLens - Google Cloud + Firebase Setup
echo ============================================================
echo.

:: --- 1. Check Node.js ---
echo [1/8] Checking Node.js...
node --version >nul 2>&1
if errorlevel 1 (
    echo  ERROR: Node.js not found. Install from https://nodejs.org
    pause
    exit /b 1
)
echo  Found Node.js:
node --version

:: --- 2. Check / install pnpm ---
:: pnpm is a .cmd file - must use "call" or it eats the rest of the script
echo.
echo [2/8] Checking pnpm...
call pnpm --version >nul 2>&1
if errorlevel 1 (
    echo  pnpm not found. Installing...
    call npm install -g pnpm
) else (
    echo  Found pnpm:
    call pnpm --version
)

:: --- 3. Check / install Firebase CLI ---
:: firebase is also a .cmd file - always use "call"
echo.
echo [3/8] Checking Firebase CLI...
call firebase --version >nul 2>&1
if errorlevel 1 (
    echo  Firebase CLI not found. Installing...
    call npm install -g firebase-tools
) else (
    echo  Found firebase:
    call firebase --version
)

:: --- 4. Check / install gcloud ---
echo.
echo [4/8] Checking Google Cloud SDK...

set "GCLOUD_BIN1=%LOCALAPPDATA%\Google\Cloud SDK\google-cloud-sdk\bin"
set "GCLOUD_BIN2=C:\Program Files (x86)\Google\Cloud SDK\google-cloud-sdk\bin"
set "GCLOUD_BIN3=C:\Program Files\Google\Cloud SDK\google-cloud-sdk\bin"

if exist "%GCLOUD_BIN1%\gcloud.cmd" set "PATH=%PATH%;%GCLOUD_BIN1%"
if exist "%GCLOUD_BIN2%\gcloud.cmd" set "PATH=%PATH%;%GCLOUD_BIN2%"
if exist "%GCLOUD_BIN3%\gcloud.cmd" set "PATH=%PATH%;%GCLOUD_BIN3%"

call gcloud --version >nul 2>&1
if errorlevel 1 (
    echo  gcloud not found. Installing via winget...
    winget install --id Google.CloudSDK --silent --accept-package-agreements --accept-source-agreements
    echo.
    echo  !! gcloud installed. Open a NEW Command Prompt and run setup.bat again !!
    pause
    exit /b 0
) else (
    echo  Found gcloud:
    call gcloud --version 2>nul | findstr /i "SDK"
)

:: --- 5. Set GCP project ---
echo.
echo [5/8] Setting GCP project...
call gcloud config set project hack2skill-494608
call gcloud config set run/region asia-south1
echo  Project set to: hack2skill-494608

:: --- 6. Auth + ADC ---
echo.
echo [6/8] Google sign-in (browser will open twice)...
echo  1st = your developer account  /  2nd = Application Default Credentials
echo.
call gcloud auth login
call gcloud auth application-default login

:: --- 7. Enable APIs ---
echo.
echo [7/8] Enabling required GCP APIs (takes about 1 minute)...
call gcloud services enable ^
    run.googleapis.com ^
    cloudbuild.googleapis.com ^
    artifactregistry.googleapis.com ^
    speech.googleapis.com ^
    vision.googleapis.com ^
    aiplatform.googleapis.com ^
    firestore.googleapis.com ^
    firebase.googleapis.com ^
    --project hack2skill-494608

echo  Creating Artifact Registry repo for Docker images...
call gcloud artifacts repositories create nutrilens ^
    --repository-format=docker ^
    --location=asia-south1 ^
    --description="NutriLens Docker images" ^
    --project hack2skill-494608 2>nul
echo  Artifact Registry ready.

:: --- 8. Firebase login ---
echo.
echo [8/8] Firebase login + link project...
call firebase login
call firebase use hack2skill-494608 --add

:: --- Install deps ---
echo.
echo Installing Node dependencies...
cd /d "%~dp0apps\web"
call pnpm install

echo.
echo ============================================================
echo  Setup complete!
echo.
echo  NEXT STEPS:
echo  1. Open apps\web\.env.local and fill in your keys:
echo       NEXT_PUBLIC_FIREBASE_API_KEY=
echo       NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
echo       NEXT_PUBLIC_FIREBASE_PROJECT_ID=
echo       NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
echo       NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
echo       NEXT_PUBLIC_FIREBASE_APP_ID=
echo       GEMINI_API_KEY=
echo.
echo     Firebase keys: Firebase Console ^> Project Settings ^> Web app
echo     Gemini key:    https://aistudio.google.com/apikey
echo.
echo  2. run-local.bat      - test at http://localhost:3000
echo  3. deploy.bat         - deploy to Cloud Run
echo  4. push-to-github.bat - push to GitHub (auto-deploys on each push)
echo ============================================================
pause
