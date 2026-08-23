from flask import Response

from . import OperationResultResponse, ProfileResponse
from model import User

class ResponseFactory:
    @staticmethod
    def ok() -> Response:
        resp = OperationResultResponse(ok=True)
        return resp.to_flask_response(200)

    @staticmethod
    def profile(user: User) -> Response:
        resp = ProfileResponse(user)
        return resp.to_flask_response(200)

    @staticmethod
    def bad_request(message: str) -> Response:
        resp = OperationResultResponse(ok=False, error_message=message)
        return resp.to_flask_response(400)

    @staticmethod
    def internal_server_error() -> Response:
        resp = OperationResultResponse(ok=False, error_message="Internal Server Error")
        return resp.to_flask_response(500)

    @staticmethod
    def error(status: int, message: str | None = None, exception: Exception | None = None) -> Response:
        resp = OperationResultResponse(ok=False, error_message=message, exception=exception)
        return resp.to_flask_response(status)