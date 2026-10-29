from flask import current_app
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
from flask_login import current_user


limiter = Limiter(key_func=get_remote_address)


def protected_request_key() -> str:
    if current_user.is_authenticated:
        return f"user:{current_user.get_id()}"
    return f"ip:{get_remote_address()}"


protected_limit = limiter.limit(
    lambda: current_app.config["PROTECTED_RATE_LIMIT"],
    key_func=protected_request_key,
)
