# List of API  Endpoints returned JSON

## /api/user
```bash
POST - http://127.0.0.1:5000/api/user/register
POST - http://127.0.0.1:5000/api/user/refresh/login
POST - http://127.0.0.1:5000/api/user/profile_upload
POST - http://127.0.0.1:5000/api/user/refresh/logout
GET - http://127.0.0.1:5000/api/user/login_success
GET - http://127.0.0.1:5000/api/user/user_data

Callback when token is expired
See "Expired Token Callback" in JSON
POST - http://127.0.0.1:5000/api/user/refresh
```

## /api/survey
```bash
GET - http://127.0.0.1:5000/api/survey/post/get

INTEGER is the ID of the post you want to fetch, useful for when the user clicked the post in a new tab
GET - http://127.0.0.1:5000/api/survey/post/get/INTEGER

DONT use this, deprecated
POST - http://127.0.0.1:5000/api/survey/post/send
DONT use this, deprecated
POST - http://127.0.0.1:5000/api/survey/post/questionnaire

POST - http://127.0.0.1:5000/api/survey/post/send/questionnaire
POST - http://127.0.0.1:5000/api/survey/post/get/questionnaire/<int:id>
POST - http://127.0.0.1:5000/api/survey/post/search?query=&order=
POST - http://127.0.0.1:5000/api/survey/answer/questionnaire
```

## /api/oauth
```bash
Dont call this, change the url of the frontend using windows.location.href or something. chatgpt it, for web redicrect_url=react and for flutter redicrect_url=flutter
http://127.0.0.1:5000/api/oauth/login?redirect_url=react

get ID
http://127.0.0.1:5000/api/oauth/protected

di ko alam bat may separate logout oauth, gagana nmansa siguro both logout, 
please dont ever use this, ts not secure, use the one from the /user is the same funciton
http://127.0.0.1:5000/api/oauth/logout
```

## /api/otp
```bash
POST - http://127.0.0.1:5000/api/otp/send_otp
```

## JSON
```JS
Usual
{
status: INTEGER,
ok: BOOLEAN,
message: STRING | DICITONARY
}

Expired Token Callback
{
status: 401,
ok: False,
message: STRING,
token_expired: True,
token_msg: "access/refresh token expired"
}

Unauthorized user Callback e.g. user accessing an endpoint wihtout logging it
{
status: 401,
ok: False,
message: "You need to log in to access this",
not_logged_in: True, 
logged_in_msg: "Please log in before accessing this"
}
```