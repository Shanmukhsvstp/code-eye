from app.models.models import User, Room, PasswordResetToken
from app.utils.jwt import extractUserId
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.utils.password import hashPassword
from app.utils.password_reset import (
    generateResetToken,
    hashResetToken
)

from app.utils.email import sendPasswordResetEmail


JUDGE0_LANGUAGE_IDS = {
    "c": 50,
    "cpp": 54,
    "csharp": 51,
    "java": 62,
    "javascript": 63,
    "typescript": 74,
    "python": 71,
    "php": 68,
    "shell": 46,
    "go": 60,
    "rust": 73,
    "kotlin": 78,
    "swift": 83,
    "ruby": 72,
    "r": 80,
    "objective-c": 79,
    "scala": 81,
    "perl": 85,
    "lua": 64,
    "vb": 84,
    "pascal": 67,
    "elixir": 57,
    "fsharp": 87,
    "clojure": 86,
    "sql": 82,
}


async def userAlreadyExists(email, db):
    result = await db.execute(
        select(User).where(User.email == email)
    )
    return result.scalar_one_or_none()

async def fetchUser(token, db):
    
    raw_user = extractUserId(token=token)
    
    user_id = raw_user["user_id"]
    
    result = await db.execute(
        select(User).where(User.id == user_id)
    )
    
    fetched_data = result.scalar_one_or_none()
    
    if fetched_data == None:
        return None
    
    user = {
        "id": user_id,
        "email": fetched_data.email,
        "display_name": fetched_data.display_name,
        "name": fetched_data.name,
        "profile_picture": fetched_data.profile_picture,
        "joined_on": fetched_data.created_at,
        "expires_at": raw_user["exp"],
        "token": token
    }
    
    return user
    
async def fetchRoom(room_id, db):
    result = await db.execute(
        select(Room).where(Room.id == room_id)
    )
    
    fetched_data = result.scalar_one_or_none()
     
    print(fetched_data)
       
    if fetched_data == None:
        return None
        
    room = {
        "default_lang": fetched_data.default_lang
    }
    return room

async def createOrAuthenticateUser(user, db):
    sub = user["sub"]
    email = user["email"]
    name = user["name"]
    display_name = user["given_name"]
    profile_picture = user["picture"]
    
    new_user = User(
        sub = sub,
        email = email,
        name = name,
        display_name = display_name,
        profile_picture = profile_picture
    )
    
    
    result = await db.execute(
        select(User).where(User.email == email)
    )
    fetched_user = result.scalar_one_or_none()
    
    # user_details = userAlreadyExists(email, db)
    
    if fetched_user is None:
        db.add(new_user)
        await db.commit()
        await db.refresh(new_user)
        if new_user is not None:
            return True, "Authentication successful!", new_user
        else:
            return False, "Couldn't create your account, please try again later!", None
    else:
        fetched_user.name = new_user.name
        fetched_user.display_name = new_user.display_name
        fetched_user.profile_picture = new_user.profile_picture
        await db.commit()
        await db.refresh(fetched_user)
        return True, "Authentication Successful!", fetched_user
        
    
    # print(user)

def fetchLanguageCode(language):
    return JUDGE0_LANGUAGE_IDS[language]




async def getUserByEmail(
    email: str,
    db: AsyncSession
):
    result = await db.execute(
        select(User).where(User.email == email)
    )

    return result.scalar_one_or_none()


async def createEmailUser(
    name: str,
    email: str,
    password: str,
    db: AsyncSession
):
    existing_user = await getUserByEmail(
        email=email,
        db=db
    )

    if existing_user:
        return False, "An account with this email already exists", None

    user = User(
        display_name=name,
        name=name,
        email=email,
        password_hash=hashPassword(password),
        auth_provider="email",
        sub=None
    )

    db.add(user)

    await db.commit()
    await db.refresh(user)

    return True, "Account created successfully", user



async def createPasswordReset(
    email: str,
    db: AsyncSession
):
    user = await getUserByEmail(
        email=email,
        db=db
    )

    # IMPORTANT:
    # Don't reveal whether an email exists.
    if user is None:
        return True

    # Google-only accounts don't have a password.
    if user.password_hash is None:
        return True

    # Delete previous reset tokens for this user.
    await db.execute(
        delete(PasswordResetToken).where(
            PasswordResetToken.user_id == user.id
        )
    )

    raw_token = generateResetToken()
    token_hash = hashResetToken(raw_token)

    expires_at = (
        datetime.now(timezone.utc)
        + timedelta(minutes=30)
    )

    reset_token = PasswordResetToken(
        user_id=user.id,
        token_hash=token_hash,
        expires_at=expires_at
    )

    db.add(reset_token)

    await db.commit()

    await sendPasswordResetEmail(
        email=user.email,
        token=raw_token
    )

    return True


async def resetPassword(
    token: str,
    new_password: str,
    db: AsyncSession
):
    token_hash = hashResetToken(token)

    result = await db.execute(
        select(PasswordResetToken).where(
            PasswordResetToken.token_hash == token_hash
        )
    )

    reset_token = result.scalar_one_or_none()

    if reset_token is None:
        return False, "Invalid or expired reset link"

    now = datetime.now(timezone.utc)

    if reset_token.expires_at <= now:
        await db.delete(reset_token)
        await db.commit()

        return False, "Invalid or expired reset link"

    result = await db.execute(
        select(User).where(
            User.id == reset_token.user_id
        )
    )

    user = result.scalar_one_or_none()

    if user is None:
        await db.delete(reset_token)
        await db.commit()

        return False, "Invalid or expired reset link"

    user.password_hash = hashPassword(
        new_password
    )

    # This also converts the account into
    # email/password authentication if necessary.
    user.auth_provider = "email"

    # Token can only be used once.
    await db.delete(reset_token)

    await db.commit()

    return True, "Password reset successfully"