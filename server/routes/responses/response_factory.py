from flask import Response

from . import ErrorResponse, ProfileResponse, OkResponse
from model import User

class ResponseFactory:
    @staticmethod
    def ok() -> Response:
        resp = OkResponse()
        return resp.to_flask_response(200)

    @staticmethod
    def profile(user: User) -> Response:
        resp = ProfileResponse(user)
        return resp.to_flask_response(200)

    @staticmethod
    def bad_request(message: str) -> Response:
        resp = ErrorResponse(message=message)
        return resp.to_flask_response(400)

    @staticmethod
    def internal_server_error() -> Response:
        resp = ErrorResponse(message="Internal Server Error")
        return resp.to_flask_response(500)

    @staticmethod
    def error(status: int, message: str | None = None, exception: Exception | None = None) -> Response:
        resp = ErrorResponse(message, exception)
        return resp.to_flask_response(status)