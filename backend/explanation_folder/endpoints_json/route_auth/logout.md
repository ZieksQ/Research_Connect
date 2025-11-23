# POST - http://127.0.0.1:5000/api/user/refresh/logout

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
  "message": "I dont even know how you got this error. but you dont have a token"
}
```

---

### Token is revoked

```json
{
  "status": 404,
  "ok": false,
  "message": "I dont even know how you got this error. but your JWT has been revoked"
}
```

---

### Database error

```json
{
  "status": 500,
  "ok": false,
  "message": "Database error"
}
```

---

### Success

```json
{
  "status": 200,
  "ok": true,
  "message": "Successfully logged out"
}
```

---
