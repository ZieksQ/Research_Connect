# POST - http://127.0.0.1:5000/api/user/login

## JSON you need to send here

```json
{
  "username": "Acoblaren",
  "password": "@Acob12345"
}
```

---

<br>

## Returned JSON you will receive from this route

---

### Missing username and passowrd

```json
{
  "status": 404,
  "ok": false,
  "message": {
    "username": "Username is missing",
    "passowrd": "Password is missing"
  }
}
```

---

### Username does not exists

```json
{
  "status": 404,
  "ok": false,
  "message": "Username does not exists"
}
```

---

### Incorrect password

```json
{
  "status": 409,
  "ok": false,
  "message": "Incorrect Password"
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
  "message": "You have logged in"
}
```

---
