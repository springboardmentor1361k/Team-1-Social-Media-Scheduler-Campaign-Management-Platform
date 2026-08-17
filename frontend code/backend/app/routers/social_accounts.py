from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from uuid import UUID

from app.database import get_db
from app.schemas import SocialAccountCreate, SocialAccountResponse
from app import crud
from app.utils.security import verify_token

router = APIRouter(
    prefix="/social-accounts",
    tags=["Social Accounts"]
)


@router.post("/", response_model=SocialAccountResponse)
def create_account(
    account: SocialAccountCreate,
    db: Session = Depends(get_db),
    user_id: str = Depends(verify_token)
):
    return crud.create_social_account(db, account, user_id)


@router.get("/", response_model=list[SocialAccountResponse])
def get_accounts(
    db: Session = Depends(get_db),
    user_id: str = Depends(verify_token)
):
    return crud.get_social_accounts(db, user_id)


@router.get("/{account_id}", response_model=SocialAccountResponse)
def get_account(
    account_id: UUID,
    db: Session = Depends(get_db),
    user_id: str = Depends(verify_token)
):
    account = crud.get_social_account(db, account_id, user_id)
    if not account:
        raise HTTPException(status_code=404, detail="Social account not found")
    return account


@router.delete("/{account_id}")
def delete_account(
    account_id: UUID,
    db: Session = Depends(get_db),
    user_id: str = Depends(verify_token)
):
    account = crud.delete_social_account(db, account_id, user_id)
    if not account:
        raise HTTPException(status_code=404, detail="Social account not found")
    return {"success": True, "message": "Social account disconnected successfully."}