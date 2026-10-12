from flask import Flask
from flask_login import LoginManager

from core import config
from routes.responses import ResponseFactory
from routes import auth_blueprint, main_blueprint
from db import db

def create_login_manager(app: Flask) -> LoginManager:
    login = LoginManager()
    login.init_app(app)

    from domain import User
    @login.user_loader
    def load_user(user_id: int) -> User | None:
        return db.session.execute(
            db.select(User).where(User.id == user_id)
        ).scalar_one_or_none()

    @login.unauthorized_handler
    def unauthorized():
        return ResponseFactory.unauthorized("Unauthorized access.")

    return login


def create_app() -> Flask:
    app = Flask(__name__, static_folder=str(config.static_dir), static_url_path="")
    app.config["SQLALCHEMY_DATABASE_URI"] = config.sqlalchemy_database_uri
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
    app.config["SECRET_KEY"] = config.SECRET_KEY
    app.config["TESTING"] = config.TESTING
    app.register_blueprint(auth_blueprint)
    app.register_blueprint(main_blueprint)

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
