import os
import unittest
from unittest.mock import PropertyMock, patch

with patch.dict(os.environ, {"SECRET_KEY": "test-only"}):
    from app import create_app
    from core.config import AppConfig


class CsrfTests(unittest.TestCase):
    def setUp(self):
        with patch.object(AppConfig, "sqlalchemy_database_uri", new_callable=PropertyMock,
                          return_value="sqlite:///:memory:"):
            self.app = create_app()
        self.app.config["TESTING"] = True
        self.client = self.app.test_client()

    def token(self, client=None):
        response = (client or self.client).get("/auth/csrf")
        self.assertEqual(response.headers["Cache-Control"], "no-store")
        return response.json["csrf_token"]

    def test_missing_and_invalid_tokens_are_rejected(self):
        for path in ("/auth/login", "/auth/signup", "/auth/logout"):
            for headers in ({}, {"X-CSRFToken": "invalid"}):
                response = self.client.post(path, json={}, headers=headers)
                self.assertEqual(response.status_code, 400)
                self.assertEqual(response.headers["X-CSRFError"], "1")
                self.assertFalse(response.json["ok"])
                self.assertIn("CSRF", response.json["error"])

    def test_token_is_bound_to_session(self):
        token = self.token()
        response = self.app.test_client().post(
            "/auth/logout", headers={"X-CSRFToken": token})
        self.assertEqual(response.status_code, 400)

    def test_valid_token_reaches_authentication(self):
        response = self.client.post(
            "/auth/logout", headers={"X-CSRFToken": self.token()})
        self.assertEqual(response.status_code, 401)

    def test_logout_get_is_not_allowed(self):
        rule = next(rule for rule in self.app.url_map.iter_rules()
                    if rule.endpoint == "auth.logout")
        self.assertNotIn("GET", rule.methods)

    def test_signup_login_and_logout_with_valid_tokens(self):
        credentials = {"user_name": "csrf.user", "password": "Test-password-123!"}
        for path, body in (
            ("/auth/signup", {**credentials, "email": "csrf@example.com"}),
            ("/auth/login", credentials),
            ("/auth/logout", {}),
        ):
            response = self.client.post(path, json=body,
                                        headers={"X-CSRFToken": self.token()})
            self.assertEqual(response.status_code, 200, response.json)
        with self.client.session_transaction() as session:
            self.assertNotIn("_user_id", session)
