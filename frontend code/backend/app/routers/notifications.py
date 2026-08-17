from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app import crud, schemas
from app.utils.security import verify_token

router = APIRouter(
    prefix="/notifications",
    tags=["Notifications"]
)


@router.get("/", response_model=list[schemas.NotificationResponse])
def get_notifications(
    db: Session = Depends(get_db),
    user_id: str = Depends(verify_token)
):
    db_notifs = crud.get_notifications(db, user_id)
    return [
        {
            "id": n.id,
            "user_id": n.user_id,
            "title": n.title,
            "message": n.message,
            "type": n.type,
            "read": n.is_read,
            "created_at": n.created_at
        } for n in db_notifs
    ]


@router.put("/read-all")
def mark_all_as_read(
    db: Session = Depends(get_db),
    user_id: str = Depends(verify_token)
):
    crud.mark_all_notifications_read(db, user_id)
    return {"success": True}


@router.put("/{notification_id}/read")
def mark_notification_as_read(
    notification_id: str,
    db: Session = Depends(get_db),
    user_id: str = Depends(verify_token)
):
    notif = crud.mark_notification_read(db, notification_id, user_id)
    if not notif:
        raise HTTPException(status_code=404, detail="Notification not found")
    return {"success": True}


@router.delete("/")
def clear_notifications(
    db: Session = Depends(get_db),
    user_id: str = Depends(verify_token)
):
    crud.clear_notifications(db, user_id)
    return {"success": True}


@router.delete("/{notification_id}")
def delete_single_notification(
    notification_id: str,
    db: Session = Depends(get_db),
    user_id: str = Depends(verify_token)
):
    notif = crud.delete_notification(db, notification_id, user_id)
    if not notif:
        raise HTTPException(status_code=404, detail="Notification not found")
    return {"success": True}