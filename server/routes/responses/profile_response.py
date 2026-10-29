from datetime import datetime
from domain import User
from . import OperationResultResponse
from .response_base import ResponseBase


class ProfileResponse(OperationResultResponse):
    def __init__(self, user: User):
        super().__init__(ok=True)
        self.email = user.email
        self.user_name = user.user_name
        self.user_id = user.id
        self.created_at = user.created_at

    email: str
    user_name: str
    user_id: str
    created_at: datetime
