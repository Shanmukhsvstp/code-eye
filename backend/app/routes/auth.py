from fastapi import APIRouter,Request,Depends
from fastapi.responses import RedirectResponse
from authlib.integrations.starlette_client import OAuth
from dotenv import load_dotenv
from sqlalchemy.ext.asyncio import AsyncSession
import os
from app.handlers.user import createOrAuthenticateUser
from app.utils.jwt import generateToken
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
    success, message, user = await createOrAuthenticateUser(user=user, db=db)
    if not success:
        return RedirectResponse(f"{frontend_url}/auth/error?msg={message}")
    token = generateToken(user_id=user.id)
    # Get name and email
    request.session["user"] = {
        "token": token,
    }
    return RedirectResponse(f"{frontend_url}/auth/success?msg={message}") # Go to Home Page


@router.get("/logout")
async def logOut(request: Request):
    request.session.clear()
    return RedirectResponse(f"{frontend_url}/auth")
