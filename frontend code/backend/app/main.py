from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from  app.database import engine, Base
from app.routers.social_accounts import router as social_router
from app.routers.auth import router as auth_router
from app.routers.users import router as users_router
from app.routers.campaigns import router as campaigns_router
from app.routers.analytics import router as analytics_router
from app.routers.notifications import router as notifications_router
from app.routers.scheduler import router as scheduler_router
from app.routers.activity import router as activity_router
from app.routers.dashboard import router as dashboard_router
from app.routers.search import router as search_router

import os

origins = [
    "http://localhost:3000",
    "http://localhost:3001",
    "http://127.0.0.1:3000",
    "http://127.0.0.1:3001",
]

frontend_url = os.environ.get("FRONTEND_URL")
if frontend_url:
    origins.append(frontend_url)
    if frontend_url.endswith("/"):
        origins.append(frontend_url[:-1])
    else:
        origins.append(frontend_url + "/")

app = FastAPI(
    title="SocialPilot API",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create all tables
Base.metadata.create_all(bind=engine)

# Register Social Account Router
app.include_router(social_router)
app.include_router(auth_router)
app.include_router(users_router)
app.include_router(campaigns_router)
app.include_router(analytics_router)
app.include_router(notifications_router)
app.include_router(scheduler_router)
app.include_router(activity_router)
app.include_router(dashboard_router)
app.include_router(search_router)

@app.get("/")
def home():
    return {
        "message": "Welcome to SocialPilot Backend"
    }

@app.get("/health")
def health():
    return {
        "status": "ok"
    }
    