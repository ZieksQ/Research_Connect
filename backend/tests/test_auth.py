import pytest
# from App.db import db_session as db

# @pytest.mark.skip()
@pytest.mark.parametrize("user_data, expected, status", [
    ({"username": "Alice", "password": "Secret123"}, True, 200),      # ✅ valid (meets all requirements)

    # Username tests
    ({"username": "Al", "password": "Secret123"}, False, 422),        # ❌ username too short
    ({"username": "A"*37, "password": "Secret123"}, False, 422),      # ❌ username too long

    # Password length
    ({"username": "Alice", "password": "Short1"}, False, 422),        # ❌ password too short
    ({"username": "Alice", "password": "A"*37}, False, 422),          # ❌ password too long

    # Password missing rules
    ({"username": "Alice", "password": "alllowercase1"}, False, 422), # ❌ missing uppercase
    ({"username": "Alice", "password": "ALLUPPERCASE1"}, False, 422), # ❌ missing lowercase
    ({"username": "Alice", "password": "NoDigitsHere"}, False, 422),  # ❌ missing digit

    ({"username": "", "password": "alllowercase1"}, False, 400),      # ❌ missing username
    ({"username": "Alice", "password": ""}, False, 400),              # ❌ missing passowrd
    ({}, False, 400),                                                 # ❌ missing json

    # Edge cases
    ({"username": "John", "password": "ValidPass1"}, True, 200),      # ✅ minimum valid username
    ({"username": "X"*36, "password": "GoodPass123"}, True, 200),     # ✅ maximum valid username
    ({"username": "Jane", "password": "Aa1aaaaa"}, True, 200),        # ✅ minimum valid password
])
def test_register_and_login(client, user_data, expected, status):
    responseSig = client.post("/user/register", json=user_data)
    dataSig = responseSig.get_json()

    assert dataSig.get("ok") == expected
    assert dataSig.get("status") == status

    responseLog = client.post("/user/login", json=user_data)
    dataLog = responseLog.get_json()

    if dataLog.get("ok") != True:
        return

    assert "Set-Cookie" in responseLog.headers
    assert dataLog.get("ok") == expected
    assert dataLog.get("status") == status

# @pytest.mark.skip()
@pytest.mark.parametrize("user_data, expected, status", [
    ({"username": "Jane", "password": "Jane12345678"}, True, 200),        # ✅ Credentials are true

    ({"username": "jane", "password": "Jane12345678"}, False, 404),       # ❌ username lowercase
    ({"username": "Jane", "password": "jane12345678"}, False, 401),       # ❌ password lowercase 

    ({"username": "Acob", "password": "Jane12345678"}, False, 404),       # ❌ wrong username 
    ({"username": "Jane", "password": "acoblarenjayigacio"}, False, 401), # ❌ wrong password

    ({"username": "", "password": "Jane12345678"}, False, 400),           # ❌ credentials missing
    ({"username": "Jane", "password": ""}, False, 400),                   # ❌ password missing

    ({"username": "", "password": "Jane12345678"}, False, 400),           # ❌ username missing
    ({}, False, 400),                                                     # ❌ Json missing
])
def test_login(client, user_data, expected, status):
    client.post("/user/register", json={"username": "Jane", "password": "Jane12345678"})
    responseLog = client.post("/user/login", json=user_data)

    dataLog = responseLog.get_json()
    
    assert dataLog.get("ok") == expected
    assert dataLog.get("status") == status

# @pytest.mark.skip()
def test_logout(client, refresh_token, session):
    token_str, token = refresh_token
    client.set_cookie("refresh_token_cookie", token_str, domain="localhost")

    response = client.post("/user/logout")

    assert response.json["status"] == 200
    assert response.json["ok"] == True
    assert "Successfully logged out" in response.json["message"]

    session.refresh(token)
    assert token.revoked == True

# @pytest.mark.skip()
def test_refresh(client, refresh_token):
    token_str, token = refresh_token
    client.set_cookie("refresh_token_cookie", token_str, domain="localhost")

    response = client.post("/user/refresh")
    data = response.get_json()

    assert data.get("status") == 200
    assert data.get("ok") == True
    assert data.get("message") == "Refresh Token successful"
    assert token.revoked == False
