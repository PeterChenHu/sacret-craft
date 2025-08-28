@echo off
chcp 65001 >nul
echo 🚀 Sacred Craft Marketplace - Quick Start
echo ==========================================

REM Check if we're in the right directory
if not exist "frontend\package.json" (
    echo ❌ Please run this script from the project root directory
    pause
    exit /b 1
)

if not exist "backend" (
    echo ❌ Please run this script from the project root directory
    pause
    exit /b 1
)

echo 🔍 Checking prerequisites...

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js is not installed. Please install Node.js 18+ first.
    pause
    exit /b 1
)

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Python is not installed. Please install Python 3.11+ first.
    pause
    exit /b 1
)

echo ✅ Prerequisites check passed

echo 📦 Installing frontend dependencies...
cd frontend
call npm install

echo 🔨 Building frontend...
call npm run build

echo 🐍 Setting up Python virtual environment...
cd ..\backend
if not exist "venv" (
    python -m venv venv
)
call venv\Scripts\activate.bat

echo 📦 Installing backend dependencies...
python -m pip install --upgrade pip
pip install -r requirements.txt

REM Create .env file if it doesn't exist
if not exist ".env" (
    echo ⚙️ Creating .env file...
    copy "..\pipeline\scripts\env.example" ".env"
    echo 📝 Please edit .env file with your configuration
    echo    Then run this script again
    pause
    exit /b 0
)

echo 🗄️ Running database migrations...
python manage.py migrate

echo 📁 Collecting static files...
python manage.py collectstatic --noinput

echo 👤 Creating superuser...
echo Please enter details for the admin user:
python manage.py createsuperuser

echo 🚀 Starting development server...
echo Frontend: http://localhost:5173
echo Backend: http://localhost:8000
echo.
echo Press Ctrl+C to stop the server

REM Start backend server
start "Backend Server" cmd /k "cd backend && venv\Scripts\activate.bat && python manage.py runserver 0.0.0.0:8000"

REM Go back to root and start frontend
cd ..\frontend
start "Frontend Server" cmd /k "npm run dev"

echo 🎉 Both servers are starting in new windows!
echo    Frontend: http://localhost:5173
echo    Backend: http://localhost:8000
pause
