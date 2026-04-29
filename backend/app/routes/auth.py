from fastapi import APIRouter,Request,Depends
from fastapi.responses import RedirectResponse
from authlib.integrations.starlette_client import OAuth
from dotenv import load_dotenv
from sqlalchemy.ext.asyncio import AsyncSession
import os
from app.handlers.user import createOrAuthenticateUser
from app.db.database import get_db
load_dotenv()

router = APIRouter(prefix="/auth", tags=["auth"])

frontend_url = os.getenv("FRONTEND_URL")
google_redirect_uri = os.getenv("GOOGLE_REDIRECT_URI")
# db = get_db()

oauth = OAuth()
oauth.register(
    name="google",
    client_id=os.getenv("GOOGLE_CLIENT_ID"),
    client_secret=os.getenv("GOOGLE_CLIENT_SECRET"),
    server_metadata_url="https://accounts.google.com/.well-known/openid-configuration",
    client_kwargs={"scope":"openid email profile"}
)


@router.get("/")
async def authenticate(request: Request):
    print("ENV REDIRECT URI:", os.getenv("GOOGLE_REDIRECT_URI"))
    redirectUrl = google_redirect_uri  # This creates a callback url and sends to oAuth,auth_callback is a fastAPI version for /auth/callback
    print("Redirect URI:", redirectUrl)
    return await oauth.google.authorize_redirect(request,redirectUrl) # Redirects back to redirectUrl with temp auth code

@router.get("/callback", name="callback")
async def authCallBack(request: Request, db: AsyncSession = Depends(get_db)):
    token = await oauth.google.authorize_access_token(request) # Exchages the temp auth code
    user = token["userinfo"]
    success, message, user_id = await createOrAuthenticateUser(user=user, db=db)
    if not success:
        return RedirectResponse(f"{frontend_url}/auth/error?msg={message}")
    # Get name and email
    request.session["user"] = {
        "id": user_id,
    }
    return RedirectResponse(f"{frontend_url}/auth/success?msg={message}") # Go to Home Page

@router.get("/me")
async def get_user(request: Request):
    return request.session.get("user")

@router.get("/logout")
async def logOut(request: Request):
    request.session.clear()
    return RedirectResponse(f"{frontend_url}/auth")
