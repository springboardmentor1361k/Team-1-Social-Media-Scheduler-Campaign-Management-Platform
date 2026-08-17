from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app import crud, schemas
from app.utils.security import verify_token

router = APIRouter(
    prefix="/campaigns",
    tags=["Campaigns"]
)


@router.post("/", response_model=schemas.CampaignResponse)
def create_campaign(
    campaign: schemas.CampaignCreate,
    db: Session = Depends(get_db),
    user_id: str = Depends(verify_token)
):
    return crud.create_campaign(db, campaign, user_id)


@router.get("/", response_model=list[schemas.CampaignResponse])
def get_campaigns(
    db: Session = Depends(get_db),
    user_id: str = Depends(verify_token)
):
    return crud.get_campaigns(db, user_id)


@router.get("/{campaign_id}", response_model=schemas.CampaignResponse)
def get_campaign(
    campaign_id: str,
    db: Session = Depends(get_db),
    user_id: str = Depends(verify_token)
):
    campaign = crud.get_campaign(db, campaign_id, user_id)
    if not campaign:
        raise HTTPException(status_code=404, detail="Campaign not found")
    return campaign


@router.put("/{campaign_id}", response_model=schemas.CampaignResponse)
def update_campaign(
    campaign_id: str,
    campaign: schemas.CampaignUpdate,
    db: Session = Depends(get_db),
    user_id: str = Depends(verify_token)
):
    updated_campaign = crud.update_campaign(db, campaign_id, campaign, user_id)
    if not updated_campaign:
        raise HTTPException(status_code=404, detail="Campaign not found")
    return updated_campaign


@router.delete("/{campaign_id}")
def delete_campaign(
    campaign_id: str,
    db: Session = Depends(get_db),
    user_id: str = Depends(verify_token)
):
    campaign = crud.delete_campaign(db, campaign_id, user_id)
    if not campaign:
        raise HTTPException(status_code=404, detail="Campaign not found")
    return {"success": True, "message": "Campaign deleted successfully"}