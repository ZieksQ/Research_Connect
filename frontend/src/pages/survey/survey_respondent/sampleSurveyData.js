export const sampleSurveyData = {
  "surveyTitle": "Customer Satisfaction Survey 2024",
  "surveyDescription": "Help us improve our services by sharing your valuable feedback. This survey will take approximately 5-10 minutes to complete.",
  "surveyApproxTime": "5-10 minutes",
  "surveyTags": ["Customer Service", "Product Feedback", "User Experience"],
  "target": "All Customers",
  "data": [
    {
      "id": "section-1",
      "title": "Personal Information",
      "description": "Tell us a bit about yourself",
      "collapsed": false,
      "questions": [
        {
          "id": "question-1",
          "title": "What is your full name?",
          "type": "Text",
          "required": true,
          "options": [],
          "image": null,
          "video": null,
          "minChoices": 1,
          "maxChoices": 1
        },
        {
          "id": "question-2",
          "title": "What is your email address?",
          "type": "Email",
          "required": true,
          "options": [],
          "image": null,
          "video": null,
          "minChoices": 1,
          "maxChoices": 1
        },
        {
          "id": "question-3",
          "title": "When did you first use our service?",
          "type": "Date",
          "required": false,
          "options": [],
          "image": null,
          "video": null,
          "minChoices": 1,
          "maxChoices": 1
        }
      ]
    },
    {
      "id": "section-2",
      "title": "Service Feedback",
      "description": "Share your experience with our service",
      "collapsed": false,
      "questions": [
        {
          "id": "question-4",
          "title": "How would you rate our overall service?",
          "type": "Rating",
          "required": true,
          "options": [],
          "image": null,
          "video": null,
          "minChoices": 1,
          "maxChoices": 1
        },
        {
          "id": "question-5",
          "title": "How satisfied are you with our customer support?",
          "type": "Single Choice",
          "required": true,
          "options": [
            { "id": "option-1", "text": "Very Satisfied" },
            { "id": "option-2", "text": "Satisfied" },
            { "id": "option-3", "text": "Neutral" },
            { "id": "option-4", "text": "Dissatisfied" },
            { "id": "option-5", "text": "Very Dissatisfied" }
          ],
          "image": null,
          "video": null,
          "minChoices": 1,
          "maxChoices": 1
        },
        {
          "id": "question-6",
          "title": "Which features do you use most often? (Select up to 3)",
          "type": "Multiple Choice",
          "required": false,
          "options": [
            { "id": "option-6", "text": "Dashboard" },
            { "id": "option-7", "text": "Reports & Analytics" },
            { "id": "option-8", "text": "Team Collaboration" },
            { "id": "option-9", "text": "Mobile App" },
            { "id": "option-10", "text": "Integrations" },
            { "id": "option-11", "text": "API Access" }
          ],
          "image": null,
          "video": null,
          "minChoices": 1,
          "maxChoices": 3
        }
      ]
    },
    {
      "id": "section-3",
      "title": "Additional Feedback",
      "description": "Help us understand your needs better",
      "collapsed": false,
      "questions": [
        {
          "id": "question-7",
          "title": "Which department do you work in?",
          "type": "Dropdown",
          "required": false,
          "options": [
            { "id": "option-12", "text": "Sales" },
            { "id": "option-13", "text": "Marketing" },
            { "id": "option-14", "text": "Engineering" },
            { "id": "option-15", "text": "Customer Support" },
            { "id": "option-16", "text": "Human Resources" },
            { "id": "option-17", "text": "Other" }
          ],
          "image": null,
          "video": null,
          "minChoices": 1,
          "maxChoices": 1
        },
        {
          "id": "question-8",
          "title": "What improvements would you like to see?",
          "type": "Essay",
          "required": false,
          "options": [],
          "image": null,
          "video": null,
          "minChoices": 1,
          "maxChoices": 1
        },
        {
          "id": "question-9",
          "title": "Would you recommend our service to others?",
          "type": "Single Choice",
          "required": true,
          "options": [
            { "id": "option-18", "text": "Definitely Yes" },
            { "id": "option-19", "text": "Probably Yes" },
            { "id": "option-20", "text": "Not Sure" },
            { "id": "option-21", "text": "Probably No" },
            { "id": "option-22", "text": "Definitely No" }
          ],
          "image": null,
          "video": null,
          "minChoices": 1,
          "maxChoices": 1
        }
      ]
    }
  ]
};
