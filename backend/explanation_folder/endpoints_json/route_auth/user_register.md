# POST - http://127.0.0.1:5000/api/user/register

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

### username nad password did not meet requirements

```json
{
  "status": 422,
  "ok": false,
  "message": {
    "username": "Username must be at least or not exceed x characters",
    "password": "password must be at least or not exceed or must contain x character/s"
  }
}
```

---

### Username already exists

```json
{
  "status": 409,
  "ok": false,
  "message": "username already exists"
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
  "message": "You have successfully registered"
}
```

---
