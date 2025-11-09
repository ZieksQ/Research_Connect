# This is the list of JSON each function will return(Except GET)

<br>

> ### POST -  http://127.0.0.1:5000/api/admin/approve_post

<br>

#### User missing
```JSON
{
    "status": 401,
    "ok": False,
    "messaage": "You need to log in to access this"
}
```

#### User is not Admin
```JSON
{
    "status": 401,
    "ok": False,
    "messaage": "Unauthorized access, please leave this alone"
}
```

#### User tampered with the JSON being sent
```JSON
{
    "status": 400,
    "ok": False,
    "messaage": "I know you are the admin bu please do not tamper with the JOSN body",
}
```

#### Database Error
```JSON
{
    "status": 500,
    "ok": True,
    "messaage": "Database error"
}
```

#### Success
```JSON
{
    "status": 200,
    "ok": True,
    "messaage": "Sent OTP, please check your email"
}
```
