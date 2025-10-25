# This is the list of JSON each function will return(Except GET)

<br>

> ### POST -  http://127.0.0.1:5000/api/survey/post/send/questionnaire

<br>

#### Missing Post/Survey input
```JSON
{
"status": 400,
"ok": False,
"message": {
	"title": "Missing post/survey title",
	"content": "Missing post/survey content"
	}
}
```

#### Missing user
```JSON
{
"status": 401,
"ok": False,
"message": "You must log in first in order to post here"
}
```

#### Missing Requirements Post/Survey title and content
```JSON
{
"status": 422,
"ok": False,
"message": {
	"title": "Post/Survey title must at least or not exceed this word count",
	"content": "Post/Survey content must at least or not exceed this word count"
	}
}
```

#### Missing Survey questions
```JSON
{
"status": 400,
"ok": False,
"message": "Survey is missing data"
"survey": {
	"just a fuck ton of key value pair for each question that is missing"
	}
}
```

#### Missing Requirements for Survey questions
```JSON
{
"status": 422,
"ok": False,
"message": You must meet the requirements for the survey
"survey": {
		"i only have checker for question and question_type so, but still a fuckton of key-value pair"
	}
}
```

#### Database Error
```JSON
{
"status": 500,
"ok": False,
"message": "Database Error"
}
```

#### Success
```JSON
{
"status": 200,
"ok": True,
"message": "Post created by 1"
}
```

---
<br>

> ### POST -  http://127.0.0.1:5000/api/survey/post/search?query=health&order=asc

<br>

#### Not logged in
```JSON
{
"status": 401,
"ok": False,
"message": "You need to log in to access this"
}
```

#### Nothing in search
```JSON
{
"status": 204,
"ok": True,
"message": "There is no such thing"
}
```


#### Database Error
```JSON
{
"status": 500,
"ok": False,
"message": "Database Error"
}
```

#### Success
```JSON
{
"status": 200,
"ok": True,
"message": [
	"List of posts"
	]
}
```

---

<br>

> ### POST -  http://127.0.0.1:5000/api/survey/answer/questionnaire/<int:id>

<br>

#### Not logged in
```JSON
{
"status": 401,
"ok": False,
"message": "You need to log in to access this"
}
```

#### Missing Posts, or there is no post
```JSON
{
"status": 400,
"ok": False,
"message": "There is no such post like that"
}
```

#### User already answered the survey
```JSON
{
"status": 409,
"ok": False,
"message": "You already answered this survey."
}
```


#### Database Error
```JSON
{
"status": 500,
"ok": False,
"message": "Database Error"
}
```

#### Success
```JSON
{
"status": 200,
"ok": True,
"message": "You have succesfully answered this survey"
}
```

---
