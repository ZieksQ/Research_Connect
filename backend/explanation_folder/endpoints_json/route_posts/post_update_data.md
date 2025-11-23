## /api/survey

```bash
INTEGER is the ID of the post you want to fetch, useful for when the user clicked the post in a new tab
GET - http://127.0.0.1:5000/api/survey/post/get/INTEGER

GET - http://127.0.0.1:5000/api/survey/post/get
GET - http://127.0.0.1:5000/api/survey/post/search?query=&order=
GET - http://127.0.0.1:5000/api/survey/category/get
GET - http://127.0.0.1:5000/api/survey/post/get/questionnaire/<int:id>

Get all the responses from the survey
GET - http://127.0.0.1:5000/api/survey/post/respones/computed_data/<int:id>

Counts how mant section and how many quesiton does each seciton has
GET - http://127.0.0.1:5000/api/survey/post/count_questions/<int:id>

```

# PATCH - http://127.0.0.1:5000/api/survey/post/update_data

## JSON you need to send here

> post id

```json
{
  "id": 1,
  "title": "post title",
  "post_content": "post content",
  "post_description": "post description",
  "status": "open/closed"
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

### Title and description is missing - Post

```json
{
  "status": 400,
  "ok": false,
  "message": {
    "title": "Missing post title",
    "content": "Missing post description"
  }
}
```

### Title and description did not meet the requirements - Post

```json
{
  "status": 400,
  "ok": false,
  "message": {
    "title": "Post title must be atleast or not exceed x characters",
    "content": "Post description must be atleast or not exceed x characters"
  },
  "extra_msg": "You must meet the requirements"
}
```

---

### Title and description is missing - Survey

```json
{
  "status": 400,
  "ok": false,
  "message": {
    "title": "Missing survey title",
    "content": "Missing survey description"
  }
}
```

### Title and description did not meet the requirements - Survey

```json
{
  "status": 422,
  "ok": false,
  "message": {
    "title": "Survey title must be atleast or not exceed x characters",
    "content": "Survey description must be atleast or not exceed x characters"
  },
  "extra_msg": "You must meet the requirements"
}
```

---

### Status is not acceepted, status must be either "open" or "closed"

```json
{
  "status": 422,
  "ok": false,
  "message": "Please do not tamper with the status JSON (open, closed)"
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
  "message": "You have archibed post No.${id}"
}
```

---
