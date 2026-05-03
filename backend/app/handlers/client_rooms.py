from app.models.broadcast_messages import Message

rooms = {}
message = Message

class Room:
    def __init__(self, room_id, owner_id):
        self.room_id = room_id
        self.owner = owner_id
        self.admins = set([owner_id])
        self.clients = {}
        self.code = {}

async def join_room(room_id, user_id, websocket):
    currRole = "client"
    if room_id not in rooms:
        rooms[room_id] = Room(room_id, user_id)
        currRole = "admin"
        
    room = rooms[room_id]
    
    if user_id in room.admins:
        currRole = "admin"

    # close old connection first
    if user_id in room.clients:
        try:
            await room.clients[user_id].close()
        except:
            pass

    await websocket.accept()
    room.clients[user_id] = websocket

    room.code.setdefault(user_id, [])
    
    
    # await websocket.send_json(join_msg)
    
    initial_state = {
        "type": "room_state",
        "users": [
            {
                "user_id": each_user_id,
                "role": "admin" if each_user_id in room.admins else "client"
            }
            for each_user_id in room.clients.keys()
        ]
    }
    
    await websocket.send_json(initial_state)

    join_msg = message.user_joined(user_id=user_id, role=currRole)
    
    await broadcast(room=room, message=join_msg)

    return room


def leave_room(room_code, user_id):
    room = rooms.get(room_code)
    print(f"TEST: {room} - {room_code}")
    if room is not None:
        room.clients.pop(user_id, None)

    # optional: remove code or keep it
    # room.code.pop(user_id, None)

    if not room.clients:
        rooms.pop(room.room_id, None)


async def update_code(room, user_id, line, content):
    code = room.code.setdefault(user_id, [])

    while len(code) <= line:
        code.append("")

    code[line] = content


async def broadcast(room, message, target="all", target_user=None):
    dead = []
    if target_user != None:
        ws = room.clients.get(target_user)
        if ws:
            try:
                await ws.send_json(message)
            except:
                room.clients.pop(target_user, None)
            return
                
    for user_id, ws in room.clients.items():

        if target == "admins" and user_id not in room.admins:
            continue

        if target == "clients" and user_id in room.admins:
            continue

        try:
            await ws.send_json(message)
        except Exception:
            dead.append(user_id)

    for user_id in dead:
        room.clients.pop(user_id, None)
