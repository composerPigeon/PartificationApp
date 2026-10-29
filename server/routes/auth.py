from flask import Response, request, Blueprint, current_app
from flask_wtf.csrf import generate_csrf
from pydantic import ValidationError
from sqlalchemy.exc import IntegrityError

from flask_login import login_user, logout_user, login_required, current_user
from werkzeug.security import check_password_hash, generate_password_hash

from db.repositories import UserRepository
from domain import User
from routes.requests import LoginRequest
from routes.requests.signup_request import SignupRequest
from routes.responses import ResponseFactory
from rate_limits import limiter, protected_limit

auth_blueprint = Blueprint("auth", __name__, url_prefix="/auth")

@auth_blueprint.get("/csrf")
def csrf_token():
    response = current_app.json.response({"csrf_token": generate_csrf()})
    response.headers["Cache-Control"] = "no-store"
    return response

@auth_blueprint.post("/signup")
def signup() -> Response:
    users = UserRepository()

    try:
        signup_req = SignupRequest.from_flask(request)

        if users.exist(signup_req.email):
            return ResponseFactory.bad_request("Email already exists.")

        if users.get_by_user_name(signup_req.user_name) is not None:
            return ResponseFactory.bad_request("Username already exists.")

        new_user = User(
            email=signup_req.email,
            user_name=signup_req.user_name,
            password_hash=generate_password_hash(signup_req.password),
        )

        users.add_user(new_user)
        users.commit_session()
        return ResponseFactory.ok()
    except (ValidationError, ValueError):
        current_app.logger.exception("Error parsing request.")
        return ResponseFactory.bad_request("Invalid json object.")
    except IntegrityError:
        users.rollback_session()
        current_app.logger.exception("Database error during signup.")
        return ResponseFactory.internal_server_error()


@auth_blueprint.post("/login")
@limiter.limit(lambda: current_app.config["LOGIN_RATE_LIMIT"])
def login() -> Response:
    users  = UserRepository()
    try:
        login_req = LoginRequest.from_flask(request)
        user = users.get_by_user_name(login_req.user_name)

        if user is None or not check_password_hash(
            user.password_hash, login_req.password
        ):
            return ResponseFactory.bad_request("Invalid username or password.")

        #TODO: after implementing more secure authorisation can be changed remember=True
        login_user(user, remember=False)
        current_app.logger.info(f"User(id:{user.id}) logged in.")
        return ResponseFactory.login(user)
    except (ValidationError, ValueError):
        current_app.logger.exception("Error parsing request.")
        return ResponseFactory.bad_request("Invalid json object")

@auth_blueprint.post("/logout")
@protected_limit
@login_required
def logout() -> Response:
    logout_user()
    current_app.logger.info(f"User(id:{current_user.get_id()}) logged out")
    return ResponseFactory.ok()
