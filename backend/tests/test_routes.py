import pytest

# @pytest.mark.skip()
def test_get_posts(client, access_cookie):
    client.set_cookie("access_token_cookie", access_cookie, domain="localhost")

    response = client.get("/survey/post/get")  # adjust route if needed
    assert response.status_code == 200
    

# @pytest.mark.skip()
@pytest.mark.parametrize("post_data, expexted, status", [
    # ✅ Correct data
    ({"title": "Testing my title", "content": "Fast, simple, and reliable, Fast, simple, and reliable" }, True, 200),
    ({"title": "", "content": "" }, False, 400), # ❌ Missing data
    ({}, False, 400), # ❌ Missing json
    ({"title": "test", "content": "Fast, simple, and reliable, Fast, simple, and reliable"}, False, 422), # ❌ Title too short
    ({"title": "Testing my titleTesting my titleTesting my titleTesting my titleTesting my titleTesting my titleTesting my titleTesting my titleTesting my title", "content": "Fast, simple, and reliable, Fast, simple, and reliable"}, False, 422), # ❌ Title too long
    ({"title": "Testing my title", "content": "Fast"}, False, 422), # ❌ Content too short

],)
def test_send_post(client, access_cookie, test_user, post_data, expexted, status):
    client.set_cookie("access_token_cookie", access_cookie, domain="localhost")

    response = client.post("/survey/post/send", json=post_data)
    data = response.get_json()

    assert data.get("ok") == expexted
    assert data.get("status") == status
    if data.get("status") == 200:
        assert data.get("message") == f"Post created by {test_user.id}"

