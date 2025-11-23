# POST - http://127.0.0.1:5000/api/survey/answer/questionnaire/<int:id>

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

### Missing Survey

```json
{
  "status": 404,
  "ok": false,
  "message": "YThere is no such post like that"
}
```

---

### Missing data

```json
{
  "status": 400,
  "ok": false,
  "message": "You must provide an answer"
}
```

---

### Survey is already answered

```json
{
  "status": 409,
  "ok": false,
  "message": "You already answered this survey."
}
```

### User tried to bypass a questin that is required or messed with the date format

```json
{
  "status": 400,
  "ok": false,
  "message": [
    "Section 1 is missing",
    "Section1 - Question2: Answer is missing",
    "Section2 - Question1: Wrong date format"
  ],
  "extra_msg": "You know you are required to answer that"
}
```

---

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
