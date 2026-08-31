from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker, declarative_base
import os
import ssl
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")


ssl_context = ssl.create_default_context()

engine = create_async_engine(
    DATABASE_URL,
    echo=True,
    connect_args={
        "ssl": ssl_context
    })

AsyncSessionLocal = sessionmaker(
    bind=engine,
    class_=AsyncSession,
    # expire_on_commit=False
)

Base = declarative_base()


async def get_db():
    async with AsyncSessionLocal() as session:
        yield session
        
async def init_db():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)


