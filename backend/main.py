import uvicorn
from fastapi import FastAPI
from app.routes import user
from app.routes import auth
from fastapi import APIRouter


app = FastAPI()

# Routers
api_router = APIRouter(prefix="/api") # API Router

# API Endpoints
api_router.include_router(auth.router)
api_router.include_router(user.router)


# Router Includes
app.include_router(api_router)


if __name__ == "__main__":
    uvicorn.run("app.main:app", host="127.0.0.1", port=8000, reload=True)