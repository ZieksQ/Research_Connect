# PATCH - http://127.0.0.1:5000/api/admin/approve_post

## JSON you need to send here

---

> id is the primary key id of the post

```json
{
  "id": 1
}
```

---

<br>

## Returned JSON you will receive from this route

---

### Missing id

```json
{
  "status": 400,
  "ok": false,
  "message": "I know you are the admin but please do not tamper with the JSON body"
}
```

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

```json
{
  "status": 200,
  "ok": true,
  "message": "You have approved post number ${id}"
}
```

---
