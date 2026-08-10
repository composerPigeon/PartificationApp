from abc import ABC, abstractmethod
from typing import Self, Any

from flask import Request
from pydantic import BaseModel, ConfigDict


class RequestBase(BaseModel, ABC):
    """Base class for request models created from a Flask request."""
    model_config = ConfigDict(extra="forbid")

    @classmethod
    def from_flask(cls, request: Request) -> Self:
        if not request.is_json:
            raise ValueError("Content-Type of request must be 'application/json'")
        payload = request.get_json()
        if not isinstance(payload, dict):
            raise ValueError("The object is not valid json")
        return cls.model_validate(payload)