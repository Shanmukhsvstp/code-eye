from fastapi import APIRouter, Request, Depends, HTTPException
from fastapi.responses import RedirectResponse
from authlib.integrations.starlette_client import OAuth
from dotenv import load_dotenv
from sqlalchemy.ext.asyncio import AsyncSession
from app.utils.password import password_hash, verifyPassword
import os
from app.handlers.user import (
    createOrAuthenticateUser,
    createEmailUser,
    getUserByEmail,
    createPasswordReset,
    resetPassword
)
from app.utils.jwt import generateToken
from app.db.database import get_db
from app.handlers.user import createEmailUser, getUserByEmail
from pydantic import BaseModel, EmailStr
from pwdlib import PasswordHash

load_dotenv()


class EmailSignupRequest(BaseModel):
    name: str
    email: EmailStr
    password: str


class EmailLoginRequest(BaseModel):
    email: EmailStr
    password: str
    

from pydantic import BaseModel, EmailStr, Field


class EmailSignupRequest(BaseModel):
    name: str = Field(
        min_length=1,
        max_length=100
    )

    email: EmailStr

    password: str = Field(
        min_length=8,
        max_length=128
    )


class EmailLoginRequest(BaseModel):
    email: EmailStr

    password: str = Field(
        min_length=1,
        max_length=128
    )


class ForgotPasswordRequest(BaseModel):
    email: EmailStr


class ResetPasswordRequest(BaseModel):
    token: str = Field(
        min_length=1
    )

    password: str = Field(
        min_length=8,
        max_length=128
    )





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





@router.post("/signup/email")
async def signUpWithEmail(
    data: EmailSignupRequest,
    request: Request,
    db: AsyncSession = Depends(get_db)
):

    success, message, user = await createEmailUser(
        name=data.name,
        email=data.email.lower().strip(),
        password=data.password,
        db=db
    )

    if not success:
        raise HTTPException(
            status_code=400,
            detail=message
        )

    jwt_token = generateToken(
        user_id=user.id
    )

    request.session["user"] = {
        "token": jwt_token
    }

    return {
        "success": True,
        "message": message,
        "user": {
            "id": user.id,
            "name": user.name,
            "display_name": user.display_name,
            "email": user.email
        }
    }




@router.post("/login/email")
async def loginWithEmail(
    data: EmailLoginRequest,
    request: Request,
    db: AsyncSession = Depends(get_db)
):

    email = data.email.lower().strip()

    user = await getUserByEmail(
        email=email,
        db=db
    )

    if user is None:
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )

    # User exists but doesn't have a password.
    # For example, they registered with Google.
    if user.password_hash is None:
        raise HTTPException(
            status_code=401,
            detail="This account uses Google sign-in"
        )

    if not verifyPassword(
        data.password,
        user.password_hash
    ):
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )

    jwt_token = generateToken(
        user_id=user.id
    )

    request.session["user"] = {
        "token": jwt_token
    }

    return {
        "success": True,
        "message": "Login successful",
        "user": {
            "id": user.id,
            "name": user.name,
            "display_name": user.display_name,
            "email": user.email
        }
    }




@router.get("/logout")
async def logOut(request: Request):
    request.session.clear()
    return RedirectResponse(f"{frontend_url}/auth")

@router.post("/forgot-password")
async def forgotPassword(
    data: ForgotPasswordRequest,
    db: AsyncSession = Depends(get_db)
):
    email = data.email.lower().strip()

    await createPasswordReset(
        email=email,
        db=db
    )

    # Always return the same response.
    # Don't reveal whether the account exists.
    return {
        "success": True,
        "message": (
            "If an account exists with this email, "
            "a password reset link has been sent."
        )
    }
    
@router.post("/reset-password")
async def resetPasswordEndpoint(
    data: ResetPasswordRequest,
    db: AsyncSession = Depends(get_db)
):
    success, message = await resetPassword(
        token=data.token,
        new_password=data.password,
        db=db
    )

    if not success:
        raise HTTPException(
            status_code=400,
            detail=message
        )

    return {
        "success": True,
        "message": message
    }