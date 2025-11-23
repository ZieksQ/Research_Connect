# GET - http://127.0.0.1:5000/api/user/user_data

<br>

## Returned JSON you will receive from this route

---

### Missing User

```json
{
  "status": 401,
  "ok": false,
  "message": "How did you even access this, you are not in the database"
}
```

---

### Success

> basically fuck ton of user posts

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
    "user_posts": [
      {
        "pk_survey_id": "id",
        "survey_title": "title",
        "survey_content": "content",
        "survey_category": ["category"],
        "survey_target_audience": ["target_audience"],
        "survey_date_created": "date_created",
        "survey_date_updated": "date_updated",
        "user_username": "user.username",
        "user_profile": "user.profile_pic_url"
      },
      {
        "pk_survey_id": "id",
        "survey_title": "title",
        "survey_content": "content",
        "survey_category": ["category"],
        "survey_target_audience": ["target_audience"],
        "survey_date_created": "date_created",
        "survey_date_updated": "date_updated",
        "user_username": "user.username",
        "user_profile": "user.profile_pic_url"
      },
      {
        "pk_survey_id": "id",
        "survey_title": "title",
        "survey_content": "content",
        "survey_category": ["category"],
        "survey_target_audience": ["target_audience"],
        "survey_date_created": "date_created",
        "survey_date_updated": "date_updated",
        "user_username": "user.username",
        "user_profile": "user.profile_pic_url"
      }
    ]
  }
}
```

---
