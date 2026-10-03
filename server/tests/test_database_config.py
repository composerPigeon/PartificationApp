import os
import unittest
from unittest.mock import patch

with patch.dict(os.environ, {"SECRET_KEY": "test-only"}):
    from core.config import AppConfig


class DatabaseConfigTests(unittest.TestCase):
    def test_postgres_settings_preserve_special_characters_in_password(self):
        with patch.dict(os.environ, {}, clear=True):
            config = AppConfig(
                _env_file=None,
                SECRET_KEY="test-only",
                POSTGRES_HOST="postgres",
                POSTGRES_PORT=5432,
                POSTGRES_DB="scores",
                POSTGRES_USER="score_user",
                POSTGRES_PASSWORD="p@ss:/?#word",
            )

        url = config.sqlalchemy_database_uri
        self.assertEqual(url.drivername, "postgresql+psycopg")
        self.assertEqual(url.host, "postgres")
        self.assertEqual(url.port, 5432)
        self.assertEqual(url.database, "scores")
        self.assertEqual(url.username, "score_user")
        self.assertEqual(url.password, "p@ss:/?#word")

    def test_explicit_database_url_takes_precedence(self):
        with patch.dict(os.environ, {}, clear=True):
            config = AppConfig(
                _env_file=None,
                SECRET_KEY="test-only",
                DATABASE_URL="sqlite:///:memory:",
                POSTGRES_HOST="postgres",
            )

        self.assertEqual(config.sqlalchemy_database_uri, "sqlite:///:memory:")


if __name__ == "__main__":
    unittest.main()
