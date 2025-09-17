import pytest
from App import run_app, session as db, Base, engine
from App.db_interaciton import commit_session
from App.model import Users, RefreshToken
from datetime import datetime, timezone
from flask_jwt_extended import create_access_token, create_refresh_token, decode_token

@pytest.fixture
def app():
    app = run_app(db_flag=True)
    app.config.update({
        "TESTING": True,
        "SQLALCHEMY_DATABASE_URI": "sqlite:///:memory:",
        "SQLALCHEMY_TRACK_MODIFICATIONS": False,
    })

    with app.app_context():
        Base.metadata.create_all(bind=engine)
        yield app
        Base.metadata.drop_all(bind=engine)

    
@pytest.fixture
def client(app):
    return app.test_client()

@pytest.fixture
def test_user(app):
    with app.app_context():
        user = Users(username="JaneDoe")
        user.set_password("JohnDoe123456")
        db.add(user)  # Use db.session.add instead of db.add
        
        success, error = commit_session()  # Use your custom commit function
        if not success:
            raise Exception(f"Failed to create test user: {error}")
        
        return user

@pytest.fixture
def access_cookie(app, test_user):
    with app.app_context():
        token = create_access_token(identity=str(test_user.id))
        return token
    
@pytest.fixture
def refresh_token(test_user, app):
    with app.app_context():
        token_str = create_refresh_token(identity=str(test_user.id))
        jti = decode_token(token_str).get("jti")
        expires = datetime.now(timezone.utc) + app.config["JWT_REFRESH_TOKEN_EXPIRES"]

        token = RefreshToken(jti=jti, user=test_user, expires_at=expires)
        db.add(token)
        db.commit()
        return token_str, token
