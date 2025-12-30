@echo off
REM Sound - Audio Visualizer & Transcription System
REM Automated Setup Script for Windows

echo ========================================
echo Sound - Audio Visualizer Setup
echo ========================================
echo.

REM Check Node.js
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [X] Node.js is not installed
    echo     Please install Node.js v18+ from https://nodejs.org/
    exit /b 1
) else (
    for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
    echo [OK] Node.js is installed: %NODE_VERSION%
)

REM Check npm
where npm >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [X] npm is not installed
    echo     npm should come with Node.js
    exit /b 1
) else (
    for /f "tokens=*" %%i in ('npm --version') do set NPM_VERSION=%%i
    echo [OK] npm is installed: v%NPM_VERSION%
)

REM Check Java
where java >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [X] Java is not installed
    echo     Please install Java JDK 17+ from https://adoptium.net/
    exit /b 1
) else (
    echo [OK] Java is installed
)

REM Check Maven
where mvn >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [X] Maven is not installed
    echo     Please install Maven 3.6+ from https://maven.apache.org/download.cgi
    exit /b 1
) else (
    echo [OK] Maven is installed
)

echo.
echo ========================================
echo Installing Dependencies
echo ========================================
echo.

REM Setup backend
echo Setting up backend...
if not exist "backend" (
    echo [X] backend directory not found
    echo     Make sure you're running this script from the project root directory
    exit /b 1
)
cd backend
echo Running: mvn clean install
call mvn clean install -DskipTests
if %ERRORLEVEL% NEQ 0 (
    echo [X] Backend setup failed
    cd ..
    exit /b 1
)
echo [OK] Backend dependencies installed successfully
cd ..

echo.

REM Setup frontend
echo Setting up frontend...
if not exist "frontend" (
    echo [X] frontend directory not found
    echo     Make sure you're running this script from the project root directory
    exit /b 1
)
cd frontend
echo Running: npm install
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo [X] Frontend setup failed
    cd ..
    exit /b 1
)
echo [OK] Frontend dependencies installed successfully
cd ..

echo.
echo ========================================
echo Setup Complete! 🎉
echo ========================================
echo.
echo Next steps:
echo.
echo 1. Start the backend (Terminal 1):
echo    cd backend
echo    mvn spring-boot:run
echo.
echo 2. Start the frontend (Terminal 2):
echo    cd frontend
echo    npm run dev
echo.
echo 3. Open your browser:
echo    http://localhost:5173
echo.
echo Optional: Set Gemini API key for real transcription:
echo    set GEMINI_API_KEY=your_api_key_here
echo.
echo For more details, see RUN_INSTRUCTIONS.md
echo.
