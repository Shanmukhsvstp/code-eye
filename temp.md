Nice—this is already a solid room system. You’re basically one step away from a proper real-time protocol. The missing piece is just **how to structure and handle JSON messages cleanly**.

Right now you have `send_json`, but you also need a **message format + dispatcher**.

---

# ✅ 1. Define a JSON message protocol

Instead of sending raw text, always send structured JSON like:

```json id="hbb7d1"
{
  "type": "update_code",
  "line": 3,
  "content": "print('hello')"
}
```

Other examples:

```json id="1k5m7g"
{ "type": "join" }
```

```json id="wq8vra"
{ "type": "cursor", "line": 5 }
```

👉 The `"type"` field is the key idea.

---

# 🧠 2. Receive JSON in FastAPI

Replace this:

```python id="k7lq9t"
data = await websocket.receive_text()
```

with:

```python id="x4c5yo"
data = await websocket.receive_json()
```

---

# 🔁 3. Handle different message types

Inside your WebSocket loop:

```python id="9x3v3h"
while True:
    data = await websocket.receive_json()
    msg_type = data.get("type")

    if msg_type == "update_code":
        line = data.get("line")
        content = data.get("content")

        await update_code(room, user_id, line, content)

        await broadcast(room, {
            "type": "code_update",
            "user_id": user_id,
            "line": line,
            "content": content
        })

    elif msg_type == "sync_request":
        await websocket.send_json({
            "type": "full_sync",
            "code": room.code
        })
```

---

# 🌐 4. Frontend sending JSON

Instead of:

```js id="2cbq4h"
socket.send("hello")
```

do:

```js id="r8j9az"
socket.send(JSON.stringify({
  type: "update_code",
  line: 2,
  content: "console.log('hi')"
}));
```

---

# 📥 5. Frontend receiving JSON

```js id="h3n8mz"
socket.onmessage = (event) => {
  const data = JSON.parse(event.data);

  if (data.type === "code_update") {
    console.log("Update:", data);
  }
};
```

---

# ⚠️ 6. Important improvement in your backend

Your `join_room` currently does:

```python id="lgx6sj"
await websocket.accept()
```

But you're not authenticating before that.

👉 Better pattern:

```python id="i2m8d7"
# authenticate first
user = await fetchUser(token)

room = await join_room(room_id, user.id, websocket)
```

Move `accept()` **inside `join_room` only after validation**, or even better—call it outside *after auth*.

---

# 🧩 7. Send initial state on join (critical for UX)

Right after joining:

```python id="d1p0mj"
await websocket.send_json({
    "type": "init",
    "code": room.code,
    "users": list(room.clients.keys())
})
```

Otherwise new users join an empty screen.

---

# 🧹 8. Handle disconnect properly

In your main route:

```python id="h1sj8o"
try:
    while True:
        data = await websocket.receive_json()
        ...
except WebSocketDisconnect:
    leave_room(room, user_id)
```

---

# 🚀 9. Small upgrade to your broadcast

Right now you're doing:

```python id="9dfyqg"
await ws.send_json(message)
```

That’s perfect 👍

But you might want to **exclude sender**:

```python id="0g2zkt"
async def broadcast(room, message, exclude=None):
    for user_id, ws in room.clients.items():
        if user_id == exclude:
            continue
        try:
            await ws.send_json(message)
        except:
            ...
```

---

# 🧠 Big picture (what you built)

You now have the foundation of:

* Google Docs–style collaboration
* Multi-user rooms
* Real-time syncing
* Per-user code tracking

---

# 🔥 If you want next-level features

You can extend this into:

* Cursor positions (`type: "cursor"`)
* Typing indicators
* Shared single document instead of per-user code
* Operational transforms / CRDT (for real collaborative editing)

---

# TL;DR

* Use `receive_json()` / `send_json()`
* Always include `"type"` in messages
* Route logic based on `type`
* Send initial state on join
* Broadcast structured updates

---

If you want, I can help you turn this into a **real collaborative editor (like VS Code Live Share)**—your current structure is already 70% there.
