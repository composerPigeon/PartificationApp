import os
import unittest
from http.cookies import SimpleCookie
from unittest.mock import PropertyMock, patch

with patch.dict(os.environ, {"SECRET_KEY": "test-only"}):
    from app import create_app
    from core.config import AppConfig


class SessionSecurityTests(unittest.TestCase):
    def create_app(self, secure, name):
        settings = AppConfig(
            _env_file=None, SECRET_KEY="test-only", TESTING=True,
            SESSION_COOKIE_SECURE=secure, SESSION_COOKIE_NAME=name,
            SESSION_COOKIE_HTTPONLY=True, SESSION_COOKIE_SAMESITE="Lax",
        )
        with patch("app.config", settings), patch.object(
            AppConfig, "sqlalchemy_database_uri", new_callable=PropertyMock,
            return_value="sqlite:///:memory:",
        ):
            return create_app()

    def test_production_and_development_cookie_attributes(self):
        for secure, name in ((True, "__Host-session"), (False, "session")):
            with self.subTest(secure=secure):
                client = self.create_app(secure, name).test_client()
                response = client.get("/auth/csrf", base_url="https://localhost" if secure
                                      else "http://localhost")
                cookie = SimpleCookie(response.headers["Set-Cookie"])[name]
                self.assertEqual(bool(cookie["secure"]), secure)
                self.assertTrue(cookie["httponly"])
                self.assertEqual(cookie["samesite"], "Lax")
                self.assertEqual(cookie["path"], "/")
                self.assertEqual(cookie["domain"], "")

    def test_profile_requires_authentication(self):
        response = self.create_app(False, "session").test_client().get("/profile")
        self.assertEqual(response.status_code, 401)
