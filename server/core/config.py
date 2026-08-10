from pydantic_settings import BaseSettings

class AppConfig(BaseSettings):
    """
    Class responsible for loading and managing application settings
    """
    DEBUG: bool = False
    DATABASE_URL: str
    SECRET_KEY: str

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        case_sensitive = True

config = AppConfig()
