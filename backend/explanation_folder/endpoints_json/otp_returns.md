# This is the list of JSON each function will return(Except GET)

<br>

> ### POST -  http://127.0.0.1:5000/api/otp/send_otp

<br>

#### User missing
```JSON
{
    "status": 401,
    "ok": False,
    "messaage": "You need to log in to access this"
}
```

#### Email missing / Non existant
```JSON
{
    "status": 400,
    "ok": False,
    "messaage": "Please provide an email"
}
```

#### Not valid email or somethin, havent tried this
```JSON
{
    "status": 400,
    "ok": False,
    "messaage": "Failed to send email",
    "mail_error": "Error provided by python library"
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