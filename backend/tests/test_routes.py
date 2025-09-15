def test_protected_cookie(client, access_cookie):
    client.set_cookie("access_token_cookie", access_cookie, domain="localhost")

    response = client.get("/survey/post/get")  # adjust route if needed
    assert response.status_code == 200