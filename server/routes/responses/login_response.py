from domain import User
from .operation_result_response import OperationResultResponse


class LoginResponse(OperationResultResponse):
    def __init__(self, user: User):
        super().__init__(ok=True)
        self.user_id = user.id
        self.user_name = user.user_name
