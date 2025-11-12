Here's the JSON template for your backend developer:

FormData Structure

The backend will receive a FormData object with:
`surveyData`: JSON string (parse it to get the object below)
Multiple image files with keys like `image_question-123456789`

---

JSON Template (`surveyData` field):

```json
{
  "surveyTitle": "Customer Satisfaction Survey",
  "surveyDescription": "We'd love to hear your feedback about our services",
  "surveyApproxTime": "5-10 minutes",
  "surveyTags": [
    "Customer Service",
    "Product Feedback",
    "User Experience"
  ],
  "target": "All Customers",
  "data": [
    {
      "id": "section-1234567890",
      "title": "Personal Information",
      "description": "Tell us about yourself",
      "collapsed": false,
      "questions": [
        {
          "id": "question-1234567890",
          "title": "What is your name?",
          "type": "Text",
          "required": true,
          "options": [],
          "image": null,
          "video": null,
          "minChoices": 1,
          "maxChoices": 1
        },
        {
          "id": "question-1234567891",
          "title": "What is your email?",
          "type": "Email",
          "required": true,
          "options": [],
          "image": null,
          "video": null,
          "minChoices": 1,
          "maxChoices": 1
        }
      ]
    },
    {
      "id": "section-1234567891",
      "title": "Feedback",
      "description": "Share your thoughts",
      "collapsed": false,
      "questions": [
        {
          "id": "question-1234567892",
          "title": "How would you rate our service?",
          "type": "Rating",
          "required": true,
          "options": [],
          "image": {
            "name": "service-icon.png",
            "type": "image/png",
            "size": 45678,
            "fieldName": "image_question-1234567892"
          },
          "video": null,
          "minChoices": 1,
          "maxChoices": 1
        },
        {
          "id": "question-1234567893",
          "title": "Which features do you use most?",
          "type": "Multiple Choice",
          "required": false,
          "options": [
            {
              "id": "option-1234567890",
              "text": "Dashboard"
            },
            {
              "id": "option-1234567891",
              "text": "Reports"
            },
            {
              "id": "option-1234567892",
              "text": "Analytics"
            }
          ],
          "image": null,
          "video": "https://youtube.com/watch?v=example123",
          "minChoices": 1,
          "maxChoices": 3
        },
        {
          "id": "question-1234567894",
          "title": "How satisfied are you?",
          "type": "Single Choice",
          "required": true,
          "options": [
            {
              "id": "option-1234567893",
              "text": "Very Satisfied"
            },
            {
              "id": "option-1234567894",
              "text": "Satisfied"
            },
            {
              "id": "option-1234567895",
              "text": "Neutral"
            },
            {
              "id": "option-1234567896",
              "text": "Dissatisfied"
            }
          ],
          "image": null,
          "video": null,
          "minChoices": 1,
          "maxChoices": 1
        },
        {
          "id": "question-1234567895",
          "title": "Additional comments?",
          "type": "Essay",
          "required": false,
          "options": [],
          "image": null,
          "video": null,
          "minChoices": 1,
          "maxChoices": 1
        },
        {
          "id": "question-1234567896",
          "title": "Select your department",
          "type": "Dropdown",
          "required": true,
          "options": [
            {
              "id": "option-1234567897",
              "text": "Sales"
            },
            {
              "id": "option-1234567898",
              "text": "Marketing"
            },
            {
              "id": "option-1234567899",
              "text": "Engineering"
            }
          ],
          "image": null,
          "video": null,
          "minChoices": 1,
          "maxChoices": 1
        },
        {
          "id": "question-1234567897",
          "title": "When did you join?",
          "type": "Date",
          "required": false,
          "options": [],
          "image": null,
          "video": null,
          "minChoices": 1,
          "maxChoices": 1
        }
      ]
    }
  ]
}
```

---

Question Types Reference:

| Type | Description | Has Options | Has Min/Max Choices |
|------|-------------|-------------|---------------------|
| `Text` | Short text input | No | No |
| `Essay` | Long text/textarea | No | No |
| `Email` | Email input with validation | No | No |
| `Date` | Date picker | No | No |
| `Single Choice` | Radio buttons (select one) | Yes | No |
| `Multiple Choice` | Checkboxes (select multiple) | Yes | Yes |
| `Dropdown` | Select dropdown | Yes | No |
| `Rating` | Star rating (1-5) | No | No |

---

Image Handling:

When a question has an image:
```json
"image": {
  "name": "filename.png",
  "type": "image/png",
  "size": 45678,
  "fieldName": "image_question-1234567892"
}
```

The actual image file will be in FormData with key: `image_question-1234567892`

---

Backend Processing Example (Node.js):

```javascript
// Using Express + Multer
app.post('/api/survey', upload.any(), (req, res) => {
  const surveyData = JSON.parse(req.body.surveyData);
  const imageFiles = req.files; // Array of uploaded files
  
  // Match images to questions
  surveyData.data.forEach(section => {
    section.questions.forEach(question => {
      if (question.image) {
        const imageFile = imageFiles.find(f => f.fieldname === question.image.fieldName);
        // imageFile contains: fieldname, originalname, mimetype, size, buffer, path
      }
    });
  });
});
```