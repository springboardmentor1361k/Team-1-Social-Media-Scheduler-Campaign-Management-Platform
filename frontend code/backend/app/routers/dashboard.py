from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.models import SocialAccount, Campaign, Post
from app.utils.security import verify_token

router = APIRouter(
    prefix="/dashboard",
    tags=["Dashboard"]
)


@router.get("/")
def get_dashboard(
    user_id: str = Depends(verify_token),
    db: Session = Depends(get_db)
):
    # Query database counts for the authenticated user
    num_accounts = db.query(SocialAccount).filter(SocialAccount.user_id == user_id).count()
    num_campaigns = db.query(Campaign).filter(Campaign.user_id == user_id).count()
    
    posts = db.query(Post).filter(Post.user_id == user_id).all()
    total_posts = len(posts)
    scheduled = len([p for p in posts if p.status == 'scheduled'])
    published = len([p for p in posts if p.status == 'published'])
    failed = len([p for p in posts if p.status == 'failed'])

    return {
        "totalPosts": total_posts,
        "scheduled": scheduled,
        "published": published,
        "failed": failed,
        "campaignCount": num_campaigns,
        "connectedAccounts": num_accounts
    }