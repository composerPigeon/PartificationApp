from flask import Response, jsonify

class ResponseBase:
    def to_flask_response(self, status: int) -> Response:
        response = jsonify(vars(self))
        response.status_code = status
        return response

class OkResponse(ResponseBase):
    pass

class ErrorResponse(ResponseBase):
    message: str
    def __init__(self, message: str | None = None, exception: Exception | None = None):
        if isinstance(message, str) and message.strip():
            self.message = message
        elif exception is not None:
            self.message = str(exception)
        else:
            self.message = "unknown error"