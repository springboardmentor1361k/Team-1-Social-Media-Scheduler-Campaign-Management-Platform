from pydantic import BaseModel
from typing import Optional, List
from uuid import UUID
from datetime import datetime


# -------------------------
# Social Account Schemas
# -------------------------

class SocialAccountBase(BaseModel):
    platform: str
    account_name: str
    account_id: Optional[str] = None


class SocialAccountCreate(SocialAccountBase):
    access_token: Optional[str] = None
    refresh_token: Optional[str] = None
    status: Optional[str] = "Connected"


class SocialAccountResponse(SocialAccountBase):
    id: UUID
    user_id: str
    status: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


# -------------------------
# User Schemas
# -------------------------

class UserCreate(BaseModel):
    username: str
    email: str
    password: str
    phone: Optional[str] = None
    company_name: Optional[str] = None


class UserLogin(BaseModel):
    email: str
    password: str


class UserResponse(BaseModel):
    id: str
    username: str
    email: str
    phone: Optional[str] = None
    company_name: Optional[str] = None
    avatar: Optional[str] = None
    role: str

    class Config:
        from_attributes = True


class UserUpdate(BaseModel):
    username: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    company_name: Optional[str] = None
    avatar: Optional[str] = None


class PasswordChangeRequest(BaseModel):
    currentPassword: str
    newPassword: str


# -------------------------
# Campaign Schemas
# -------------------------

class CampaignBase(BaseModel):
    name: str
    platform: str
    start_date: str
    end_date: str
    budget: float
    objective: str
    performance: Optional[str] = "Pending"
    status: Optional[str] = "active"


class CampaignCreate(CampaignBase):
    pass


class CampaignUpdate(CampaignBase):
    pass


class CampaignResponse(CampaignBase):
    id: str
    user_id: str

    class Config:
        from_attributes = True


# -------------------------
# Post (Scheduler) Schemas
# -------------------------

class PostBase(BaseModel):
    campaign_id: Optional[str] = None
    platform: str
    content: str
    media_url: Optional[str] = None
    media_type: Optional[str] = None
    scheduled_time: Optional[str] = None  # Frontend formats: YYYY-MM-DDTHH:MM:00
    status: Optional[str] = "scheduled"  # draft, scheduled, published, failed


class PostCreate(PostBase):
    pass


class PostUpdate(PostBase):
    pass


class PostResponse(PostBase):
    id: str
    user_id: str
    created_at: datetime

    class Config:
        from_attributes = True


# -------------------------
# Notification Schemas
# -------------------------

class NotificationResponse(BaseModel):
    id: str
    user_id: str
    title: Optional[str] = None
    message: str
    type: str  # success, info, warning, error
    read: bool  # Maps to database is_read
    created_at: datetime

    class Config:
        from_attributes = True


# -------------------------
# Analytics Schemas
# -------------------------

class AnalyticsKPI(BaseModel):
    value: str
    change: str
    trend: str


class AnalyticsOverviewResponse(BaseModel):
    overallSummary: dict
    monthlyGrowth: List[dict]
    engagementTimeline: List[dict]
    platformComparison: List[dict]
    engagementRates: List[dict]