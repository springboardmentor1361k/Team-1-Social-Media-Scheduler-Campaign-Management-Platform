from fastapi.security import OAuth2PasswordRequestForm
from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.models import User
from app.schemas import UserCreate, UserLogin
from app import crud
from app.utils.security import (
    hash_password,
    verify_password,
    create_access_token,
    verify_token
)
import uuid

router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)


@router.post("/register")
def register(user: UserCreate, db: Session = Depends(get_db)):
    existing_user = db.query(User).filter(User.email == user.email).first()

    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    new_user = User(
        id=str(uuid.uuid4()),
        username=user.username,
        email=user.email,
        password=hash_password(user.password),
        phone=user.phone,
        company_name=user.company_name
    )

    crud.create_user(db, new_user)

    # Auto seed demo data for new user registration
    try:
        from app.utils.seeding import seed_user_data
        seed_user_data(db, new_user.id)
    except Exception as e:
        print("Auto seeding failed:", e)

    access_token = create_access_token({"sub": new_user.id})

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": new_user.id,
            "username": new_user.username,
            "email": new_user.email,
            "phone": new_user.phone,
            "company_name": new_user.company_name,
            "avatar": new_user.avatar
        }
    }


@router.post("/login")
def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):
    user = db.query(User).filter(User.email == form_data.username).first()

    if not user:
        raise HTTPException(status_code=401, detail="Invalid email or password")

    if not verify_password(form_data.password, user.password):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    access_token = create_access_token({"sub": user.id})

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "username": user.username,
            "email": user.email,
            "phone": user.phone,
            "company_name": user.company_name,
            "avatar": user.avatar
        }
    }


@router.post("/seed")
def seed_database(
    user_id: str = Depends(verify_token),
    db: Session = Depends(get_db)
):
    try:
        from app.utils.seeding import seed_user_data
        seed_user_data(db, user_id)
        return {"success": True, "message": "Demo database seeded successfully."}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Seeding failed: {str(e)}")