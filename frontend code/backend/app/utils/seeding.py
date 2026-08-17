import uuid
import datetime
from sqlalchemy.orm import Session
from app.models.models import SocialAccount, Campaign, Post, Notification, Analytics

def seed_user_data(db: Session, user_id: str):
    try:
        # 1. Clear existing user data to avoid duplication and allow fresh seeding.
        # Clean up dependencies (Analytics) first to prevent constraint violations.
        user_posts = db.query(Post).filter(Post.user_id == user_id).all()
        user_post_ids = [p.id for p in user_posts]
        if user_post_ids:
            db.query(Analytics).filter(Analytics.post_id.in_(user_post_ids)).delete(synchronize_session=False)

        db.query(SocialAccount).filter(SocialAccount.user_id == user_id).delete(synchronize_session=False)
        db.query(Campaign).filter(Campaign.user_id == user_id).delete(synchronize_session=False)
        db.query(Post).filter(Post.user_id == user_id).delete(synchronize_session=False)
        db.query(Notification).filter(Notification.user_id == user_id).delete(synchronize_session=False)
        
        # We do not commit immediately to keep it all under a single transaction.

        # 2. Seed Social Accounts
        accounts_data = [
            {"platform": "facebook", "account_name": "@SocialPilotDev", "account_id": "fb_101"},
            {"platform": "instagram", "account_name": "socialpilot_dev", "account_id": "inst_102"},
            {"platform": "linkedin", "account_name": "SocialPilot Inc", "account_id": "lnk_103"},
            {"platform": "twitter", "account_name": "@SocialPilotHQ", "account_id": "tw_104"}
        ]
        
        for acc in accounts_data:
            db_acc = SocialAccount(
                id=uuid.uuid4(),
                user_id=user_id,
                platform=acc["platform"],
                account_name=acc["account_name"],
                account_id=acc["account_id"],
                status="Connected",
                access_token="mock_access_token_" + str(uuid.uuid4())[:8],
                refresh_token="mock_refresh_token_" + str(uuid.uuid4())[:8]
            )
            db.add(db_acc)

        # 3. Seed Campaigns with unique dynamically-generated IDs
        campaigns_data = [
            {
                "id": "cmp_1",
                "name": "Summer Product Launch 2026",
                "platform": "linkedin",
                "start_date": "2026-06-01",
                "end_date": "2026-08-31",
                "budget": 15000.0,
                "objective": "Multi-channel launch campaign for the new v4 cloud integration product lines.",
                "performance": "Good",
                "status": "active"
            },
            {
                "id": "cmp_2",
                "name": "Q3 Holiday Sale Promo",
                "platform": "instagram",
                "start_date": "2026-07-01",
                "end_date": "2026-07-15",
                "budget": 8000.0,
                "objective": "Targeted discounts and visual posts highlighting product deals for Independence Day.",
                "performance": "Pending",
                "status": "draft"
            },
            {
                "id": "cmp_3",
                "name": "Developer Conference Drive",
                "platform": "twitter",
                "start_date": "2026-05-10",
                "end_date": "2026-06-15",
                "budget": 5000.0,
                "objective": "Sponsoring engineering posts, dev-to posts, and speaker updates.",
                "performance": "Excellent",
                "status": "completed"
            },
            {
                "id": "cmp_4",
                "name": "Brand Re-engagement Ad Set",
                "platform": "facebook",
                "start_date": "2026-06-15",
                "end_date": "2026-09-30",
                "budget": 12000.0,
                "objective": "Follower growth and brand sentiment optimization.",
                "performance": "Moderate",
                "status": "paused"
            }
        ]

        campaign_id_map = {}
        for cmp in campaigns_data:
            old_id = cmp["id"]
            new_id = f"cmp_{uuid.uuid4().hex}"
            campaign_id_map[old_id] = new_id

            db_cmp = Campaign(
                id=new_id,
                user_id=user_id,
                name=cmp["name"],
                platform=cmp["platform"],
                start_date=cmp["start_date"],
                end_date=cmp["end_date"],
                budget=cmp["budget"],
                objective=cmp["objective"],
                performance=cmp["performance"],
                status=cmp["status"]
            )
            db.add(db_cmp)

        # 4. Seed Posts / Scheduler Items with unique dynamically-generated IDs
        posts_data = [
            {
                "id": "pst_1",
                "platform": "linkedin",
                "content": "🚀 Exciting news! Antigravity AI configurations are launching tomorrow. Streamline your agent workflow in minutes. #DevOps #AI #Cloud",
                "media_url": "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800",
                "media_type": "image",
                "scheduled_time": "2026-08-15T09:00:00",
                "status": "scheduled",
                "campaign_id": "cmp_1"
            },
            {
                "id": "pst_2",
                "platform": "instagram",
                "content": "Take a peek at our sleek design refresh! Aesthetics matter, and we are dialing it up to eleven. 🎨✨ #UIDesign #WebDev #SaaS",
                "media_url": "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=800",
                "media_type": "image",
                "scheduled_time": "2026-08-17T14:30:00",
                "status": "scheduled",
                "campaign_id": "cmp_2"
            },
            {
                "id": "pst_3",
                "platform": "twitter",
                "content": "What's your favorite framework for React state management in 2026? Context? Zustand? Signals? 👇",
                "media_url": None,
                "media_type": None,
                "scheduled_time": "2026-08-10T18:00:00",
                "status": "published",
                "campaign_id": "cmp_3"
            },
            {
                "id": "pst_4",
                "platform": "facebook",
                "content": "Join our next developer community call on Friday! We'll talk React 19, web performance, and modern dashboards.",
                "media_url": "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800",
                "media_type": "image",
                "scheduled_time": "2026-08-16T11:00:00",
                "status": "scheduled",
                "campaign_id": "cmp_4"
            },
            {
                "id": "pst_5",
                "platform": "linkedin",
                "content": "Weekly tip: Minimize side effects in React useEffect hook by using refs or custom dependency states. Clean code leads to fast web apps!",
                "media_url": None,
                "media_type": None,
                "scheduled_time": "2026-08-08T10:00:00",
                "status": "published",
                "campaign_id": "cmp_1"
            },
            {
                "id": "pst_6",
                "platform": "instagram",
                "content": "Visual storytelling drives 80% higher conversion rates in SaaS dashboards. Here is how we design for impact.",
                "media_url": "https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=800",
                "media_type": "image",
                "scheduled_time": "2026-08-09T16:00:00",
                "status": "failed",
                "campaign_id": "cmp_2"
            }
        ]

        post_id_map = {}
        for pst in posts_data:
            old_id = pst["id"]
            new_id = f"pst_{uuid.uuid4().hex}"
            post_id_map[old_id] = new_id

            mapped_camp_id = campaign_id_map.get(pst["campaign_id"])

            db_pst = Post(
                id=new_id,
                user_id=user_id,
                campaign_id=mapped_camp_id,
                platform=pst["platform"],
                content=pst["content"],
                caption=pst["content"],
                media_url=pst["media_url"],
                media_type=pst["media_type"],
                status=pst["status"],
                scheduled_time=pst["scheduled_time"]
            )
            db.add(db_pst)

        # 5. Seed Analytics for Published and Scheduled/Failed Posts mapped to correct generated post IDs
        analytics_records = [
            {"post_id": "pst_3", "platform": "twitter", "likes": 245, "comments": 82, "shares": 41, "reach": 1500, "impressions": 2200, "clicks": 88},
            {"post_id": "pst_5", "platform": "linkedin", "likes": 320, "comments": 45, "shares": 52, "reach": 1900, "impressions": 2800, "clicks": 110},
            {"post_id": "pst_6", "platform": "instagram", "likes": 12, "comments": 1, "shares": 0, "reach": 85, "impressions": 95, "clicks": 2}
        ]
        
        for an in analytics_records:
            mapped_post_id = post_id_map.get(an["post_id"])
            if mapped_post_id:
                db_an = Analytics(
                    id=f"an_{uuid.uuid4().hex}",
                    post_id=mapped_post_id,
                    platform=an["platform"],
                    likes=an["likes"],
                    comments=an["comments"],
                    shares=an["shares"],
                    reach=an["reach"],
                    impressions=an["impressions"],
                    clicks=an["clicks"]
                )
                db.add(db_an)

        # 6. Seed Notifications with unique dynamically-generated IDs
        notifs_data = [
            {
                "title": "Campaign Created",
                "message": "Summer Product Launch 2026 campaign was successfully initialized.",
                "type": "success",
                "is_read": False
            },
            {
                "title": "Post Scheduled",
                "message": "Your post on LinkedIn '🚀 Exciting news! Antigravity AI...' has been scheduled.",
                "type": "info",
                "is_read": False
            },
            {
                "title": "Failed to Publish Post",
                "message": "Your post on Instagram 'Visual storytelling drives...' failed to publish.",
                "type": "error",
                "is_read": False
            },
            {
                "title": "Account Connection Status",
                "message": "Facebook page '@SocialPilotDev' has been linked.",
                "type": "success",
                "is_read": True
            }
        ]

        for notif in notifs_data:
            db_notif = Notification(
                id=f"ntf_{uuid.uuid4().hex}",
                user_id=user_id,
                title=notif["title"],
                message=notif["message"],
                type=notif["type"],
                is_read=notif["is_read"]
            )
            db.add(db_notif)

        # Commit everything inside a single unified database transaction
        db.commit()
        return True

    except Exception as e:
        db.rollback()
        print(f"[ERROR] Seeding user data transaction failed: {e}")
        raise e
