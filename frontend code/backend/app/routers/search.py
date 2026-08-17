from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import or_, and_
from app.database import get_db
from app.models.models import Campaign, Post, Notification
from app.utils.security import verify_token

router = APIRouter(
    prefix="/search",
    tags=["Search"]
)


@router.get("/")
def search(
    q: str = "",
    db: Session = Depends(get_db),
    user_id: str = Depends(verify_token)
):
    query_str = f"%{q}%"
    
    # 1. Search campaigns in database
    db_campaigns = db.query(Campaign).filter(
        and_(
            Campaign.user_id == user_id,
            or_(
                Campaign.name.ilike(query_str),
                Campaign.objective.ilike(query_str),
                Campaign.platform.ilike(query_str)
            )
        )
    ).all()
    
    # 2. Search posts (schedules) in database
    db_posts = []
    if q:
        db_posts = db.query(Post).filter(
            and_(
                Post.user_id == user_id,
                or_(
                    Post.content.ilike(query_str),
                    Post.platform.ilike(query_str)
                )
            )
        ).all()
        
    # 3. Search notifications in database
    db_notifs = []
    if q:
        db_notifs = db.query(Notification).filter(
            and_(
                Notification.user_id == user_id,
                or_(
                    Notification.title.ilike(query_str),
                    Notification.message.ilike(query_str)
                )
            )
        ).all()
        
    return {
        "campaigns": [
            {
                "id": c.id,
                "name": c.name,
                "platform": c.platform,
                "objective": c.objective,
                "status": c.status
            } for c in db_campaigns
        ],
        "schedules": [
            {
                "id": p.id,
                "platform": p.platform,
                "content": p.content,
                "scheduled_time": p.scheduled_time,
                "status": p.status
            } for p in db_posts
        ],
        "notifications": [
            {
                "id": n.id,
                "title": n.title,
                "message": n.message,
                "type": n.type,
                "read": n.is_read
            } for n in db_notifs
        ]
    }
