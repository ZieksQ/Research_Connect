# POST - http://127.0.0.1:5000/api/otp/send_otp

## JSON you need to send here

---

> the otp is basically the six digit of the one sent in the email, this needs to be a string

```json
{
  "otp": "123456"
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

### Missing otp

```json
{
  "status": 400,
  "ok": false,
  "message": "Missing OTP, please input the OTP we provided"
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
  "message": "Please iput the correct OTP"
}
```

---

### OTP is used

```json
{
  "status": 409,
  "ok": false,
  "message": "This OTP have been used"
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
  "message": "Sent OTP, please check your email"
}
```

---
