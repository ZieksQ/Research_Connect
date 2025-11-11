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

<br>

> ### POST -  http://127.0.0.1:5000/api/otp/input_otp

<br>

#### User missing
```JSON
{
    "status": 401,
    "ok": False,
    "messaage": "Holy fuck, how dod you access this, please log in"
}
```

#### OTP text missing
```JSON
{
    "status": 400,
    "ok": False,
    "messaage": "Please input the OTP we provided"
}
```

#### OTP text does not match
```JSON
{
    "status": 400,
    "ok": False,
    "messaage": "Please iput the right OTP"
}
```

#### OTP is used
```JSON
{
    "status": 409,
    "ok": False,
    "messaage": "This OTP have been used"
}
```

#### Success
```JSON
{
    "status": 200,
    "ok": True,
    "messaage": "Please proceed to changing your password now"
}
```

<br>

> ### POST -  http://127.0.0.1:5000/api/otp/reset_pssw
> This only works for users who have logged in using Inquira/Local
<br>


#### User missing
```JSON
{
    "status": 401,
    "ok": False,
    "messaage": "Holy fuck, how did you access this, please log in"
}
```

#### User must be logged in using Inquira/local
```JSON
{
    "status": 401,
    "ok": False,
    "messaage": "Holy fuck, how did you access this, please log in"
}
```

#### OTP text does not match
```JSON
{
    "status": 400,
    "ok": False,
    "messaage": "Look man, please dont tamper with the session's OTP"
}
```

#### Missing new password
```JSON
{
    "status": 400,
    "ok": False,
    "messaage": "Please enter the new password you want"
}
```

#### Password did not met the requirements
```JSON
{
    "status": 422,
    "ok": False,
    "messaage": "Password must be at least/not execeed x characters long"
}
```

#### Password did not met the requirements
```JSON
{
    "status": 403,
    "ok": False,
    "messaage": "You cannot change password using this account type. Only users logged in using Inquira will be able to change password"
}
```

#### OTP expired
```JSON
{
    "status": 400,
    "ok": False,
    "messaage": "Your otp has expired, please use it within 30 mins"
}
```

#### Database Error
```JSON
{
    "status": 500,
    "ok": False,
        "messaage": "Database Error"
}
```

#### Success
```JSON
{
    "status": 200,
    "ok": True,
    "messaage": "Password reset successfully"
}
```
