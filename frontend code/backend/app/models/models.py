import datetime
import uuid

from sqlalchemy import Column, String, DateTime, Float, Text, ForeignKey, Boolean, Integer
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship

from app.database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True, index=True)
    username = Column(String, unique=True, nullable=False)
    email = Column(String, unique=True, nullable=False)
    password = Column(String, nullable=False)
    phone = Column(String, nullable=True)
    company_name = Column(String, nullable=True)
    avatar = Column(String, nullable=True)
    role = Column(String, default="Content Creator")
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    # Relationships
    social_accounts = relationship("SocialAccount", back_populates="user", cascade="all, delete-orphan")
    campaigns = relationship("Campaign", back_populates="user", cascade="all, delete-orphan")
    posts = relationship("Post", back_populates="user", cascade="all, delete-orphan")
    notifications = relationship("Notification", back_populates="user", cascade="all, delete-orphan")


class SocialAccount(Base):
    __tablename__ = "social_accounts"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    user_id = Column(String, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    platform = Column(String, nullable=False)
    account_name = Column(String, nullable=False)
    account_id = Column(String, nullable=True)
    access_token = Column(Text, nullable=True)
    refresh_token = Column(Text, nullable=True)
    status = Column(String, default="Connected")
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(
        DateTime,
        default=datetime.datetime.utcnow,
        onupdate=datetime.datetime.utcnow,
    )

    # Relationships
    user = relationship("User", back_populates="social_accounts")


class Campaign(Base):
    __tablename__ = "campaigns"

    id = Column(String, primary_key=True, index=True)
    user_id = Column(String, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    name = Column(String, nullable=False)
    platform = Column(String, nullable=False)
    start_date = Column(String)
    end_date = Column(String)
    budget = Column(Float)
    objective = Column(String)
    performance = Column(String)
    status = Column(String, default="active")
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    # Relationships
    user = relationship("User", back_populates="campaigns")
    posts = relationship("Post", back_populates="campaign", cascade="all, delete-orphan")


class Post(Base):
    __tablename__ = "posts"

    id = Column(String, primary_key=True, index=True)
    user_id = Column(String, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    campaign_id = Column(String, ForeignKey("campaigns.id", ondelete="SET NULL"), nullable=True)
    platform = Column(String, nullable=False)
    content = Column(Text, nullable=False)
    caption = Column(Text, nullable=True)  # Alias/support for spec
    media_url = Column(String, nullable=True)
    media_type = Column(String, nullable=True)
    status = Column(String, default="scheduled")  # draft, scheduled, published, failed
    scheduled_time = Column(String, nullable=True)  # String matching frontend date/time format
    scheduled_at = Column(DateTime, nullable=True)  # Support for spec
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    # Relationships
    user = relationship("User", back_populates="posts")
    campaign = relationship("Campaign", back_populates="posts")
    analytics = relationship("Analytics", back_populates="post", cascade="all, delete-orphan")


class Analytics(Base):
    __tablename__ = "analytics"

    id = Column(String, primary_key=True, index=True)
    post_id = Column(String, ForeignKey("posts.id", ondelete="CASCADE"), nullable=True)
    platform = Column(String, nullable=False)
    likes = Column(Integer, default=0)
    comments = Column(Integer, default=0)
    shares = Column(Integer, default=0)
    reach = Column(Integer, default=0)
    impressions = Column(Integer, default=0)
    clicks = Column(Integer, default=0)
    recorded_at = Column(DateTime, default=datetime.datetime.utcnow)

    # Relationships
    post = relationship("Post", back_populates="analytics")


class Notification(Base):
    __tablename__ = "notifications"

    id = Column(String, primary_key=True, index=True)
    user_id = Column(String, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    title = Column(String, nullable=True)
    message = Column(Text, nullable=False)
    type = Column(String, default="info")  # success, info, warning, error
    is_read = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    # Relationships
    user = relationship("User", back_populates="notifications")