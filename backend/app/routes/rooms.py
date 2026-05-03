from fastapi import APIRouter, Request, Query, WebSocket, WebSocketDisconnect, Depends
from app.db.database import get_db
from sqlalchemy.ext.asyncio import AsyncSession
from app.handlers.user import fetchUser
from fastapi.security import OAuth2PasswordBearer
from app.handlers.client_rooms import join_room, leave_room
from fastapi.security import OAuth2PasswordBearer
from app.utils.jwt import extractUserId
from fastapi import HTTPException
from app.models.models import Room

router = APIRouter(prefix="/rooms", tags=["rooms"])
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="")


@router.get("/create")
async def createRoom(
    db: AsyncSession = Depends(get_db), 
    token: str = Depends(oauth2_scheme)
):    
    user = await fetchUser(token=token, db=db)
    
    if user is None:
        raise HTTPException(status_code=401, detail="Unauthorized")
    
    room = Room(
        created_by = user["id"]
    )
    db.add(room)
    await db.commit()
    await db.refresh(room)
    return {"code": room.id}
    
        

@router.websocket("/{room_code}")
async def websocket(
    websocket: WebSocket,
    room_code: str,
    token: str | None = None,
    db: AsyncSession = Depends(get_db)
):
    
    if not token:
        websocket.close(1000)
        return
    
    user = await fetchUser(token=token, db=db)
    
    await join_room(room_id=room_code, user_id=user["id"], websocket=websocket)
    
    try:
        while True:
            data = await websocket.receive_json()
            message_type = data.get("type")
            print(data)
            await websocket.send_text(
                f""
            )
    except WebSocketDisconnect:
        leave_room(room_code=room_code, user_id=user["id"])
        print(f"{user['display_name']} left {room_code}")