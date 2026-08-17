from fastapi import APIRouter

router = APIRouter(
    prefix="/activity",
    tags=["Activity"]
)

@router.get("/")
def get_activity():
    return [
        {
            "id": "1",
            "log": "LinkedIn post published successfully.",
            "time": "10 minutes ago",
            "type": "success"
        },
        {
            "id": "2",
            "log": "Campaign budget reached 95%.",
            "time": "1 hour ago",
            "type": "warning"
        }
    ]