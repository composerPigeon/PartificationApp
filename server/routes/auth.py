from flask import Response, request, Blueprint, current_app
from pydantic import ValidationError
from sqlalchemy.exc import IntegrityError

from flask_login import login_user, logout_user, login_required, current_user
from werkzeug.security import check_password_hash, generate_password_hash

from db.repositories import UserRepository
from model import User
from routes.requests import LoginRequest
from routes.requests.signup_request import SignupRequest
from routes.responses import ResponseBase, ResponseFactory

auth = Blueprint("auth", __name__, url_prefix="/auth")

@auth.post("/signup")
def signup() -> Response:
    users = UserRepository()

    try:
        signup_req = SignupRequest.from_flask(request)

        if users.exist(signup_req.email):
            return ResponseFactory.bad_request("Email already exists.")

        new_user = User(
            email=signup_req.email,
            first_name=signup_req.first_name,
            last_name=signup_req.last_name,
            password_hash=generate_password_hash(signup_req.password),
        )

        users.add_user(new_user)
        users.commit_session()
        return ResponseFactory.ok()
    except ValidationError | ValueError:
        current_app.logger.exception("Error parsing request.")
        return ResponseFactory.bad_request("Invalid json object.")
    except IntegrityError:
        users.rollback_session()
        current_app.logger.exception("Database error during signup.")
        return ResponseFactory.internal_server_error()
    except Exception:
        current_app.logger.exception("Unexpected error during signup.")
        return ResponseFactory.internal_server_error()


@auth.post("/login")
def login() -> Response:
    users  = UserRepository()
    try:
        login_req = LoginRequest.from_flask(request)
        user = users.get_by_email(login_req.email)

        if user is None or not check_password_hash(
            user.password_hash, login_req.password
        ):
            return ResponseFactory.bad_request("Invalid email or password.")

        login_user(user, remember=True)
        current_app.logger.info(f"User(id:{user.id}) logged in.")
        return ResponseFactory.ok()
    except ValidationError | ValueError:
        current_app.logger.exception("Error parsing request.")
        return ResponseFactory.bad_request("Invalid json object")
    except Exception:
        current_app.logger.exception("Unexpected error during login.")
        return ResponseFactory.internal_server_error()

@auth.get("/logout")
@login_required
def logout() -> Response:
    try:
        logout_user()
        current_app.logger.info(f"User(id:{current_user.get_id()}) logged out")
        return ResponseFactory.ok()
    except Exception:
        current_app.logger.exception("Unexpected error during logout")
        return ResponseFactory.internal_server_error()
