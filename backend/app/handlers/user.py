from app.models.models import User
from app.utils.jwt import extractUserId
from sqlalchemy import select

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
    
    