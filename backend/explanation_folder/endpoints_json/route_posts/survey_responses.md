# GET - http://127.0.0.1:5000/api/survey/post/respones/computed_data/<int:id>

> Get all the responses from the survey

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

> This was provided by chatgpt so some values might not be correct e.g. question type, by the keys are correct

```json
{
  "status": 200,
  "ok": true,
  "message": {
    "survey_title": "survey.title",
    "survey_content": "survey.content",
    "survey_tags": "survey.tags",
    "survey_approx_time": "survey.approx_time",
    "survey_target_audience": "survey.target_audience",

    "text_data": {
      "q_another_id_1": {
        "question_text": "What is your name?",
        "type": "SHORT_TEXT",
        "answer_data": ["John", "Mary", "Alex"]
      },
      "q_another_id_2": {
        "question_text": "Describe your experience",
        "type": "LONG_TEXT",
        "answer_data": ["It was good", "Pretty bad tbh", "Amazing service!"]
      }
    },

    "choice_data": {
      "q_another_id_3": {
        "question_text": "Select your gender",
        "type": "SINGLE_CHOICE",
        "answer_data": {
          "Male": 15,
          "Female": 19,
          "Prefer not to say": 3
        }
      },
      "q_another_id_4": {
        "question_text": "Pick your hobbies",
        "type": "MULTIPLE_CHOICE",
        "answer_data": {
          "Sports": 8,
          "Reading": 12,
          "Gaming": 20
        }
      }
    },

    "dates_data": {
      "q_another_id_5": {
        "question_text": "When is your birthday?",
        "type": "DATE",
        "answer_data": {
          "2000-05-01": 4,
          "1998-09-18": 2,
          "2003-11-20": 1
        }
      }
    }
  }
}
```

---
