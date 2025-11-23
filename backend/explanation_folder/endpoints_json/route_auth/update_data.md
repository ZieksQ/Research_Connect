# PATCH - http://127.0.0.1:5000/api/user/update_data

## JSON you need to send here

> These are all optional

```json
{
  "username": "Acoblaren",
  "school": "LSPU",
  "program": "BSIT"
}
```

---

<br>

## Returned JSON you will receive from this route

---

### Missing user

```json
{
  "status": 401,
  "ok": false,
  "message": "You need to log in to access this"
}
```

---

### Input data did not meet requirements

```json
{
  "status": 422,
  "ok": false,
  "message": {
    "username": "Username must be at least or not exceed x character",
    "school": "School must be at least or not exceed x character",
    "program": "Program must be at least or not exceed x character"
  }
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
