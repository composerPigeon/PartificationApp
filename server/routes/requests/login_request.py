from typing import Any
from pydantic import Field, field_validator
from .request_base import RequestBase

class LoginRequest(RequestBase):
    email: str = Field(min_length=3, max_length=120)
    password: str = Field(min_length=1, max_length=1024)

    @field_validator("email", mode="before")
    @classmethod
    def normalize_email(cls, value: Any) -> Any:
        if not isinstance(value, str):
            return value
        value = value.strip()
        local_part, separator, domain = value.rpartition("@")
        if not separator or not local_part or "." not in domain:
            raise ValueError("must be a valid email address")
        return value.lower()