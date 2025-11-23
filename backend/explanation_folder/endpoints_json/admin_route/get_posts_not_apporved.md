# GET - http://127.0.0.1:5000/api/admin/post/get/not_approved

## Returned JSON you will receive from this route

---

### Success
> Basically a list of fuck ton of user posts
```json
{
  "status": 200,
  "ok": true,
  "message": [
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
```

---
