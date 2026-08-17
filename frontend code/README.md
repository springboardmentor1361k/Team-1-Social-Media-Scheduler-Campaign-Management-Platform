# SocialPilot Integrated Dashboard Project

This workspace integrates a **FastAPI Python Backend** with a **Vite + React + Tailwind CSS Frontend** into a single, unified development repository.

## System Architecture

- **Frontend**: Single Page Application built on React, Vite, and Tailwind CSS. Configured to run on port `3000`.
- **Backend API**: FastAPI REST framework configured to run on port `8000`. Connected to a local SQLite database (`socialpilot.db`) using SQLAlchemy.
- **Communication Protocol**:
  - The frontend uses **Axios** to communicate with the backend at `http://localhost:8000`.
  - The API endpoint is dynamically configurable. The frontend uses `import.meta.env.VITE_API_BASE_URL` which is set to `http://localhost:8000` during development via `.env.development`.
  - CORS is handled in the FastAPI server (`backend/app/main.py`) which explicitly permits origins from port `3000` and `3001`.

---

## Directory Structure

```text
frontend code/
├── backend/                  # FastAPI Application
│   ├── app/
│   │   ├── models/           # SQLAlchemy DB Models
│   │   ├── routers/          # API endpoints (auth, scheduler, social-accounts, etc.)
│   │   ├── utils/            # Security, JWT helpers
│   │   └── main.py           # FastAPI server entry point
│   ├── requirements.txt      # Python dependencies
│   └── socialpilot.db        # SQLite database
├── frontend/                 # React Application
│   ├── src/
│   │   ├── services/
│   │   │   └── api.js        # Axios instance with dynamic base URL
│   │   │   └── authService.js# Signup, Login, and Session management
│   │   └── App.jsx           # Main React Dashboard container
│   ├── package.json          # Node scripts and dependencies for React
│   └── .env.development      # API base URL configuration variable
├── package.json              # Root orchestration package for concurrently running scripts
└── start-dev.ps1             # PowerShell starter script for one-click initialization & execution
```

---

## Prerequisites

Make sure you have the following installed on your machine:
1. **Node.js** (v18+)
2. **Python** (3.10+) with `pip` and `venv` enabled

---

## Launch Instructions

### Option A: Automatic Scaffolding & Launch (PowerShell - Windows)

The easiest way to set up and run the application locally is using the `start-dev.ps1` script:

1. Open PowerShell and navigate to the project directory:
   ```powershell
   cd "C:\Users\DELL\Desktop\frontend code"
   ```
2. Run the script:
   ```powershell
   ./start-dev.ps1
   ```
   *This will automatically:*
   - Create a local Python virtual environment (`venv`) if it doesn't exist.
   - Install all Python backend libraries from `backend/requirements.txt`.
   - Install root-level dev dependencies (`concurrently`).
   - Install React frontend dependencies.
   - Launch both the React Frontend (port `3000`) and the FastAPI Backend (port `8000`) concurrently.

---

### Option B: Manual Cross-Platform Launch (macOS, Linux, Windows CMD)

If you are not using PowerShell, follow these manual steps:

#### 1. Setup Backend
Open a terminal in the project root:
```bash
# 1. Create a Python virtual environment
python -m venv venv

# 2. Activate the virtual environment
# On macOS/Linux:
source venv/bin/activate
# On Windows CMD:
venv\Scripts\activate.bat

# 3. Install packages
pip install -r backend/requirements.txt
```

#### 2. Setup Frontend and Root Node dependencies
In another terminal (or inside the same project root):
```bash
# Install root orchestration tools
npm install

# Install frontend dependencies
npm run install:all
```

#### 3. Launch Development Servers
With the Python virtual environment active in your shell (or by pointing to it):
```bash
npm run dev
```
Both servers will start concurrently.
- Frontend: `http://localhost:3000`
- Backend API: `http://localhost:8000`

---

## Verification & Features

Once the servers are running, access `http://localhost:3000` in your web browser. 

1. **User Authentication**:
   - Register a new user at `/register`.
   - Log in at `/login`. This sends form credentials to FastAPI's OAuth2 router and retrieves a JWT access token.
2. **Dashboard & Social Accounts**:
   - Connect and manage social channels (Twitter/X, Facebook, Instagram, LinkedIn, etc.) directly linked to the DB.
3. **Scheduler**:
   - Queue up, schedule, and delete posts. Content list is synced in real-time with the database.
