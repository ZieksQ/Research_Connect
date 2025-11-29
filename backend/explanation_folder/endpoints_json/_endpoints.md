# List of API Endpoints returned JSON

## /api/user

```bash
POST - http://127.0.0.1:5000/api/user/register
POST - http://127.0.0.1:5000/api/user/login
PATCH - http://127.0.0.1:5000/api/user/profile_upload
POST - http://127.0.0.1:5000/api/user/refresh/logout
GET - http://127.0.0.1:5000/api/user/login_success
GET - http://127.0.0.1:5000/api/user/user_data
PATCH - http://127.0.0.1:5000/api/user/update_data

Callback when token is expired
See "Expired Token Callback" in JSON
POST - http://127.0.0.1:5000/api/user/refresh
```

## /api/survey

```bash
INTEGER is the ID of the post you want to fetch, useful for when the user clicked the post in a new tab
GET - http://127.0.0.1:5000/api/survey/post/get/INTEGER

GET - http://127.0.0.1:5000/api/survey/post/get
GET - http://127.0.0.1:5000/api/survey/post/search?query=&order=
GET - http://127.0.0.1:5000/api/survey/post/search/tags_audience?query=&order=
GET - http://127.0.0.1:5000/api/survey/post/search/by_title?query=&order=
GET - http://127.0.0.1:5000/api/survey/category/get
GET - http://127.0.0.1:5000/api/survey/post/get/questionnaire/<int:id>

Get all the responses from the survey
GET - http://127.0.0.1:5000/api/survey/post/respones/computed_data/<int:id>

Counts how mant section and how many quesiton does each seciton has
GET - http://127.0.0.1:5000/api/survey/post/count_questions/<int:id>


POST - http://127.0.0.1:5000/api/survey/post/send/questionnaire/mobile
POST - http://127.0.0.1:5000/api/survey/post/send/questionnaire/web

POST - http://127.0.0.1:5000/api/survey/answer/questionnaire/<int:id>

POST - http://127.0.0.1:5000/api/survey/questionnaire/is_answered

PATCH - http://127.0.0.1:5000/api/survey/post/archive
PATCH - http://127.0.0.1:5000/api/survey/post/unarchive
PATCH - http://127.0.0.1:5000/api/survey/post/update_data
```

## /api/oauth

```bash
Dont call this, change the url of the frontend using windows.location.href or something. chatgpt it, for web redicrect_url=react and for flutter redicrect_url=flutter
http://localhost:5000/api/oauth/login?redirect_url=react
```

## /api/otp

```bash
POST - http://127.0.0.1:5000/api/otp/send_otp
POST - http://127.0.0.1:5000/api/otp/input_otp

THIS only works for Users that have logged in using Inquira/Local
PATCH - http://127.0.0.1:5000/api/otp/reset_pssw

THIS only works for Users that have logged in using Inquira/Local
PATCH - http://127.0.0.1:5000/api/otp/enter_email
```

## /api/admin

```bash
PATCH - http://127.0.0.1:5000/api/admin/approve_post
GET - http://127.0.0.1:5000/api/admin/generate/post_code
GET - http://127.0.0.1:5000/api/admin/post/get/not_approved
POST - http://127.0.0.1:5000/api/admin/generate/post/category
GET - http://127.0.0.1:5000/api/admin/generate/admin_acc/mass
POST - http://127.0.0.1:5000/api/admin/generate/admin_acc/solo

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

Too many request, error 429
msg = 5 per minute, 5 per hour, 5 per day - This change dependeing on route or usage
{
status: 429,
ok: False,
message: "Too many request, you can only try{msg}",
}
```
