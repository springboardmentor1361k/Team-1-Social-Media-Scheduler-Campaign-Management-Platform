import uuid
from sqlalchemy.orm import Session
from sqlalchemy import and_

from app.models.models import SocialAccount, Campaign, User, Post, Notification, Analytics
from app.schemas import (
    SocialAccountCreate, 
    CampaignCreate, 
    CampaignUpdate, 
    PostCreate, 
    PostUpdate
)


# -------------------------
# Social Account CRUD
# -------------------------

def create_social_account(db: Session, account: SocialAccountCreate, user_id: str):
    db_account = SocialAccount(
        user_id=user_id,
        platform=account.platform,
        account_name=account.account_name,
        account_id=account.account_id,
        access_token=account.access_token,
        refresh_token=account.refresh_token,
        status=account.status or "Connected",
    )
    db.add(db_account)
    db.commit()
    db.refresh(db_account)
    return db_account


def get_social_accounts(db: Session, user_id: str):
    return db.query(SocialAccount).filter(SocialAccount.user_id == user_id).all()


def get_social_account(db: Session, account_id, user_id: str):
    return db.query(SocialAccount).filter(
        and_(SocialAccount.id == account_id, SocialAccount.user_id == user_id)
    ).first()


def delete_social_account(db: Session, account_id, user_id: str):
    account = db.query(SocialAccount).filter(
        and_(SocialAccount.id == account_id, SocialAccount.user_id == user_id)
    ).first()

    if account:
        db.delete(account)
        db.commit()

    return account


# -------------------------
# Campaign CRUD
# -------------------------

def create_campaign(db: Session, campaign: CampaignCreate, user_id: str):
    db_campaign = Campaign(
        id=str(uuid.uuid4()),
        user_id=user_id,
        name=campaign.name,
        platform=campaign.platform,
        start_date=campaign.start_date,
        end_date=campaign.end_date,
        budget=campaign.budget,
        objective=campaign.objective,
        performance=campaign.performance,
        status=campaign.status or "active",
    )
    db.add(db_campaign)
    db.commit()
    db.refresh(db_campaign)
    return db_campaign


def get_campaigns(db: Session, user_id: str):
    return db.query(Campaign).filter(Campaign.user_id == user_id).all()


def get_campaign(db: Session, campaign_id: str, user_id: str):
    return db.query(Campaign).filter(
        and_(Campaign.id == campaign_id, Campaign.user_id == user_id)
    ).first()


def update_campaign(db: Session, campaign_id: str, campaign: CampaignUpdate, user_id: str):
    db_campaign = db.query(Campaign).filter(
        and_(Campaign.id == campaign_id, Campaign.user_id == user_id)
    ).first()

    if not db_campaign:
        return None

    db_campaign.name = campaign.name
    db_campaign.platform = campaign.platform
    db_campaign.start_date = campaign.start_date
    db_campaign.end_date = campaign.end_date
    db_campaign.budget = campaign.budget
    db_campaign.objective = campaign.objective
    db_campaign.performance = campaign.performance
    db_campaign.status = campaign.status

    db.commit()
    db.refresh(db_campaign)
    return db_campaign


def delete_campaign(db: Session, campaign_id: str, user_id: str):
    campaign = db.query(Campaign).filter(
        and_(Campaign.id == campaign_id, Campaign.user_id == user_id)
    ).first()

    if campaign:
        db.delete(campaign)
        db.commit()

    return campaign


# -------------------------
# Post (Scheduler) CRUD
# -------------------------

def create_post(db: Session, post: PostCreate, user_id: str):
    db_post = Post(
        id=str(uuid.uuid4()),
        user_id=user_id,
        campaign_id=post.campaign_id,
        platform=post.platform,
        content=post.content,
        caption=post.content,  # Sync caption for spec compatibility
        media_url=post.media_url,
        media_type=post.media_type,
        status=post.status or "scheduled",
        scheduled_time=post.scheduled_time,
    )
    db.add(db_post)
    db.commit()
    db.refresh(db_post)
    return db_post


def get_posts(db: Session, user_id: str):
    return db.query(Post).filter(Post.user_id == user_id).all()


def get_post(db: Session, post_id: str, user_id: str):
    return db.query(Post).filter(
        and_(Post.id == post_id, Post.user_id == user_id)
    ).first()


def update_post(db: Session, post_id: str, post: PostUpdate, user_id: str):
    db_post = db.query(Post).filter(
        and_(Post.id == post_id, Post.user_id == user_id)
    ).first()

    if not db_post:
        return None

    db_post.campaign_id = post.campaign_id
    db_post.platform = post.platform
    db_post.content = post.content
    db_post.caption = post.content  # Keep synced
    db_post.media_url = post.media_url
    db_post.media_type = post.media_type
    db_post.status = post.status
    db_post.scheduled_time = post.scheduled_time

    db.commit()
    db.refresh(db_post)
    return db_post


def delete_post(db: Session, post_id: str, user_id: str):
    post = db.query(Post).filter(
        and_(Post.id == post_id, Post.user_id == user_id)
    ).first()

    if post:
        db.delete(post)
        db.commit()

    return post


# ----------------------------
# Notification CRUD
# ----------------------------

def create_notification(db: Session, user_id: str, title: str, message: str, type: str = "info"):
    db_notification = Notification(
        id=str(uuid.uuid4()),
        user_id=user_id,
        title=title,
        message=message,
        type=type,
        is_read=False
    )
    db.add(db_notification)
    db.commit()
    db.refresh(db_notification)
    return db_notification


def get_notifications(db: Session, user_id: str):
    return db.query(Notification).filter(Notification.user_id == user_id).all()


def mark_notification_read(db: Session, notification_id: str, user_id: str):
    notification = db.query(Notification).filter(
        and_(Notification.id == notification_id, Notification.user_id == user_id)
    ).first()

    if notification:
        notification.is_read = True
        db.commit()
        db.refresh(notification)

    return notification


def mark_all_notifications_read(db: Session, user_id: str):
    notifications = db.query(Notification).filter(
        and_(Notification.user_id == user_id, Notification.is_read == False)
    ).all()

    for n in notifications:
        n.is_read = True

    db.commit()
    return True


def delete_notification(db: Session, notification_id: str, user_id: str):
    notification = db.query(Notification).filter(
        and_(Notification.id == notification_id, Notification.user_id == user_id)
    ).first()

    if notification:
        db.delete(notification)
        db.commit()

    return notification


def clear_notifications(db: Session, user_id: str):
    db.query(Notification).filter(Notification.user_id == user_id).delete()
    db.commit()
    return True


# ----------------------------
# User CRUD
# ----------------------------

def get_users(db: Session):
    return db.query(User).all()


def get_user(db: Session, user_id: str):
    return db.query(User).filter(User.id == user_id).first()


def update_user(db: Session, user_id: str, data: dict):
    user = db.query(User).filter(User.id == user_id).first()

    if not user:
        return None

    for key, value in data.items():
        setattr(user, key, value)

    db.commit()
    db.refresh(user)
    return user


def create_user(db: Session, user: User):
    db.add(user)
    db.commit()
    db.refresh(user)
    return user