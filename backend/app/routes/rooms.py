from fastapi import APIRouter, Request, Query, WebSocket, WebSocketDisconnect
from app.db.database import get_db
from sqlalchemy.ext.asyncio import AsyncSession
from app.handlers.user import fetchUser
from fastapi.security import OAuth2PasswordBearer

router = APIRouter(prefix="/rooms", tags=["rooms"])

@router.websocket("/{room_code}")
async def websocket(
    websocket: WebSocket,
    room_code: str,
    token: str | None = None
):
    await websocket.accept()
    
    if not token:
        websocket.close(1000)
        return
    
    user = await fetchUser(token=token)
    
    try:
        while True:
            data = await websocket.receive_json()
            message_type = data.get("type")
            print(data)
            await websocket.send_text(
                f""
            )
    except WebSocketDisconnect:
        print(f"{user['display_name']} left {room_code}")