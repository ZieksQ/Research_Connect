

# POST - http://127.0.0.1:5000/api/otp/send_otp

## JSON you need to send here

---

> sending email is optional if the user already has an email, however if the user did not put an email in the profile and did not put an email input, an error will occur.

```json
{
  "email": "acoblaren@gmail.com"
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
  "message": "You need to log in to access this"
}
```

---

### Missing email
> User did not have an email in the profile and did not input an email

```json
{
  "status": 400,
  "ok": false,
  "message": "Please provide an email"
}
```

---

### SMTP Error

```json
{
  "status": 400,
  "ok": false,
  "message": "Failed to send email",
  "mail_error": "flask will provide this"
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
