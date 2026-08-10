from flask import Response, Blueprint, current_app
from flask_login import login_required, current_user

from db.repositories import UserRepository
from routes.responses import ProfileResponse, ResponseFactory

settings = Blueprint("settings", __name__, url_prefix="/settings")

@settings.get("/profile")
@login_required
def user_profile() -> Response:
    users = UserRepository()
    try:
        user = users.get_by_id(current_user.id)
        return ResponseFactory.profile(user)
    except ValueError:
        current_app.logger.error(f"User with id {current_user.id} not found, but should be logged in.")
        return ResponseFactory.internal_server_error()
    except Exception as e:
        current_app.logger.exception("Unexpected error getting user profile info.")
        return ResponseFactory.internal_server_error()