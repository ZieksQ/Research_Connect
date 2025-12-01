# POST - http://127.0.0.1:5000/api/admin/generate/admin_acc/solo

## JSON you need to send here

```json
{
  "reject_msg": "You did not met the requirements",
  "post_id": 1
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
  "message": "You must provide a reject message"
}
```

---

### Missing Post

```json
{
  "status": 404,
  "ok": false,
  "message": "The post you tried to reject is non existent"
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
  "message": "You have rejected ${post_id}"
}
```

---
