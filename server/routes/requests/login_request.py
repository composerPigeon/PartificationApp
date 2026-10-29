from typing import Any
from pydantic import Field, field_validator
from .request_base import RequestBase

class LoginRequest(RequestBase):
    user_name: str = Field(min_length=3, max_length=80, pattern=r"^[a-z0-9_.-]+$")
    password: str = Field(min_length=1, max_length=1024)

    @field_validator("user_name", mode="before")
    @classmethod
    def normalize_user_name(cls, value: Any) -> Any:
        return value.strip().lower() if isinstance(value, str) else value
