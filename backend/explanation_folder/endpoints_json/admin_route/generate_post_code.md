# GET - http://127.0.0.1:5000/api/admin/generate/post_code

## Returned JSON you will receive from this route

---

### Non existing Post

```json
{
  "status": 404,
  "ok": false,
  "message": "The post does not exist"
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

>code is a random string of 6 characters

```json
{
  "status": 200,
  "ok": true,
  "message": "You have successfulyy generated the code",
  "generated_code": "${code}"
}
```

---
