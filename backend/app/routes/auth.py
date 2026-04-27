from fastapi import APIRouter,Request
from fastapi.responses import RedirectResponse
from authlib.integrations.starlette_client import OAuth
from dotenv import load_dotenv
import os

load_dotenv()

router = APIRouter(prefix="/auth", tags=["auth"])

oauth = OAuth()
oauth.register(
    name="google",
    client_id=os.getenv("GOOGLE_CLIENT_ID"),
    client_secret=os.getenv("GOOGLE_CLIENT_SECRET"),
    server_metadata_url="https://accounts.google.com/.well-known/openid-configuration",
    client_kwargs={"scope":"openid email profile"}
)


@router.get("/login")
async def authenticate(request: Request):
    redirectUrl = request.url_for("callback")  # This creates a callback url and sends to oAuth,auth_callback is a fastAPI version for /auth/callback
    return await oauth.google.authorize_redirect(request,redirectUrl) # Redirects back to redirectUrl with temp auth code

@router.get("/callback", name="callback")
async def authCallBack(request: Request):
    token = await oauth.google.authorize_access_token(request) # Exchages the temp auth code
    user = token["userinfo"]
    # Get name and email
    request.session["user"] = {
        "name":user["name"],
        "email":user["email"]
    }
    return RedirectResponse("/") # Go to Home Page

@router.get("/logout")
async def logOut(request: Request):
    request.session.clear()
    return RedirectResponse("/signin")