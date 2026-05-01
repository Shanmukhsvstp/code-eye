rooms = {}

class Room:
    def __init__(self, room_id, owner_id):
        self.room_id = room_id
        self.owner = owner_id
        self.admins = set([owner_id])
        self.clients = {}
        self.code = {}

async def join_room(room_id, user_id, websocket):
    if room_id not in rooms:
        rooms[room_id] = Room(room_id, user_id)

    room = rooms[room_id]

    # close old connection first
    if user_id in room.clients:
        try:
            await room.clients[user_id].close()
        except:
            pass

    await websocket.accept()
    room.clients[user_id] = websocket

    room.code.setdefault(user_id, [])

    return room


def leave_room(room, user_id):
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


async def broadcast(room, message, target="all"):
    dead = []

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