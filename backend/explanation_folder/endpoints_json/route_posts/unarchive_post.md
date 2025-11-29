# PATCH - http://127.0.0.1:5000/api/survey/post/unarchive

## JSON you need to send here

> post id

```json
"id": 1
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
  "message": "You must log in first in order to post here"
}
```

---

### Missing Post

```json
{
  "status": 404,
  "ok": false,
  "message": "Post does not exists"
}
```

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
  "message": "You have unarchibed post No.${id}"
}
```

---
