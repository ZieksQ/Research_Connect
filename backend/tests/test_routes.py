import pytest

'''
use query_string=params if yuur route accepts query parameters
params is a dict
'''

@pytest.mark.skip()
def test_get_posts(client, access_cookie):
    client.set_cookie("access_token_cookie", access_cookie, domain="localhost")

    response = client.get("/survey/post/get")  # adjust route if needed
    data = response.get_json()

    assert response.status_code == 200
    assert data.get("status") == 200
    assert data.get("ok") == True
    

@pytest.mark.skip()
def test_get_posts_solo(client, access_cookie, test_post):
    client.set_cookie("access_token_cookie", access_cookie, domain="localhost")

    response = client.get(f"/survey/post/get/{test_post.id}")
    data = response.get_json()

    assert response.status_code == 200
    assert data.get("status") == 200
    assert data.get("ok") == True

@pytest.mark.skip()
@pytest.mark.parametrize("post_data, expexted, status", [
    # ✅ Correct data
    ({"title": "Testing my title", "content": "Fast, simple, and reliable, Fast, simple, and reliable" }, True, 200),

    # ❌ Missing data
    ({"title": "", "content": "" }, False, 400), 

    # ❌ Missing json
    ({}, False, 400), 

    # ❌ Title too short
    ({"title": "test", "content": "Fast, simple, and reliable, Fast, simple, and reliable"}, False, 422), 

    # ❌ Title too long
    ({"title": "Testing my titleTesting my titleTesting my titleTesting my titleTesting my titleTesting my titleTesting my titleTesting my titleTesting my title", "content": "Fast, simple, and reliable, Fast, simple, and reliable"}, False, 422),
    
    # ❌ Content too short
    ({"title": "Testing my title", "content": "Fast"}, False, 422), 

],)
def test_send_post(client, access_cookie, test_user, post_data, expexted, status):
    client.set_cookie("access_token_cookie", access_cookie, domain="localhost")

    response = client.post("/survey/post/send", json=post_data)
    data = response.get_json()

    assert data.get("ok") == expexted
    assert data.get("status") == status
    if data.get("status") == 200:
        assert data.get("message") == f"Post created by {test_user.id}"


# @pytest.mark.skip(reason="Route incomplete")
@pytest.mark.parametrize("survey_data, expected, status",[
    ({  "questionNo.2": {
    "question": "Which language is primarily used for Android app development?",
    "type": "multiple_choice",
    "choice": ["Kotlin", "Swift", "JavaScript"],
    "answer": "Kotlin"
  },
  "questionNo.3": {
    "question": "Explain the importance of data structures in computer science.",
    "type": "essay",
    "answer": "Data structures are essential for organizing, managing, and storing data efficiently. They allow faster access and modification of data, optimize memory usage, and provide the foundation for developing efficient algorithms."
  }}, True, 200),
])
def test_send_survey(client, access_cookie,survey_data, expected, status):
    client.set_cookie("access_token_cookie", access_cookie, domain="localhost")

    response = client.post("survey/post/questionnaire", json=survey_data)
    data = response.get_json()

    assert data.get("status") == status
    assert data.get("ok") == expected
    