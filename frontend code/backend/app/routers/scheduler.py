from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app import crud, schemas
from app.utils.security import verify_token

router = APIRouter(
    prefix="/scheduler",
    tags=["Scheduler"]
)


@router.get("/", response_model=list[schemas.PostResponse])
def get_scheduler(
    db: Session = Depends(get_db),
    user_id: str = Depends(verify_token)
):
    return crud.get_posts(db, user_id)


@router.post("/", response_model=schemas.PostResponse)
def create_schedule(
    post: schemas.PostCreate,
    db: Session = Depends(get_db),
    user_id: str = Depends(verify_token)
):
    return crud.create_post(db, post, user_id)


@router.put("/{post_id}", response_model=schemas.PostResponse)
def update_schedule(
    post_id: str,
    post: schemas.PostUpdate,
    db: Session = Depends(get_db),
    user_id: str = Depends(verify_token)
):
    updated_post = crud.update_post(db, post_id, post, user_id)
    if not updated_post:
        raise HTTPException(status_code=404, detail="Scheduled post not found")
    return updated_post


@router.delete("/{post_id}")
def delete_schedule(
    post_id: str,
    db: Session = Depends(get_db),
    user_id: str = Depends(verify_token)
):
    post = crud.delete_post(db, post_id, user_id)
    if not post:
        raise HTTPException(status_code=404, detail="Scheduled post not found")
    return {"success": True, "message": "Scheduled post deleted successfully."}