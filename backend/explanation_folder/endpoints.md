# List of API  Endpoints returned JSON

## /user
```bash
POST - http://127.0.0.1:5000/user/register
POST - http://127.0.0.1:5000/user/login
POST - http://127.0.0.1:5000/user/profile_upload
POST - http://127.0.0.1:5000/user/logout

Callback when token is expired
See "Expired Token Callback" in JSON
POST - http://127.0.0.1:5000/user/refresh
```

## /survey
```bash
GET - http://127.0.0.1:5000/survey/post/get

INTEGER is the ID of the post you want to fetch, useful for when the user clicked the post in a new tab
GET - http://127.0.0.1:5000/survey/post/get/INTEGER

POST - http://127.0.0.1:5000/survey/post/send
POST - http://127.0.0.1:5000/survey/post/questionnaire

Dont use yet, im still fixing that
POST - http://127.0.0.1:5000/survey/post/send/questionnaire

Dont use this also, im still fixing that
POST - http://127.0.0.1:5000/survey/post/get/questionnaire/<int:id>

Dont use this also, im still fixing that
POST - http://127.0.0.1:5000/survey/post/search?query=&order=

Dont use this also, im still fixing that
POST - http://127.0.0.1:5000/survey/answer/questionnaire
```

## /oauth
```bash
Dont call this, change the url of the frontend using windows.location.href or something. chatgpt it
http://127.0.0.1:5000/oauth/authorized/google

get ID
http://127.0.0.1:5000/oauth/protected

di ko alam bat may separate logout oauth, gagana nmansa siguro both logout
http://127.0.0.1:5000/oauth/logout
```

## JSON
```JSON
Usual
{
status: INTEGER,
ok: BOOLEAN,
message: STRING | DICITONARY
}

Expired Token Callback
{
status: INTEGER,
ok: BOOLEAN,
message: STRING,
token: BOOLEAN,
tokne_msg: STRING
}

Unauthorized user Callback e.g. user accessing an endpoint wihtout logging it
{
status: INTEGER,
ok: BOOLEAN,
message: STRING,
token: BOOLEAN,
tokne_msg: STRING
}
```