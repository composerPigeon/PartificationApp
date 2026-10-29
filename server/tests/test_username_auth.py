import os
import unittest
from unittest.mock import PropertyMock, patch
from uuid import UUID

with patch.dict(os.environ, {"SECRET_KEY": "test-only"}):
    from app import create_app
    from core.config import AppConfig
    from db import db
    from domain import User


class UsernameAuthTests(unittest.TestCase):
    def setUp(self):
        settings = AppConfig(
            _env_file=None, SECRET_KEY="test-only", TESTING=True,
            SESSION_COOKIE_SECURE=False, SESSION_COOKIE_NAME="session",
            LOGIN_RATE_LIMIT="100 per minute", RATELIMIT_STORAGE_URI="memory://",
        )
        with patch("app.config", settings), patch.object(
            AppConfig, "sqlalchemy_database_uri", new_callable=PropertyMock,
            return_value="sqlite:///:memory:",
        ):
            self.app = create_app()
        self.client = self.app.test_client()
        self.signup = {
            "user_name": "Composer.Pigeon", "email": "test@example.com",
            "password": "Test-password-123!",
        }

    def post(self, path, body):
        token = self.client.get("/auth/csrf").json["csrf_token"]
        return self.client.post(path, json=body, headers={"X-CSRFToken": token})

    def test_signup_and_login_use_normalized_username(self):
        self.assertEqual(self.post("/auth/signup", self.signup).status_code, 200)
        with self.app.app_context():
            user = db.session.execute(db.select(User)).scalar_one()
            self.assertEqual(user.user_name, "composer.pigeon")
            self.assertEqual(user.email, "test@example.com")
        response = self.post("/auth/login", {
            "user_name": " COMPOSER.PIGEON ", "password": self.signup["password"],
        })
        self.assertEqual(response.status_code, 200)
        user_id = response.json["user_id"]
        self.assertEqual(UUID(user_id).version, 4)
        self.assertEqual(response.json["user_name"], "composer.pigeon")
        with self.client.session_transaction() as session:
            self.assertEqual(session["_user_id"], user_id)
        self.assertEqual(self.client.get("/profile").json["user_id"], user_id)
        self.assertEqual(self.client.get("/profile").json["user_name"], "composer.pigeon")

    def test_user_ids_are_distinct_and_stable_across_logins_and_rename(self):
        self.assertEqual(self.post("/auth/signup", self.signup).status_code, 200)
        self.assertEqual(self.post("/auth/signup", {
            **self.signup, "user_name": "another.user", "email": "other@example.com",
        }).status_code, 200)
        with self.app.app_context():
            users = db.session.execute(db.select(User)).scalars().all()
            self.assertEqual(len({user.id for user in users}), 2)
            self.assertTrue(all(UUID(user.id).version == 4 for user in users))
        credentials = {"user_name": "composer.pigeon", "password": self.signup["password"]}
        user_id = self.post("/auth/login", credentials).json["user_id"]
        self.assertEqual(self.post("/auth/login", credentials).json["user_id"], user_id)
        with self.app.app_context():
            user = db.session.get(User, user_id)
            user.user_name = "renamed.user"
            db.session.commit()
        self.assertEqual(self.post("/auth/login", {
            **credentials, "user_name": "renamed.user",
        }).json["user_id"], user_id)

    def test_old_integer_session_is_unauthenticated(self):
        with self.client.session_transaction() as session:
            session["_user_id"] = "1"
        self.assertEqual(self.client.get("/profile").status_code, 401)

    def test_duplicate_username_and_email_are_rejected(self):
        self.assertEqual(self.post("/auth/signup", self.signup).status_code, 200)
        for changes, message in (
            ({"email": "other@example.com"}, "Username already exists."),
            ({"user_name": "another.user"}, "Email already exists."),
        ):
            response = self.post("/auth/signup", {**self.signup, **changes})
            self.assertEqual(response.status_code, 400)
            self.assertEqual(response.json["error"], message)

    def test_email_cannot_be_used_for_login(self):
        self.assertEqual(self.post("/auth/signup", self.signup).status_code, 200)
        for identity in ({"email": self.signup["email"]}, {"user_name": self.signup["email"]}):
            response = self.post("/auth/login", {**identity, "password": self.signup["password"]})
            self.assertEqual(response.status_code, 400)
        response = self.post("/auth/login", {"user_name": "composer.pigeon", "password": "wrong"})
        self.assertEqual(response.status_code, 400)

    def test_invalid_or_missing_username_is_rejected(self):
        for name in ("", "ab", "../user", "a" * 81):
            response = self.post("/auth/signup", {**self.signup, "user_name": name})
            self.assertEqual(response.status_code, 400)
        body = {key: value for key, value in self.signup.items() if key != "user_name"}
        self.assertEqual(self.post("/auth/signup", body).status_code, 400)
