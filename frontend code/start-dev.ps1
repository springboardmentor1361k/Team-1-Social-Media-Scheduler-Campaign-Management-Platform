# SocialPilot Dev Starter Script for Windows PowerShell

Write-Host "--------------------------------------------------------" -ForegroundColor Cyan
Write-Host "Starting SocialPilot Integration Platform..." -ForegroundColor Cyan
Write-Host "--------------------------------------------------------" -ForegroundColor Cyan

# 1. Verify Node.js
if (-not (Get-Command npm -ErrorAction SilentlyContinue)) {
    Write-Host "[ERROR] npm not found. Please install Node.js before running." -ForegroundColor Red
    Exit 1
}

# 2. Verify Python
if (-not (Get-Command python -ErrorAction SilentlyContinue)) {
    Write-Host "[ERROR] Python not found. Please verify python is in your PATH." -ForegroundColor Red
    Exit 1
}

# 3. Handle Python Virtual Environment
if (-not (Test-Path "venv")) {
    Write-Host "[INFO] Creating Python virtual environment (venv)..." -ForegroundColor Yellow
    python -m venv venv
}

Write-Host "[INFO] Activating virtual environment and verifying requirements..." -ForegroundColor Yellow
& .\venv\Scripts\pip.exe install -r backend\requirements.txt

# 4. Check and install Node.js dependencies
if (-not (Test-Path "node_modules")) {
    Write-Host "[INFO] Installing root devDependencies..." -ForegroundColor Yellow
    npm install
}

if (-not (Test-Path "frontend\node_modules")) {
    Write-Host "[INFO] Installing frontend React dependencies..." -ForegroundColor Yellow
    npm install --prefix frontend
}

# 5. Start concurrent developer servers using the venv python
Write-Host ""
Write-Host "[SUCCESS] Scaffolding checks complete. Launching services..." -ForegroundColor Green
Write-Host " - Frontend will bind to http://localhost:3000" -ForegroundColor Green
Write-Host " - Backend API will bind to http://localhost:8000" -ForegroundColor Green
Write-Host ""

# Update PATH to prioritize virtual environment's Python/Scripts
$env:PATH = "$(Get-Item .\venv\Scripts).FullName;$env:PATH"

npm run dev
