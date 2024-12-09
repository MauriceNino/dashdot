@echo off
:: Check for admin privileges
net session >nul 2>&1
if %errorlevel% neq 0 (
    echo Requesting administrative privileges...
    powershell -Command "Start-Process '%~dpnx0' -Verb RunAs"
    exit /b
)

setlocal EnableDelayedExpansion

:menu
cls
echo ====================================
echo         DASHDOT MANAGER
echo ====================================
echo.
echo 1. Start Dashdot
echo 2. Install Dashdot
echo 3. Update Dashdot
echo.
echo Starting automatically in 10 seconds...
echo.
choice /C 123 /T 10 /D 1 /M "Please select an option: "

if errorlevel 3 goto update
if errorlevel 2 goto install
if errorlevel 1 goto start

:install
cls
echo Installing Dashdot...
echo.

REM Check if git is installed
where git >nul 2>&1
if %errorlevel% neq 0 (
    echo Error: Git is not installed!
    echo Please install Git from https://git-scm.com/
    pause
    goto menu
)

REM Check if yarn is installed
where yarn >nul 2>&1
if %errorlevel% neq 0 (
    echo Error: Yarn is not installed!
    echo Please install Yarn from https://yarnpkg.com/
    pause
    goto menu
)

git clone https://github.com/MauriceNino/dashdot ^
    && cd dashdot ^
    && yarn ^
    && yarn build:prod

if %errorlevel% neq 0 (
    echo Installation failed!
    pause
    goto menu
)

echo.
echo Installation completed successfully!
pause
goto menu

:start
cls
echo Starting Dashdot...
echo.

REM Check if speedtest license is accepted
speedtest --accept-license >nul 2>&1

cd dashdot
set DASHDOT_PORT=3331
set DASHDOT_WIDGET_LIST=os,cpu,storage,ram,network,gpu
yarn start

if %errorlevel% neq 0 (
    echo Failed to start Dashdot!
    pause
    goto menu
)

goto menu

:update
cls
echo Updating Dashdot...
echo.

cd dashdot
git pull --rebase ^
    && yarn ^
    && yarn build:prod

if %errorlevel% neq 0 (
    echo Update failed!
    pause
    goto menu
)

echo.
echo Update completed successfully!
pause
goto menu 