from flask import Blueprint, send_from_directory, current_app
from flask_login import login_required, current_user

from core import config
from db.repositories import UserRepository
from .responses import ResponseFactory

main_blueprint = Blueprint("main", __name__, url_prefix="/")

@main_blueprint.get("/")
def serve_frontend():
    return send_from_directory(config.static_dir, "index.html")

@login_required
@main_blueprint.get("/profile")
def get_profile():
    users = UserRepository()
    try:
        user = users.get_by_id(current_user.id)
        if user:
            return ResponseFactory.profile(user)

        return ResponseFactory.not_found("Profile not found.")
    except ValueError:
        current_app.logger.error(f"User with id {current_user.id} not found, but should be logged in.", exc_info=True)
        return ResponseFactory.internal_server_error()