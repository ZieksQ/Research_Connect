# GET - http://127.0.0.1:5000/api/survey/post/count_questions/<int:id>

> Counts how many section and how many quesiton does each seciton has

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

### Missing Survey

```json
{
  "status": 404,
  "ok": false,
  "message": "This survey does not exists"
}
```

---

### Success

```json
{
  "status": 200,
  "ok": true,
  "message": {
    "section_lenth": 3,
    "section1": 4,
    "section2": 2,
    "section3": 7
  }
}
```

---
