"""
Конфигурация приложения WORK21
"""
from functools import lru_cache
from typing import Optional

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Настройки приложения"""
    
    # Основные настройки
    app_name: str = "WORK21"
    app_version: str = "0.1.0"
    debug: bool = True
    
    # База данных
    database_url: str = "sqlite+aiosqlite:///./work21.db"
    
    # JWT настройки
    secret_key: str = "your-secret-key-change-in-production"
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 30
    
    # CORS
    cors_origins: list[str] = ["http://localhost:3000"]
    
    # AI настройки (опционально)
    openai_api_key: Optional[str] = None
    
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
    )


@lru_cache()
def get_settings() -> Settings:
    """Получить настройки (кэшированные)"""
    return Settings()


settings = get_settings()


