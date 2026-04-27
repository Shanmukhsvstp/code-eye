import uvicorn
from fastapi import FastAPI
from app.routes import user
from app.routes import auth
from fastapi import APIRouter
from starlette.middleware.sessions import SessionMiddleware
import os
app = FastAPI()

# Routers
api_router = APIRouter(prefix="/api") # API Router

# API Endpoints
api_router.include_router(auth.router)
api_router.include_router(user.router)
app.add_middleware(SessionMiddleware, 
        secret_key=os.getenv("SECRET_KEY"),
        max_age=14 * 24 * 60 * 60, # cookie lives for 14 days
        same_site="lax",           # CSRF protection
        https_only=False           # Set true in production
)

# Router Includes
app.include_router(api_router)


if __name__ == "__main__":
    uvicorn.run("app.main:app", host="127.0.0.1", port=8000, reload=True)