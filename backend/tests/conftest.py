import pytest
from App import run_app, db
from flask_jwt_extended import create_access_token

@pytest.fixture
def app():
    app = run_app(db_flag=True)
    app.config.update({
        "TESTING": True,
        "SQLALCHEMY_DATABASE_URI": "sqlite:///:memory:",
        "JWT_COOKIE_SECURE": False
    })

    with app.app_context():
        db.create_all()
        yield app
        db.session.remove()
        db.drop_all()
    
@pytest.fixture
def client(app):
    return app.test_client()

@pytest.fixture
def access_cookie(app):
    with app.app_context():
        token = create_access_token(identity="1")
        return token
    