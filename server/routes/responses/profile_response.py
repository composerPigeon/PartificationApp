from datetime import datetime
from model import User
from . import OperationResultResponse
from .response_base import ResponseBase


class ProfileResponse(OperationResultResponse):
    def __init__(self, user: User):
        super().__init__(ok=True)
        self.first_name = user.first_name
        self.last_name = user.last_name
        self.email = user.email
        self.created_at = user.created_at

    first_name: str
    last_name: str
    email: str
    created_at: datetime