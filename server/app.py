from flask import Flask
from uuid import UUID
from flask_login import LoginManager
from flask_wtf.csrf import CSRFProtect, CSRFError

from core import config
from routes.responses import ResponseFactory
from routes import auth_blueprint, main_blueprint
from db import db
from rate_limits import limiter

def create_login_manager(app: Flask) -> LoginManager:
    login = LoginManager()
    login.init_app(app)

    from domain import User
    @login.user_loader
    def load_user(user_id: str) -> User | None:
        try:
            UUID(user_id)
        except (ValueError, TypeError, AttributeError):
            return None
        return db.session.execute(
            db.select(User).where(User.id == user_id)
        ).scalar_one_or_none()

    @login.unauthorized_handler
    def unauthorized():
        return ResponseFactory.unauthorized("Unauthorized access.")

    return login


def set_configs(app: Flask) -> None:
    app.config["SQLALCHEMY_DATABASE_URI"] = config.sqlalchemy_database_uri
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
    app.config["SECRET_KEY"] = config.SECRET_KEY
    app.config["TESTING"] = config.TESTING
    app.config.update(
        SESSION_COOKIE_SECURE=config.SESSION_COOKIE_SECURE,
        SESSION_COOKIE_HTTPONLY=config.SESSION_COOKIE_HTTPONLY,
        SESSION_COOKIE_SAMESITE=config.SESSION_COOKIE_SAMESITE,
        SESSION_COOKIE_NAME=config.SESSION_COOKIE_NAME,
        SESSION_COOKIE_DOMAIN=None,
        SESSION_COOKIE_PATH="/",
        LOGIN_RATE_LIMIT=config.LOGIN_RATE_LIMIT,
        PROTECTED_RATE_LIMIT=config.PROTECTED_RATE_LIMIT,
        RATELIMIT_STORAGE_URI=config.RATELIMIT_STORAGE_URI,
        RATELIMIT_HEADERS_ENABLED=True,
    )


def create_app() -> Flask:
    app = Flask(__name__, static_folder=str(config.static_dir), static_url_path="")
    set_configs(app)
    limiter.init_app(app)
    CSRFProtect(app)
    app.register_blueprint(auth_blueprint)
    app.register_blueprint(main_blueprint)

    @app.errorhandler(429)
    def rate_limit_error(e):
        return ResponseFactory.error(429, "Too many requests. Please try again later.")

    @app.errorhandler(CSRFError)
    def csrf_error(e):
        response = ResponseFactory.bad_request(e.description)
        response.headers["X-CSRFError"] = "1"
        return response

    @app.errorhandler(500)
    def internal_server_error(e):
        db.session.rollback()
        return ResponseFactory.internal_server_error()

    db.init_app(app)

    create_login_manager(app)

    with app.app_context():
        db.create_all()

    return app


if __name__ == "__main__":
    create_app().run()
