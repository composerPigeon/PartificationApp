from flask_login import UserMixin

from db import db

class User(UserMixin, db.Model):
    """
    User model for the application.
    UserMixin gives the authentication abilities and db.Model the database one.
    """
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    first_name = db.Column(db.String(80), nullable=False)
    last_name = db.Column(db.String(80), nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    created_at = db.Column(db.DateTime, nullable=False, default=db.func.now())

    def __init__(self, email: str, first_name: str, last_name: str, password_hash):
        super().__init__()
        self.email = email
        self.first_name = first_name
        self.last_name = last_name
        self.password_hash = password_hash

    def get_id(self):
        return self.id