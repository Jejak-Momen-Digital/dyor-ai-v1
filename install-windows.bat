@echo off
echo ========================================
echo     Dyor AI Installation Script
echo     Windows Version
echo ========================================
echo.

:: Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Python is not installed or not in PATH
    echo Please install Python 3.11+ from https://python.org/downloads
    echo Make sure to check "Add Python to PATH" during installation
    pause
    exit /b 1
)

:: Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Node.js is not installed or not in PATH
    echo Please install Node.js 20+ from https://nodejs.org/download
    pause
    exit /b 1
)

echo ✓ Python and Node.js are installed
echo.

:: Create project directory
echo Creating project directory...
if not exist "dyor-ai" mkdir dyor-ai
cd dyor-ai

:: Download or clone source code
echo Downloading source code...
if exist ".git" (
    echo Updating existing repository...
    git pull
) else (
    echo Cloning repository...
    git clone https://github.com/FoundationAgents/OpenManus.git .
    if errorlevel 1 (
        echo ERROR: Failed to clone repository
        echo Please check your internet connection
        pause
        exit /b 1
    )
)

:: Setup backend
echo.
echo Setting up backend...
cd backend

:: Create virtual environment
echo Creating virtual environment...
python -m venv venv
if errorlevel 1 (
    echo ERROR: Failed to create virtual environment
    pause
    exit /b 1
)

:: Activate virtual environment
echo Activating virtual environment...
call venv\Scripts\activate.bat

:: Install Python dependencies
echo Installing Python dependencies...
pip install -r requirements.txt
if errorlevel 1 (
    echo ERROR: Failed to install Python dependencies
    pause
    exit /b 1
)

:: Setup frontend
echo.
echo Setting up frontend...
cd ..\frontend

:: Install Node.js dependencies
echo Installing Node.js dependencies...
npm install
if errorlevel 1 (
    echo ERROR: Failed to install Node.js dependencies
    pause
    exit /b 1
)

:: Build frontend
echo Building frontend for production...
npm run build
if errorlevel 1 (
    echo ERROR: Failed to build frontend
    pause
    exit /b 1
)

:: Copy build to backend static
echo Copying frontend build to backend...
xcopy dist\* ..\backend\src\static\ /E /I /Y
if errorlevel 1 (
    echo ERROR: Failed to copy frontend build
    pause
    exit /b 1
)

:: Create startup script
echo.
echo Creating startup script...
cd ..
echo @echo off > start-dyor-ai.bat
echo echo Starting Dyor AI... >> start-dyor-ai.bat
echo cd backend >> start-dyor-ai.bat
echo call venv\Scripts\activate.bat >> start-dyor-ai.bat
echo echo Dyor AI is starting... >> start-dyor-ai.bat
echo echo Open your browser and go to: http://localhost:5000 >> start-dyor-ai.bat
echo timeout /t 3 >> start-dyor-ai.bat
echo start http://localhost:5000 >> start-dyor-ai.bat
echo python src\main.py >> start-dyor-ai.bat

:: Create desktop shortcut
echo Creating desktop shortcut...
set "shortcut=%USERPROFILE%\Desktop\Dyor AI.lnk"
powershell -Command "$WshShell = New-Object -comObject WScript.Shell; $Shortcut = $WshShell.CreateShortcut('%shortcut%'); $Shortcut.TargetPath = '%CD%\start-dyor-ai.bat'; $Shortcut.WorkingDirectory = '%CD%'; $Shortcut.IconLocation = '%CD%\backend\src\static\favicon.ico'; $Shortcut.Save()"

echo.
echo ========================================
echo     Installation Complete!
echo ========================================
echo.
echo Dyor AI has been successfully installed!
echo.
echo To start Dyor AI:
echo 1. Double-click "Dyor AI" shortcut on your desktop
echo 2. Or run: start-dyor-ai.bat
echo 3. Or manually: cd backend ^&^& venv\Scripts\activate ^&^& python src\main.py
echo.
echo The application will open in your browser at:
echo http://localhost:5000
echo.
echo Starting Dyor AI now...
timeout /t 3
call start-dyor-ai.bat

