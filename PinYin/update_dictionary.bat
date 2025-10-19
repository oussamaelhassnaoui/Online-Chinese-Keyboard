@echo off
echo Updating CC-CEDICT Dictionary...
echo ==============================
echo This script will download and parse the latest CC-CEDICT dictionary
echo and generate a new cedict.json file for the Pinyin converter.
echo.

REM Check if Node.js is available
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo Error: Node.js is not installed or not in PATH
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

REM Run the parser script
echo Running parser script...
node update_dictionary.js

if %errorlevel% equ 0 (
    echo.
    echo Dictionary update completed successfully!
    echo The new cedict.json file has been created.
) else (
    echo.
    echo Error updating dictionary. Please check the error messages above.
)

pause