# POST - http://127.0.0.1:5000/api/user/refresh

## JSON you need to send here

> You do not need to send anything but chatgpt says this method must be a post for security issues

---

<br>

## Returned JSON you will receive from this route

---

### Missing token

```json
{
  "status": 404,
  "ok": false,
  "message": "You need to log in again"
}
```

---

### Missing User

```json
{
  "status": 401,
  "ok": false,
  "message": "Please log in"
}
```

---

### Success

```json
{
  "status": 200,
  "ok": true,
  "message": "${user_id} refresh access cookie"
}
```

---
