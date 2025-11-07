# This is the list of JSON each function will return(Except GET)

<br>

> ### POST -  http://127.0.0.1:5000/api/user/register

<br>

#### Missing input fields
```JSON
{
"status": 400,
"ok": False,
"message": {
	"username": "Missing username",
	"password": "Missing password"
	}
}
```

#### Missing Requirements
```JSON
{
"status": 422,
"ok": False,
"message": {
	"username": "Username must at least be",
	"password": "Password must at leat be or contain"
	}
}
```

#### Existing Username
```JSON
{
"status": 409,
"ok": False,
"message": "Username already exists"
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
"message": "User registered successful"
}
```

---

> ### POST -  http://127.0.0.1:5000/api/user/login

<br>

#### Missing input fields
```JSON
{
"status": 400,
"ok": False,
"message": {
	"username": "Missing username",
	"password": "Missing password"
	}
}
```

#### Username not found
```JSON
{
"status": 404,
"ok": False,
"message": "Username does not exist"
}
```

#### Incorrect password
```JSON
{
"status": 401,
"ok": False,
"message": "Incorrect Password"
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
"message": "Login successful",
"login_type": "Inquira"
}
```

---
> ### POST -  http://127.0.0.1:5000/api/user/profile_upload

<br>

#### Missing file
```JSON
{
"status": 400,
"ok": False,
"message": File does no exists. or No file name. or invalid file extension
}
```

#### Upload to supabase error
```JSON
{
"status": 500,
"ok": False,
"message": supbase will provide this, i dont know the message
}
```

#### User does not exists
```JSON
{
"status": 400,
"ok": False,
"message": "You need to log in to access this"
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
"message": "Upload successful"
}
```
