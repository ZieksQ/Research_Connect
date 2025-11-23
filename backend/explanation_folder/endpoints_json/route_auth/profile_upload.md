# PATCH - http://127.0.0.1:5000/api/user/profile_upload

## JSON you need to send here

> This is formdata and not JSON. it only accepts, png, jpg, jpeg

```json
{
  "profile_pic": "An image file that is sent through formdata"
}
```

---

<br>

## Returned JSON you will receive from this route

---

### Missing User

```json
{
  "status": 400,
  "ok": false,
  "message": "You need to log in to access this"
}
```

---

### Profile did not meet requirements

```json
{
  "status": 400,
  "ok": false,
  "message": "Missing filename, file extension is not allowed, Missing file"
}
```

---

### File upload error

```json
{
  "status": 500,
  "ok": false,
  "message": "error provided by supabase"
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
  "message": "You have uploaded your pfp"
}
```

---
