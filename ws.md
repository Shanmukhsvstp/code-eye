# Variables:

```
rooms --> dict

### Class Room:
room_id --> room_id --> string, room code
owner --> owner_id --> string, owner's user id
admins --> set([owner_id]) --> set of owner ids (why not list? set doesn't allow duplicates)
clients --> dict
code --> dict
```

# Functions:

## join_room(room_id, user_id, websocket):

    if room_id is not in rooms (dict):
        rooms[room_id] = Room(room_id, user_id) <-- Here, we create new "Room" (from class) initialized current user as owner of that room since its not already in our rooms dict and it is a new room request, so the current / first user is the owner of that room

    # If the room alrady exists, algo skips here automatically, else it creates the room in dict and jumps here
    room = rooms[room_id] <-- Create and init variable with value of current room's key in the rooms dict

    # If this same current user lost connection unexpectedly, we gotta first remove him from the dict or clear his previous connection

    if user_id in room.clients: <-- It's room.clients, not room["clients"], cuz room points to an existing class "Room" here, not another dict
        try:
            await room.clients[user_id].close()
        except:
            pass

    
    await websocket.accept() <--- Accept the join connection
    room.clients[user_id] = websocket <--- Then store the current websocket connection in this clients dict, with key as current user_id

    room.code.setdefault(user_id, [])  <--- in code dict for current user_id's key, the value is not changed if it exists, else it initializes an empty array

    # finally, return the Room class component, the created one
    return room


    Example of our DS after a few users joined:
```
    room = {
    "room_id": "room1",
    "owner": "user1",
    "admins": {"user1", "user2"},
    "clients": {
        "user1": <WebSocket object at 0xabc>,
        "user2": <WebSocket object at 0xdef>,
        "user3": <WebSocket object at 0xghi>
    },
    "code": {
        "user1": [
            "def hello():",
            "    print('hi')"
        ],
        "user2": [
            "console.log('hello')"
        ],
        "user3": []
        }
    }
```

## leave_room(room, user_id):
    """function to remove user, call whenever user wants to leave the session"""
    room.clients.pop(user_id, None) <--- remove user_id from clients list, basically remove's websocket connection from memory

    
    if not room.clients: <<< If clients are empty, i mean no other clients are in the room
        rooms.pop(room.room_id, None) <<< Remove the whole room, clear everything

## update_code(room, user_id, line, content):
    
    code = room.code.setdefault(user_id, [])  <--- in code dict for current user_id's key, the value is not changed if it exists, else it initializes an empty array


    # Since we cant go to a non existing index in the array, we just create an empty array until the current index
    while len(code) <= line:
        code.append("")
    # Now update that index's line relating code
    code[line] = content

## broadcast(room, message, target="all"):

    if target == "admins":
        broadcast to all admins
    elif target == "clients":
        broadcast to all clients

<!-- # Broadcasting message types and examples:

## A user joined the room:
{
    "type": "user_joined",
    "user_id": "bob",
    "target": "all"
}

## Client's code has been updated
{
    "type": "code_update",
    "user_id": "alice",
    "line": 3,
    "content": "print('hello')",
    "stress_score": 0.01,
    "target": "admins"
}

## Sync code of all clients
{
    "type": "full_sync",
    "code": {
        "alice": ["print('hi')"],
        "bob": ["x = 10"]
    },
    "target": "admins"
}

## Role updates
{
    "type": "role_update",
    "user_id": "charlie",
    "role": "admin",
    "target": "all"
}
or
{
    "type": "role_update",
    "user_id": "charlie",
    "role": "client",
    "target": "all"
}

## A user left:
{
    "type": "user_left",
    "user_id": "bob",
    "target": "all"
} -->


# Broadcasting Message Types (Structure)

---

## `user_joined`

**Target:** `all`

```json
{
    "type": "user_joined",
    "user_id": "u2",
    "role": "client"
}
```

---

## `user_left`

**Target:** `all`

```json
{
    "type": "user_left",
    "user_id": "u2"
}
```

---

## `code_update`

**Target:** `admins`

```json
{
    "type": "code_update",
    "user_id": "u1",
    "line": 3,
    "content": "print('hello')",
    "stress_score": 0.01
}
```

---

## `full_sync`

**Target:** `admins`

```json
{
    "type": "full_sync",
    "code": {
        "u1": ["print('hi')"],
        "u2": ["x = 10"]
    },
    "users": ["u1", "u2"],
    "admins": ["u1"]
}
```

---

## `role_update`

**Target:** `all`

```json
{
    "type": "role_update",
    "user_id": "u3",
    "role": "admin"
}
```

or

```json
{
    "type": "role_update",
    "user_id": "u3",
    "role": "client"
}
```

---

## `req_help`

**Target:** `admins`

```json
{
    "type": "req_help",
    "user_id": "u3"
}
```

---