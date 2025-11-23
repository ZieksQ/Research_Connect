# POST - http://127.0.0.1:5000/api/survey/questionnaire/is_answered

## JSON you need to send here

```json
"survey_id": 1
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

### Missing survey ID

```json
{
  "status": 404,
  "ok": false,
  "message": "Please do not tamper with the JSON"
}
```

---

### Missing Survey

```json
{
  "status": 404,
  "ok": false,
  "message": "There is no such post like that"
}
```

---

### User already answerd the survey

```json
{
  "status": 409,
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
  "message": "You already answered this survey.",
  "is_answered": true
}
```

---

### Success

```json
{
  "status": 200,
  "ok": true,
  "message": "You have not answered this yet",
  "is_answered": false
}
```

---
