from sqlalchemy import TIMESTAMP, Column, Integer, String, func
from .database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True)
    name = Column(String)
    email = Column(String, unique=True)
    sub = Column(String, unique=True)
    created_at = Column(TIMESTAMP, server_default=func.now())