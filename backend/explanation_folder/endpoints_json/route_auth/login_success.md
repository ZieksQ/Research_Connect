# GET - http://127.0.0.1:5000/api/user/user_data

<br>

## Returned JSON you will receive from this route

---

### Missing User

```json
{
  "status": 400,
  "ok": false,
  "message": "Please log in to access this"
}
```

---

### Success

```json
{
  "status": 200,
  "ok": true,
  "message": {
    "user_info": {
      "id": "self.id",
      "username": "self.username",
      "profile_pic_url": "self.profile_pic_url",
      "role": "self.role",
      "email": "self.email",
      "school": "self.school",
      "program": "self.program"
    },
    "role": "local/google"
  }
}
```

---
