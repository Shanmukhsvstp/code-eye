import jwt
from datetime import timezone, datetime, timedelta
import os
from dotenv import load_dotenv

load_dotenv()
JWT_SECRET = os.getenv("JWT_SECRET")

def generateToken(user_id):
    
    
    payload = {
        "user_id": user_id,
        "exp": datetime.now(timezone.utc) + timedelta(days=7),
        "iat": datetime.now(timezone.utc)
    }
    
    token = jwt.encode(payload, JWT_SECRET, algorithm="HS256")
    
    return token

def extractUserId(token):
    payload = jwt.decode(token, JWT_SECRET, algorithms=["HS256"])
    return payload