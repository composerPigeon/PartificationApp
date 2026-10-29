from flask_login import UserMixin
from uuid import uuid4

from db import db

class User(UserMixin, db.Model):
    """
    User domain for the application.
    UserMixin gives the authentication abilities and db.Model the database one.
    """
    __tablename__ = "users"

    id = db.Column(db.Uuid(as_uuid=False), primary_key=True, default=lambda: str(uuid4()))
    email = db.Column(db.String(120), unique=True, nullable=False)
    user_name = db.Column(db.String(80), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    created_at = db.Column(db.DateTime, nullable=False, default=db.func.now())

    def __init__(self, email: str, password_hash, user_name: str):
        super().__init__()
        self.email = email
        self.user_name = user_name
        self.password_hash = password_hash

    def get_id(self) -> str:
        return self.id
