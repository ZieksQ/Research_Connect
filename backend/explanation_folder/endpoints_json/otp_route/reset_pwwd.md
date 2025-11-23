# PATCH - http://127.0.0.1:5000/api/otp/reset_pssw

## JSON you need to send here

---

> The user can only changed password if they logged in using the Inquira method, they will receive an error if they are logged in using Oauth and tried to change password

```json
{
  "new_password": "@Acob12345"
}
```

---

<br>

## Returned JSON you will receive from this route

---

### Missing user

```json
{
  "status": 401,
  "ok": false,
  "message": "Holy fuck, how did you access this, please log in"
}
```

---

### User is not logged in in Inquira

```json
{
  "status": 403,
  "ok": false,
  "message": "You cannot change password using this account type. Only users logged in using Inquira will be able to change password"
}
```

---

### OTP is not in the database

> User tried to access this without having an OTP in the database

```json
{
  "status": 404,
  "ok": false,
  "message": "You havent requested an OTP yet"
}
```

---

### Inputed OTP did not match the one User requested or in the database

> User tried to access this without having an OTP in the database

```json
{
  "status": 400,
  "ok": false,
  "message": "Look man, please dont tamper with the session's OTP"
}
```

---

### Missing new_password

```json
{
  "status": 400,
  "ok": false,
  "message": "Please enter the new password you want"
}
```

---

### New Password did not meet the requirements

```json
{
  "status": 422,
  "ok": false,
  "message": "Password must be at least or include this"
}
```

---

### OTP expired

```json
{
  "status": 400,
  "ok": false,
  "message": "Your otp has expired, please use it within 30 mins"
}
```

---

### Database error

```json
{
  "status": 500,
  "ok": false,
  "message": "Database error"
}
```

---

### Success

```json
{
  "status": 200,
  "ok": true,
  "message": "Password reset successfully"
}
```

---
