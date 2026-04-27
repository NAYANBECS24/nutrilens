@echo off
setlocal EnableDelayedExpansion
title NutriLens - Deploy to Cloud Run

echo ============================================================
echo  NutriLens - Deploy to Cloud Run (asia-south1)
echo ============================================================
echo.

set "PROJECT_ID=hack2skill-494608"
set "SERVICE_NAME=nutrilens-web"
set "REGION=asia-south1"
set "IMAGE=%REGION%-docker.pkg.dev/%PROJECT_ID%/nutrilens/%SERVICE_NAME%:latest"

:: Add gcloud to PATH if installed but not on PATH
set "GCLOUD_BIN1=%LOCALAPPDATA%\Google\Cloud SDK\google-cloud-sdk\bin"
set "GCLOUD_BIN2=C:\Program Files (x86)\Google\Cloud SDK\google-cloud-sdk\bin"
if exist "%GCLOUD_BIN1%\gcloud.cmd" set "PATH=%PATH%;%GCLOUD_BIN1%"
if exist "%GCLOUD_BIN2%\gcloud.cmd" set "PATH=%PATH%;%GCLOUD_BIN2%"

:: Check gcloud
call gcloud --version >nul 2>&1
if errorlevel 1 (
    echo  ERROR: gcloud not found. Run setup.bat first, then open a new terminal.
    pause
    exit /b 1
)

:: Check Docker
docker --version >nul 2>&1
if errorlevel 1 (
    echo  Docker not found. Will build with Cloud Build instead.
    set "USE_CLOUD_BUILD=1"
) else (
    set "USE_CLOUD_BUILD=0"
    echo  Docker found. Building locally.
)

echo.
echo [1/4] Setting project and region...
call gcloud config set project %PROJECT_ID%
call gcloud config set run/region %REGION%

echo.
echo [2/4] Configuring Docker auth for Artifact Registry...
call gcloud auth configure-docker %REGION%-docker.pkg.dev --quiet

echo.
cd /d "%~dp0apps\web"

if not exist ".env.local" (
    echo  ERROR: apps\web\.env.local not found.
    pause
    exit /b 1
)

for /f "usebackq tokens=1,* delims==" %%A in (".env.local") do (
    set "ENV_NAME=%%A"
    if not "!ENV_NAME!"=="" if not "!ENV_NAME:~0,1!"=="#" set "%%A=%%B"
)

set "BUILD_SUBS=_IMAGE=%IMAGE%,_NEXT_PUBLIC_FIREBASE_API_KEY=%NEXT_PUBLIC_FIREBASE_API_KEY%,_NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=%NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN%,_NEXT_PUBLIC_FIREBASE_PROJECT_ID=%NEXT_PUBLIC_FIREBASE_PROJECT_ID%,_NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=%NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET%,_NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=%NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID%,_NEXT_PUBLIC_FIREBASE_APP_ID=%NEXT_PUBLIC_FIREBASE_APP_ID%"
if "%GCP_LOCATION%"=="" set "GCP_LOCATION=asia-south1"
if "%VERTEX_AI_MODEL_VISION%"=="" set "VERTEX_AI_MODEL_VISION=gemini-2.5-pro"
if "%VERTEX_AI_MODEL_TEXT%"=="" set "VERTEX_AI_MODEL_TEXT=gemini-2.5-flash"
set "RUN_ENV=NEXT_PUBLIC_FIREBASE_API_KEY=%NEXT_PUBLIC_FIREBASE_API_KEY%,NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=%NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN%,NEXT_PUBLIC_FIREBASE_PROJECT_ID=%NEXT_PUBLIC_FIREBASE_PROJECT_ID%,NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=%NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET%,NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=%NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID%,NEXT_PUBLIC_FIREBASE_APP_ID=%NEXT_PUBLIC_FIREBASE_APP_ID%,GCP_PROJECT_ID=%PROJECT_ID%,GCP_LOCATION=%GCP_LOCATION%,VERTEX_AI_MODEL_VISION=%VERTEX_AI_MODEL_VISION%,VERTEX_AI_MODEL_TEXT=%VERTEX_AI_MODEL_TEXT%"
if not "%GEMINI_API_KEY%"=="" set "RUN_ENV=%RUN_ENV%,GEMINI_API_KEY=%GEMINI_API_KEY%"
if not "%FIREBASE_ADMIN_CREDENTIALS_BASE64%"=="" set "RUN_ENV=%RUN_ENV%,FIREBASE_ADMIN_CREDENTIALS_BASE64=%FIREBASE_ADMIN_CREDENTIALS_BASE64%"

if "%USE_CLOUD_BUILD%"=="1" (
    echo [3/4] Building with Cloud Build...
    call gcloud builds submit --config cloudbuild.yaml --substitutions "%BUILD_SUBS%" .
) else (
    echo [3/4] Building Docker image locally...
    docker build ^
        --build-arg NEXT_PUBLIC_FIREBASE_API_KEY="%NEXT_PUBLIC_FIREBASE_API_KEY%" ^
        --build-arg NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="%NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN%" ^
        --build-arg NEXT_PUBLIC_FIREBASE_PROJECT_ID="%NEXT_PUBLIC_FIREBASE_PROJECT_ID%" ^
        --build-arg NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="%NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET%" ^
        --build-arg NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="%NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID%" ^
        --build-arg NEXT_PUBLIC_FIREBASE_APP_ID="%NEXT_PUBLIC_FIREBASE_APP_ID%" ^
        -t "%IMAGE%" .
    echo  Pushing image to Artifact Registry...
    docker push "%IMAGE%"
)

echo.
echo [4/4] Deploying to Cloud Run...
call gcloud run deploy %SERVICE_NAME% ^
    --image "%IMAGE%" ^
    --region %REGION% ^
    --platform managed ^
    --allow-unauthenticated ^
    --memory 512Mi ^
    --cpu 1 ^
    --port 3000 ^
    --set-env-vars "%RUN_ENV%"

echo.
echo ============================================================
echo  Deployment complete!
for /f "tokens=*" %%U in ('call gcloud run services describe %SERVICE_NAME% --region %REGION% --format "value(status.url)" 2^>nul') do (
    echo  Live URL: %%U
)
echo ============================================================
pause
