import pytest
from App import run_app
from App.model import Users, RefreshToken, Posts
from App.database import SessionLocal, db_session, Base, engine
from flask_jwt_extended import create_access_token, create_refresh_token, decode_token
from datetime import datetime, timezone

@pytest.fixture(scope="session")
def app():
    app = run_app()  # Use in-memory SQLite for tests
    app.config.update(TESTING=True)
    yield app

@pytest.fixture(scope="function")
def setup_db():
    """Create all tables for the test session and drop after all tests."""
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
    yield
    Base.metadata.drop_all(bind=engine)

@pytest.fixture(scope="function")
def client(app, setup_db):
    return app.test_client()

@pytest.fixture(scope="function")
def session(setup_db):
    """Provide a fresh database session per test and roll back automatically."""
    connection = engine.connect()
    transaction = connection.begin()
    session = SessionLocal(bind=connection)

    db_session.configure(bind=connection)

    yield session   

    session.close()
    transaction.rollback()
    connection.close()

@pytest.fixture(scope="function")
def test_user(session):
    user = Users(username="Jane")
    user.set_password("Jane12345678")
    user.role = "user"
    session.add(user)
    session.flush()  
    return user

@pytest.fixture(scope="function")
def test_post(session, test_user):
    post = Posts(title="Testing my title", 
                 content="Fast, simple, and reliable, Fast, simple, and reliable",
                 user=test_user)
    session.add(post)
    session.flush()

    yield post

@pytest.fixture(scope="function")
def access_cookie(test_user):
    token = create_access_token(identity=str(test_user.id))
    yield token

@pytest.fixture(scope="function")
def refresh_token(test_user, app, session):
    token_str = create_refresh_token(identity=str(test_user.id))
    jti = decode_token(token_str).get("jti")
    expires = datetime.now(timezone.utc) + app.config["JWT_REFRESH_TOKEN_EXPIRES"]

    token = RefreshToken(jti=jti, user_token=test_user, expires_at=expires)
    session.add(token)
    session.flush()

    yield token_str, token

    
# @pytest.fixture
# def app():
#     app = run_app(db_flag=True)
#     app.config.update({
#         "TESTING": True,
#         "SQLALCHEMY_DATABASE_URI": "sqlite:///:memory:",
#         "SQLALCHEMY_TRACK_MODIFICATIONS": False,
#     })

#     with app.app_context():
#         Base.metadata.create_all(bind=engine)
#         yield app
#         Base.metadata.drop_all(bind=engine)

    
# @pytest.fixture
# def client(app):
#     return app.test_client()