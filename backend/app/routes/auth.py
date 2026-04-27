from fastapi import APIRouter

router = APIRouter(prefix="/auth", tags=["auth"])


@router.get("/")
def authenticate():
    return {"message": "Login endpoint"}