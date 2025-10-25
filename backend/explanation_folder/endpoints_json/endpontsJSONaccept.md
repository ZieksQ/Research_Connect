# Below is a list of API endpoints and the corresponding JSON data they accept

<br>

# /api/user
<br>

> ### http://127.0.0.1:5000/api/user/register

```JSON
{
"username": "John Doe",
"password": "@JohnDoe12345"
}
```
<br>

> #### http://127.0.0.1:5000/api/user/login

  

```JSON
{
"username": "John Doe",
"password": "@JohnDoe12345"
}
```
<br>  

> #### http://127.0.0.1:5000/api/user/logout

```
{
Di ko alam bat post dito, pero wala kayong need lagay na data
}
```
<br>

> #### http://127.0.0.1:5000/api/user/profile_upload

```

Image file sesend nyo dito( "jpg", "jpeg", "png" )

FormData for JS

Di ko alam kung pano sa dart/flutter, ask chatgpt

```

  

> #### http://127.0.0.1:5000/api/user/refresh

  

```
explain so sayo sa f2f andy :ey: kakatmad pag sa chat kasi ni explain ko na kay acob to eh
```

---
<br>

# /api/survey

<br>

> #### http://127.0.0.1:5000/api/survey/post/send

```JSON
{
"post_title": "minimum 4 words, maximum 40 words",
"post_content": "minimum 20 words, maximum 100 words",
"survey_title": "minimum 4 words, maximum 40 words",
"survey_content": "minimum 20 words, maximum 400 words",
"survey_questions": {
		"questionNo.1": {
	      "question": "What is the capital of France?",
	      "type": "multiple_choice",
	      "choice": ["Paris", "London", "Berlin"],
	      "answer": "Paris",
	      "required": True
	    },
	    "questionNo.2": {
	      "question": "Which language is primarily used for Android app development?",
	      "type": "multiple_choice",
	      "choice": ["Kotlin", "Swift", "JavaScript"],
	      "answer": "Kotlin",
	      "required": False
	    },
	    "questionNo.3": {
	      "question": "Explain the importance of data structures in computer science.",
	      "type": "essay",
	      "required": False
	    },
	    "questionNo.4": {
	      "question": "Describe a real-world scenario where machine learning can be applied.",
	      "type": "essay",
	      "required": True
	    }
	}
}
```

<br>

> #### http://127.0.0.1:5000/api/survey/answer/questionnaire/<int:id>

The <int:id> is the ID of the post itself, not the survey
```JSON
{
	"1": "Paris",
	"2": "Kotlin",
	"3": "a realy long text",
	"4": "imagine a really long key value pair of id and answer"
}
```

<br>

# /api/otp
<br>

> #### http://127.0.0.1:5000/api/otp/send_otp

```JSON
{
	"email" : "youremail@gmail.com"
}
```