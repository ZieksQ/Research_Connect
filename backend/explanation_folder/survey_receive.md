# The json you will receive when you fetch a survey questionnaire

## These two JSON are the same thing you get when you fetch get_survey.

#### First one is Mobile survey Gabriel send with his format, Second is the survey sent by Acob, Laren Jay, Ignacio with his format, basically the same format since im am that good. But some are added/deleted

```JSON
{
  "message": {
    "pk_survey_id": 2,
    "survey_approx_time": "15",
    "survey_content": "Detailed survey description explaining purpose and contextDetailed survey description explaining purpose and context",
    "survey_section": [
      {
        "pk_section_id": 3,
        "questions": [
          {
            "pk_question_id": 5,
            "question_choices": [
              "Python",
              "JavaScript",
              "Java",
              "C++"
            ],
            "question_id": "1section-demographics",
            "question_image": null,
            "question_maxChoice": 4,
            "question_minChoice": 1,
            "question_number": 1,
            "question_required": true,
            "question_text": "What is your preferred programming language?",
            "question_type": "multipleChoice",
            "question_url": null
          },
          {
            "pk_question_id": 6,
            "question_choices": [
              "React",
              "Vue",
              "Angular",
              "Flutter"
            ],
            "question_id": "2section-demographics",
            "question_image": null,
            "question_maxChoice": 4,
            "question_minChoice": 1,
            "question_number": 2,
            "question_required": true,
            "question_text": "Select all frameworks you have used",
            "question_type": "checkboxes",
            "question_url": null
          }
        ],
        "section_description": "Tell us a bit about yourself and your background",
        "section_id": "section-demographics",
        "section_title": "About You"
      },
      {
        "pk_section_id": 4,
        "questions": [
          {
            "pk_question_id": 7,
            "question_choices": [],
            "question_id": "3section-usage",
            "question_image": null,
            "question_maxChoice": 1,
            "question_minChoice": 1,
            "question_number": 3,
            "question_required": true,
            "question_text": "How would you rate your coding experience?",
            "question_type": "ratingScale",
            "question_url": null
          },
          {
            "pk_question_id": 8,
            "question_choices": [],
            "question_id": "4section-usage",
            "question_image": null,
            "question_maxChoice": 1,
            "question_minChoice": 1,
            "question_number": 4,
            "question_required": false,
            "question_text": "What motivates you to learn programming?",
            "question_type": "shortText",
            "question_url": null
          }
        ],
        "section_description": "How you currently use our platform",
        "section_id": "section-usage",
        "section_title": "Platform Usage"
      },
      {
        "pk_section_id": 5,
        "questions": [
          {
            "pk_question_id": 9,
            "question_choices": [],
            "question_id": "5section-satisfaction",
            "question_image": null,
            "question_maxChoice": 1,
            "question_minChoice": 1,
            "question_number": 5,
            "question_required": false,
            "question_text": "Describe your most challenging project",
            "question_type": "longText",
            "question_url": "https://example.com/video.mp4"
          }
        ],
        "section_description": "Rate your experience with our services",
        "section_id": "section-satisfaction",
        "section_title": "Satisfaction Ratings"
      },
      {
        "pk_section_id": 6,
        "questions": [
          {
            "pk_question_id": 10,
            "question_choices": [
              "yes",
              "no"
            ],
            "question_id": "6section-preferences",
            "question_image": null,
            "question_maxChoice": 2,
            "question_minChoice": 1,
            "question_number": 6,
            "question_required": true,
            "question_text": "Would you recommend programming as a career?",
            "question_type": "yesNo",
            "question_url": null
          }
        ],
        "section_description": "Help us prioritize future development",
        "section_id": "section-preferences",
        "section_title": "Feature Preferences"
      },
      {
        "pk_section_id": 7,
        "questions": [
          {
            "pk_question_id": 11,
            "question_choices": [
              "VS Code",
              "IntelliJ IDEA",
              "PyCharm",
              "Sublime Text"
            ],
            "question_id": "7section-feedback",
            "question_image": null,
            "question_maxChoice": 4,
            "question_minChoice": 1,
            "question_number": 7,
            "question_required": true,
            "question_text": "Select your preferred IDE",
            "question_type": "dropdown",
            "question_url": null
          }
        ],
        "section_description": "Share your thoughts and suggestions",
        "section_id": "section-feedback",
        "section_title": "Open Feedback"
      },
      {
        "pk_section_id": 8,
        "questions": [],
        "section_description": "Stay connected with us",
        "section_id": "section-engagement",
        "section_title": "Future Engagement"
      }
    ],
    "survey_tags": [],
    "survey_target_audience": [
      "Students",
      "Professionals"
    ],
    "survey_title": "Survey Title sgjel sjlkdg "
  },
  "ok": true,
  "status": 200
}
```

---

```JSON
{
  "message": {
    "pk_survey_id": 1,
    "survey_approx_time": "10-15 min",
    "survey_content": "this is about the survey no. 2 and this is the description",
    "survey_section": [
      {
        "pk_section_id": 1,
        "questions": [
          {
            "pk_question_id": 1,
            "question_choices": [],
            "question_id": "1question-1763633434439",
            "question_image": null,
            "question_maxChoice": 1,
            "question_minChoice": 1,
            "question_number": 1,
            "question_required": false,
            "question_text": "!uestion number 1",
            "question_type": "shortText",
            "question_url": null
          },
          {
            "pk_question_id": 2,
            "question_choices": [],
            "question_id": "2question-1763633449518",
            "question_image": null,
            "question_maxChoice": 1,
            "question_minChoice": 1,
            "question_number": 2,
            "question_required": true,
            "question_text": "!uestion number 2",
            "question_type": "longText",
            "question_url": null
          }
        ],
        "section_description": "This is the desc for section 1",
        "section_id": "section-1763633422945",
        "section_title": "Section 1"
      },
      {
        "pk_section_id": 2,
        "questions": [
          {
            "pk_question_id": 3,
            "question_choices": [],
            "question_id": "1question-1763633468579",
            "question_image": null,
            "question_maxChoice": 1,
            "question_minChoice": 1,
            "question_number": 1,
            "question_required": true,
            "question_text": "this is the question 1 for section numbe r2",
            "question_type": "singleChoice",
            "question_url": null
          },
          {
            "pk_question_id": 4,
            "question_choices": [],
            "question_id": "2question-1763633496541",
            "question_image": null,
            "question_maxChoice": 3,
            "question_minChoice": 1,
            "question_number": 2,
            "question_required": false,
            "question_text": "this is the question 2 for section number 2",
            "question_type": "multipleChoice",
            "question_url": null
          }
        ],
        "section_description": "this is the desc for section no. 2",
        "section_id": "section-1763633456454",
        "section_title": "Section 2"
      }
    ],
    "survey_tags": [
      "Technology",
      "Entertainment"
    ],
    "survey_target_audience": [
      "business-students",
      "engineering-students"
    ],
    "survey_title": "This is sruvey Number 2."
  },
  "ok": true,
  "status": 200
}
```
