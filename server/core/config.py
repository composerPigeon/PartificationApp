from pathlib import Path

from pydantic_settings import BaseSettings
from sqlalchemy.engine import URL

class AppConfig(BaseSettings):
    """
    Class responsible for loading and managing application settings
    """
    TESTING: bool = False
    POSTGRES_HOST: str = "localhost"
    POSTGRES_PORT: int = 5432
    POSTGRES_DB: str = "partification"
    POSTGRES_USER: str = "partification"
    POSTGRES_PASSWORD: str = ""
    SECRET_KEY: str

    @property
    def sqlalchemy_database_uri(self) -> URL:
        return URL.create(
            "postgresql+psycopg",
            username=self.POSTGRES_USER,
            password=self.POSTGRES_PASSWORD,
            host=self.POSTGRES_HOST,
            port=self.POSTGRES_PORT,
            database=self.POSTGRES_DB,
        )

    @property
    def static_dir(self) -> Path:
        return Path(__file__).resolve().parent.parent / "static"

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        case_sensitive = True


config = AppConfig()
