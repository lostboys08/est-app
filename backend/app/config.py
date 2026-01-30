import json
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    DATABASE_URL: str
    BACKEND_CORS_ORIGINS: str = "[]"

    @property
    def cors_origins(self) -> list[str]:
        return json.loads(self.BACKEND_CORS_ORIGINS)

    class Config:
        env_file = ".env"


settings = Settings()
