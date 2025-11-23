# POST - http://127.0.0.1:5000/api/survey/post/send/questionnaire/web

## JSON you need to send here

> I will not even bother with this since you know what it is

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

### Missing data

```json
{
  "status": 400,
  "ok": false,
  "message": "You did not provide any data for the survey"
}
```

---

### Title and description is missing

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

### Title and description did not meet the requirements

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

### Web survey questions is missing

```json
{
  "status": 400,
  "ok": false,
  "message": {
    "Section1": [
      ["Section 1: Title is missing"],
      [
        "Question 1: Title is missing",
        "Question 1: Max Choices is missing",
        "Question 1: Options is missing"
      ],
      [
        "Question 2 is missing",
        "Question 2: Title is missing",
        "Question 2: Min Choices is missing",
        "Question 2: Max Choices is missing",
        "Question 2: Type is missing"
      ]
    ],
    "Section2": [
      ["Section 2: Title is missing", "Section 2: Quesitons is missing"]
    ]
  }
}
```

---

### Web survey questions did not meet requirements

```json
{
  "status": 422,
  "ok": false,
  "message": {
    "Section1": [
      "Section title must be at least 5 characters long",
      [
        "Question1: Question text must be at least 4 words",
        "Question1: Wrong question type, please choose within [text, multiple_choice, ...]"
      ],
      ["Question2: Choice text must be at least 1 character long"]
    ],
    "Section2": [["Question1:Question text must not exceed 150 words"]],
    "has_violations": true
  }
}
```

---

### Survey misc data e.g. approx time, tags, target audience is missing

```json
{
  "status": 404,
  "ok": false,
  "message": {
    "approx_time": "Missing approx time",
    "tags": "Missing tags",
    "target_audience": "Missing target audience"
  }
}
```

---

### Survey misc data e.g. approx time, tags, target audience did not meet the requirements

```json
{
  "status": 422,
  "ok": false,
  "message": {
    "approx_time": "approx time must be at least or not exceed x character long",
    "tags": "tags must be at least or not exceed x character long",
    "target_audience": "target audience must be at least or not exceed x character long"
  }
}
```

---

### If question has image but failed to upload in supabase

```json
{
  "status": 500,
  "ok": false,
  "message": "supabase will provide this"
}
```

---

### If user inputed a post code but is non existent

```json
{
  "status": 404,
  "ok": false,
  "message": "The code you have entered is either used or non-existent"
}
```

---

### If user inputed a post code but is expired

```json
{
  "status": 400,
  "ok": false,
  "message": "Post added successfully"
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
