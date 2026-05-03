from sqlalchemy import (
    Column,
    BigInteger,
    String,
    Boolean,
    Text,
    TIMESTAMP,
    ForeignKey,
    func,
    text
)
from sqlalchemy.orm import relationship
from ..db.database import Base
import time
import threading
import random
import string


ALPHABET = "abcdefghjkmnpqrstuvwxyz23456789"


def generate_room_code(groups=(3, 4, 3)):
    parts = []
    for size in groups:
        part = ''.join(random.choice(ALPHABET) for _ in range(size))
        parts.append(part)
    return '-'.join(parts)


class Snowflake:
    def __init__(self, machine_id: int):
        self.machine_id = machine_id & 0x3FF  # 10 bits
        self.sequence = 0
        self.last_timestamp = -1
        self.lock = threading.Lock()

        self.epoch = 1672531200000  # custom epoch (Jan 1, 2023 in ms)

    def _timestamp(self):
        return int(time.time() * 1000)

    def generate(self):
        with self.lock:
            timestamp = self._timestamp()

            if timestamp == self.last_timestamp:
                self.sequence = (self.sequence + 1) & 0xFFF  # 12 bits
                if self.sequence == 0:
                    while timestamp <= self.last_timestamp:
                        timestamp = self._timestamp()
            else:
                self.sequence = 0

            self.last_timestamp = timestamp

            return (
                ((timestamp - self.epoch) << 22)
                | (self.machine_id << 12)
                | self.sequence
            )

# USERS
class User(Base):
    __tablename__ = "users"

    _snowflake = Snowflake(machine_id=1)

    id = Column(
        BigInteger,
        primary_key=True,
        default=lambda: User._snowflake.generate()
    )

    display_name = Column(Text, nullable=False)
    email = Column(Text, unique=True, nullable=False)
    name = Column(Text, nullable=False)
    profile_picture = Column(Text, server_default=text("''"))

    sub = Column(Text, unique=True, nullable=False)

    created_at = Column(TIMESTAMP, server_default=func.now())

    # Relationships
    clients = relationship("Client", back_populates="user", cascade="all, delete")
    rooms = relationship("Room", back_populates="creator", cascade="all, delete")
    connections = relationship("Connection", back_populates="user", cascade="all, delete")



# CLIENTS
class Client(Base):
    __tablename__ = "clients"

    id = Column(BigInteger, primary_key=True)

    is_admin = Column(Boolean, nullable=False, server_default=text("false"))

    user_id = Column(
        BigInteger,
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False
    )

    created_at = Column(TIMESTAMP, server_default=func.now())

    # Relationships
    user = relationship("User", back_populates="clients")
    connections = relationship("Connection", back_populates="client", cascade="all, delete")



# ROOMS
class Room(Base):
    __tablename__ = "rooms"
    
    # def_code = generate_room_code()

    id = Column(Text, primary_key=True, default=generate_room_code)

    created_by = Column(
        BigInteger,
        ForeignKey("users.id"),
        nullable=False
    )

    created_at = Column(TIMESTAMP, server_default=func.now())

    # Relationships
    creator = relationship("User", back_populates="rooms")
    connections = relationship("Connection", back_populates="room", cascade="all, delete")



# CONNECTIONS (messages/events)
class Connection(Base):
    __tablename__ = "connections"

    id = Column(BigInteger, primary_key=True)

    user_id = Column(
        BigInteger,
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False
    )

    room_id = Column(
        Text,
        ForeignKey("rooms.id", ondelete="CASCADE"),
        nullable=False
    )

    client_id = Column(
        BigInteger,
        ForeignKey("clients.id", ondelete="CASCADE"),
        nullable=False
    )

    content = Column(Text, nullable=False)

    created_at = Column(TIMESTAMP, server_default=func.now())

    # Relationships
    user = relationship("User", back_populates="connections")
    room = relationship("Room", back_populates="connections")
    client = relationship("Client", back_populates="connections")