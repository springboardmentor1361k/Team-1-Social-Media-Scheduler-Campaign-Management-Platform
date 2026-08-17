from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app import crud, schemas
from app.models.models import User
from app.utils.security import verify_token, hash_password, verify_password

router = APIRouter(
    prefix="/users",
    tags=["Users"]
)

@router.get("/", response_model=list[schemas.UserResponse])
def get_users(db: Session = Depends(get_db)):
    return crud.get_users(db)

@router.get("/profile", response_model=schemas.UserResponse)
def get_profile(
    user_id: str = Depends(verify_token),
    db: Session = Depends(get_db)
):
    user = db.query(User).filter(User.id == user_id).first()

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    return user

@router.put("/{user_id}", response_model=schemas.UserResponse)
def update_user(
    user_id: str,
    data: schemas.UserUpdate,
    current_user_id: str = Depends(verify_token),
    db: Session = Depends(get_db)
):
    if user_id != current_user_id:
        raise HTTPException(status_code=403, detail="Not authorized to update this profile")
        
    user = crud.update_user(db, user_id, data.model_dump(exclude_unset=True))

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    return user


@router.post("/change-password")
def change_password(
    data: schemas.PasswordChangeRequest,
    user_id: str = Depends(verify_token),
    db: Session = Depends(get_db)
):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
        
    if not verify_password(data.currentPassword, user.password):
        raise HTTPException(status_code=400, detail="Incorrect current password")
        
    user.password = hash_password(data.newPassword)
    db.commit()
    return {"message": "Password changed successfully"}