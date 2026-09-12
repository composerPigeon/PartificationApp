from idlelib import testing
from pathlib import Path

from flask import Flask, Response, send_from_directory
from flask_login import LoginManager, login_manager

from core import  config
from routes.auth import auth
from routes.settings import settings
from db import db

STATIC_DIR = Path(__file__).parent / "static"


def create_app() -> Flask:
    app = Flask(__name__, static_folder=str(STATIC_DIR), static_url_path="")
    app.config["SQLALCHEMY_DATABASE_URI"] = config.DATABASE_URL
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
    app.config["SECRET_KEY"] = config.SECRET_KEY
    app.register_blueprint(auth)
    app.register_blueprint(settings)
    db.init_app(app)

    login = LoginManager()
    login.init_app(app)

    from model import User

    @login.user_loader
    def load_user(user_id: int) -> User | None:
        return db.session.execute(
            db.select(User).where(User.id == user_id)
        ).scalar_one_or_none()

    with app.app_context():
        db.create_all()

    return app

app = create_app()

@app.get("/")
def serve_frontend():
    return send_from_directory(STATIC_DIR, "index.html")


if __name__ == "__main__":
    app.run(testing=config.TESTING)
