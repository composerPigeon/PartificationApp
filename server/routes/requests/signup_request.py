from typing import Any
from pydantic import Field, field_validator
from .login_request import LoginRequest


class SignupRequest(LoginRequest):
    first_name: str = Field(min_length=3, max_length=80, pattern=r"^[A-Za-z0-9_.-]+$")
    last_name: str = Field(min_length=3, max_length=80, pattern=r"^[A-Za-z0-9_.-]+$")

    @field_validator("first_name", mode="before")
    @classmethod
    def strip_first_name(cls, value: Any) -> Any:
        return value.strip() if isinstance(value, str) else value

    @field_validator("last_name", mode="before")
    @classmethod
    def strip_last_name(cls, value: Any) -> Any:
        return value.strip() if isinstance(value, str) else value
