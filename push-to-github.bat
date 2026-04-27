@echo off
setlocal EnableDelayedExpansion
title NutriLens - Push to GitHub

echo ============================================================
echo  NutriLens - Push to GitHub (public repo)
echo ============================================================
echo.

cd /d "%~dp0"

:: Check git
git --version >nul 2>&1
if errorlevel 1 (
    echo  ERROR: git not found. Install from https://git-scm.com
    pause & exit /b 1
)

:: Check gh CLI
gh --version >nul 2>&1
if errorlevel 1 (
    echo  ERROR: GitHub CLI not found. Install from https://cli.github.com
    pause & exit /b 1
)

:: Init git if not already
if not exist ".git" (
    echo Initializing git repo...
    git init
    git branch -M main
)

:: Create .gitignore entries for secrets
echo Ensuring secrets are gitignored...
findstr /C:".env.local" .gitignore >nul 2>&1 || echo .env.local>>.gitignore

:: Stage everything
echo.
echo Staging files...
git add -A
git status --short

echo.
set /p COMMIT_MSG=Enter commit message (or press Enter for default):
if "%COMMIT_MSG%"=="" set COMMIT_MSG=feat: NutriLens - AI food coach for AMD Slingshot Hackathon

git commit -m "%COMMIT_MSG%"

:: Create or push to GitHub
echo.
git remote get-url origin >nul 2>&1
if errorlevel 1 (
    echo Creating public GitHub repo nutrilens...
    gh repo create nutrilens --public --push --source=. --description "NutriLens - AI food coach powered by Gemini. AMD Slingshot Hackathon submission."
) else (
    echo Pushing to existing remote...
    git push origin main
)

echo.
echo ============================================================
for /f "tokens=*" %%u in ('gh repo view --json url -q .url 2^>nul') do echo  GitHub: %%u
echo  Deployment will auto-trigger on Cloud Run via GitHub Actions
echo ============================================================
pause
