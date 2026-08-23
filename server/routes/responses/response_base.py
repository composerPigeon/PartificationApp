from flask import Response, jsonify

class ResponseBase:
    def to_flask_response(self, status: int) -> Response:
        response = jsonify(vars(self))
        response.status_code = status
        return response