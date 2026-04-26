import uvicorn
from fastapi import FastAPI
from app.routes import user
from app.routes import auth
from fastapi import APIRouter

app = FastAPI()

api_router = APIRouter(prefix="/api")

api_router.include_router(auth.router)
api_router.include_router(user.router)


# app.include_router(auth.router, prefix="/api")
# app.include_router(user.router, prefix="/api")


if __name__ == "__main__":
    uvicorn.run("app.main:app", host="127.0.0.1", port=8000, reload=True)