# POST - http://127.0.0.1:5000/api/admin/generate/admin_acc/solo

## JSON you need to send here

```json
{
  "username": "acob",
  "password": "1234"
}
```

---

<br>

## Returned JSON you will receive from this route

---

### Missing input

```json
{
  "status": 400,
  "ok": false,
  "message": "Damn nigga at least fill in these inputs, you asked for these routes"
}
```

---

### Username already exists

```json
{
  "status": 409,
  "ok": false,
  "message": "Username already exists"
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

> code is a random string of 6 characters

```json
{
  "status": 200,
  "ok": true,
  "message": [
    "Admin123 : 1234",
    "admin1234 : 1234",
    "adminb323f5 : 1234",
    "admina04530 : 1234",
    "admin7aaa2b : 1234",
    "admin5df58a : 1234",
    "adminc684ae : 1234",
    "admin4efd45 : 1234",
    "admin502af2 : 1234",
    "adminb8ee62 : 1234",
    "admind6ae7f : 1234",
    "admin27498a : 1234",
    "adminc625cd : 1234",
    "adminf8e658 : 1234",
    "adminb042b8 : 1234",
    "admin4e71fd : 1234",
    "adminfdc6ae : 1234",
    "admina71d84 : 1234",
    "adminb0ba6a : 1234",
    "admin052506 : 1234",
    "adminb1f611 : 1234",
    "admin225247 : 1234",
    "adminc231dd : 1234",
    "admin1f0fac : 1234",
    "admin323ac9 : 1234",
    "admin054dbc : 1234",
    "admin93b5ac : 1234",
    "admin2e0fa2 : 1234",
    "admin40479d : 1234",
    "adminc7fb7a : 1234",
    "admin7b308e : 1234",
    "admine62c55 : 1234"
  ]
}
```

---
