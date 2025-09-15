import pytest

@pytest.mark.parametrize("user_data, expected, status", [
    ({"username": "Alice", "password": "Secret123"}, True, 200),   # ✅ valid (meets all requirements)

    # Username tests
    ({"username": "Al", "password": "Secret123"}, False, 422),     # ❌ username too short
    ({"username": "A"*37, "password": "Secret123"}, False, 422),   # ❌ username too long

    # Password length
    ({"username": "Alice", "password": "Short1"}, False, 422),     # ❌ password too short
    ({"username": "Alice", "password": "A"*37}, False, 422),       # ❌ password too long

    # Password missing rules
    ({"username": "Alice", "password": "alllowercase1"}, False, 422), # ❌ missing uppercase
    ({"username": "Alice", "password": "ALLUPPERCASE1"}, False, 422), # ❌ missing lowercase
    ({"username": "Alice", "password": "NoDigitsHere"}, False, 422),  # ❌ missing digit

    ({"username": "", "password": "alllowercase1"}, False, 400), # ❌ missing username
    ({"username": "Alice", "password": ""}, False, 400), # ❌ missing passowrd

    # Edge cases
    ({"username": "John", "password": "ValidPass1"}, True, 200),   # ✅ minimum valid username
    ({"username": "X"*36, "password": "GoodPass123"}, True, 200),  # ✅ maximum valid username
    ({"username": "Jane", "password": "Aa1aaaaa"}, True, 200),      # ✅ minimum valid password
])
def test_register_and_login(client, user_data, expected, status):
    responseSig = client.post("/user/register", json=user_data)
    dataSig = responseSig.get_json()

    assert dataSig.get("ok") == expected
    assert dataSig.get("status") == status

    responseLog = client.post("/user/login", json=user_data)
    dataLog = responseLog.get_json()
    if dataLog.get("ok") == True:
        assert dataLog.get("ok") == expected
        assert "Set-Cookie" in responseLog.headers

