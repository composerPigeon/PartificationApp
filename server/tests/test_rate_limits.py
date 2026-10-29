import os
import unittest
from unittest.mock import PropertyMock, patch

with patch.dict(os.environ, {"SECRET_KEY": "test-only"}):
    from app import create_app
    from core.config import AppConfig
    from db import db
    from domain import User


class RateLimitTests(unittest.TestCase):
    def setUp(self):
        settings = AppConfig(
            _env_file=None, SECRET_KEY="test-only", TESTING=True,
            SESSION_COOKIE_SECURE=False, SESSION_COOKIE_NAME="session",
            LOGIN_RATE_LIMIT="2 per minute", PROTECTED_RATE_LIMIT="2 per minute",
            RATELIMIT_STORAGE_URI="memory://",
        )
        with patch("app.config", settings), patch.object(
            AppConfig, "sqlalchemy_database_uri", new_callable=PropertyMock,
            return_value="sqlite:///:memory:",
        ):
            self.app = create_app()
        self.client = self.app.test_client()

    def post(self, path, ip="127.0.0.1"):
        token = self.client.get("/auth/csrf").json["csrf_token"]
        return self.client.post(
            path, json={"email": "missing@example.com", "password": "wrong"},
            headers={"X-CSRFToken": token}, environ_overrides={"REMOTE_ADDR": ip},
        )

    def assert_limited(self, response):
        self.assertEqual(response.status_code, 429)
        self.assertFalse(response.json["ok"])
        self.assertIn("Retry-After", response.headers)

    def test_login_limit_is_per_ip(self):
        for _ in range(2):
            self.assertEqual(self.post("/auth/login").status_code, 400)
        self.assert_limited(self.post("/auth/login"))
        self.assertEqual(self.post("/auth/login", "127.0.0.2").status_code, 400)
        self.assertEqual(self.client.get("/auth/csrf").status_code, 200)

    def test_all_current_protected_endpoints_are_limited(self):
        for _ in range(2):
            self.assertEqual(self.client.get("/profile").status_code, 401)
            self.assertEqual(self.post("/auth/logout").status_code, 401)
        self.assert_limited(self.client.get("/profile"))
        self.assert_limited(self.post("/auth/logout"))

    def test_authenticated_users_have_separate_limits_on_same_ip(self):
        with self.app.app_context():
            for index in (1, 2):
                db.session.add(User(email=f"user{index}@example.com", first_name="Test",
                                    last_name="User", password_hash="unused"))
            db.session.commit()
        for user_id in (1, 2):
            client = self.app.test_client()
            with client.session_transaction() as session:
                session["_user_id"] = str(user_id)
            for _ in range(2):
                self.assertEqual(client.get("/profile").status_code, 200)
            self.assert_limited(client.get("/profile"))
