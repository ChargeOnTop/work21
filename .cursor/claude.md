# WORK21 Backend - Документация для AI

## Назначение

Backend сервис на FastAPI для платформы WORK21, соединяющей студентов Школы 21 с реальными заказчиками. Предоставляет REST API для управления пользователями, проектами, заявками, рейтингами и договорами. Интегрирован с AI-агентами для автоматизации оценки проектов и подбора исполнителей.

## Технологический стек

- **Python 3.11+** + **FastAPI 0.109**
- **SQLAlchemy 2.0** — асинхронный ORM для работы с БД
- **Pydantic v2** — валидация данных и схемы
- **Alembic** — миграции базы данных
- **PostgreSQL** (production) / **SQLite** (development)
- **JWT** (python-jose) — аутентификация
- **SQLAdmin** — админ-панель
- **Uvicorn** — ASGI сервер

## Архитектура

**Поток данных:**
1. Клиент → REST API (`/api/v1/{resource}`)
2. `{Resource}Router` → валидация через Pydantic схемы
3. `get_current_active_user` (dependency) → проверка JWT токена
4. `{Resource}Service` (если есть) → бизнес-логика
5. `get_db` (dependency) → получение сессии БД
6. SQLAlchemy → запросы к БД (async)
7. Pydantic схемы → сериализация ответа
8. FastAPI → возврат JSON клиенту

**AI-агенты:**
- **Task Analyst** — анализ задач и генерация ТЗ
- **Talent Matcher** — подбор студентов под проект
- **Legal Assistant** — генерация договоров

## Файловая структура проекта

### Корневая директория

```
work21/
├── app/                      # Основное приложение
│   ├── main.py              # Точка входа FastAPI
│   ├── admin.py             # Настройка админ-панели
│   │
│   ├── api/                 # REST API endpoints
│   │   ├── __init__.py      # Агрегация роутеров
│   │   ├── auth.py          # Аутентификация (регистрация, вход)
│   │   ├── users.py         # Управление пользователями
│   │   ├── projects.py      # CRUD проектов, задач, заявок
│   │   ├── ratings.py       # Рейтинговая система
│   │   └── deps.py          # Зависимости (auth, db)
│   │
│   ├── core/                # Ядро приложения
│   │   ├── config.py        # Настройки (Pydantic Settings)
│   │   ├── database.py      # Подключение к БД, сессии
│   │   └── security.py      # JWT, хеширование паролей
│   │
│   ├── models/              # SQLAlchemy ORM модели
│   │   ├── __init__.py      # Экспорт всех моделей
│   │   ├── user.py          # Модель пользователя
│   │   ├── project.py        # Модели: Project, Task, Application
│   │   ├── rating.py        # Модель рейтинга
│   │   └── contract.py      # Модель договора
│   │
│   ├── schemas/             # Pydantic схемы (валидация)
│   │   ├── __init__.py      # Экспорт схем
│   │   ├── user.py          # UserCreate, UserUpdate, UserResponse
│   │   └── project.py       # ProjectCreate, TaskResponse, etc.
│   │
│   └── agents/              # AI-агенты
│       ├── __init__.py
│       ├── task_analyst.py  # Анализ задач → ТЗ
│       ├── talent_matcher.py # Подбор исполнителей
│       └── legal_assistant.py # Генерация договоров
│
├── alembic/                 # Миграции БД
│   ├── versions/            # Файлы миграций
│   └── env.py               # Конфигурация Alembic
│
├── alembic.ini              # Конфигурация Alembic
├── requirements.txt         # Python зависимости
├── Dockerfile               # Docker образ
├── docker-compose.yml       # Docker Compose конфигурация
├── entrypoint.sh            # Скрипт запуска с миграциями
└── .env                     # Переменные окружения (не в git)
```

### Структура исходного кода (app/)

Проект следует архитектуре FastAPI с разделением на слои:

```
app/
├── main.py                  # FastAPI приложение, middleware, роутеры
├── admin.py                 # SQLAdmin админ-панель
│
├── api/                     # REST API слой (контроллеры)
│   ├── __init__.py          # Агрегация всех роутеров в api_router
│   ├── auth.py              # /api/v1/auth/* (register, login)
│   ├── users.py             # /api/v1/users/* (профили, leaderboard)
│   ├── projects.py          # /api/v1/projects/* (CRUD, заявки, задачи)
│   ├── ratings.py           # /api/v1/ratings/* (создание, получение)
│   └── deps.py              # Зависимости: get_db, get_current_user
│
├── core/                    # Ядро приложения
│   ├── config.py            # Settings (Pydantic BaseSettings)
│   ├── database.py          # AsyncSession, engine, Base, get_db
│   └── security.py          # JWT, bcrypt (verify_password, create_token)
│
├── models/                  # SQLAlchemy ORM модели
│   ├── __init__.py          # Экспорт всех моделей через __all__
│   ├── user.py             # User, UserRole (enum)
│   ├── project.py           # Project, Task, Application (enums: ProjectStatus, etc.)
│   ├── rating.py           # Rating
│   └── contract.py         # Contract
│
├── schemas/                 # Pydantic схемы (DTO)
│   ├── __init__.py          # Экспорт схем
│   ├── user.py             # UserBase, UserCreate, UserUpdate, UserResponse, Token
│   └── project.py          # ProjectBase, ProjectCreate, TaskResponse, etc.
│
└── agents/                  # AI-агенты (бизнес-логика)
    ├── task_analyst.py     # TaskAnalystAgent (analyze_project, estimate_complexity)
    ├── talent_matcher.py   # TalentMatcherAgent
    └── legal_assistant.py  # LegalAssistantAgent
```

### Назначение директорий и корпоративные стандарты

#### 1. **api/** — REST API слой

- **Назначение**: Обработка HTTP запросов, валидация входных данных через Pydantic, формирование ответов
- **Стандарты**:
  - Использовать `APIRouter()` для создания роутеров
  - Все эндпоинты должны иметь `response_model` в декораторе
  - Валидация через Pydantic схемы (автоматически)
  - Использовать `Depends()` для зависимостей (auth, db)
  - Все эндпоинты должны быть `async`
  - Версионирование API через `/api/v1/` в `main.py`
  - Использовать `status_code` в декораторах для явных кодов
  - Обработка ошибок через `HTTPException` с правильными статусами

**Пример:**
```python
router = APIRouter()

@router.post("/", response_model=ProjectResponse, status_code=status.HTTP_201_CREATED)
async def create_project(
    data: ProjectCreate,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
) -> ProjectResponse:
    """Создать проект."""
    # Логика
```

#### 2. **core/** — Ядро приложения

- **Назначение**: Конфигурация, подключение к БД, безопасность
- **Стандарты**:
  - `config.py`: Использовать `pydantic_settings.BaseSettings` для настроек
  - `database.py`: Асинхронные сессии через `AsyncSession`, `async_sessionmaker`
  - `security.py`: JWT через `python-jose`, bcrypt для паролей
  - Все функции должны быть типизированы
  - Использовать `@lru_cache()` для `get_settings()`

#### 3. **models/** — SQLAlchemy ORM модели

- **Назначение**: Определение структуры БД, relationships между таблицами
- **Стандарты**:
  - Использовать SQLAlchemy 2.0 синтаксис (`Mapped`, `mapped_column`)
  - Все модели наследуются от `Base` (из `core.database`)
  - Enum для статусов через `SQLEnum`
  - Relationships через `relationship()` с `back_populates`
  - Использовать `__repr__` для отладки
  - Типизация всех полей через `Mapped[Type]`
  - `__tablename__` в snake_case

**Пример:**
```python
class Project(Base):
    __tablename__ = "projects"
    
    id: Mapped[int] = mapped_column(primary_key=True)
    title: Mapped[str] = mapped_column(String(255))
    status: Mapped[ProjectStatus] = mapped_column(SQLEnum(ProjectStatus))
    
    customer_id: Mapped[int] = mapped_column(ForeignKey("users.id"))
    customer: Mapped["User"] = relationship("User", back_populates="projects")
```

#### 4. **schemas/** — Pydantic схемы (DTO)

- **Назначение**: Валидация входных данных, сериализация ответов
- **Стандарты**:
  - Использовать наследование: `Base` → `Create` → `Response`
  - Валидация через `Field()` с ограничениями
  - `Config.from_attributes = True` для Response схем (ORM → Pydantic)
  - Optional поля через `Optional[Type] = None`
  - Именование: `{Entity}Create`, `{Entity}Update`, `{Entity}Response`
  - Использовать `EmailStr` для email
  - Примеры через `json_schema_extra` в Config

**Пример:**
```python
class ProjectBase(BaseModel):
    title: str = Field(..., min_length=1, max_length=255)
    budget: float = Field(..., gt=0)

class ProjectCreate(ProjectBase):
    pass

class ProjectResponse(ProjectBase):
    id: int
    status: ProjectStatus
    created_at: datetime
    
    class Config:
        from_attributes = True
```

#### 5. **agents/** — AI-агенты

- **Назначение**: Бизнес-логика для AI-функций (анализ, подбор, генерация)
- **Стандарты**:
  - Классы агентов с методами `async`
  - Использовать `dataclass` для структур данных
  - Типизация всех методов
  - Краткие docstrings для публичных методов
  - Обработка ошибок с логированием

#### 6. **deps.py** — Зависимости FastAPI

- **Назначение**: Переиспользуемые зависимости (auth, db, проверки прав)
- **Стандарты**:
  - `get_db()` — получение сессии БД
  - `get_current_user()` — проверка JWT, получение пользователя
  - `get_current_active_user()` — проверка активности
  - Выносить повторяющиеся проверки в зависимости
  - Использовать `OAuth2PasswordBearer` для токенов

**Пример:**
```python
async def get_project_by_id(
    project_id: int,
    db: AsyncSession = Depends(get_db)
) -> Project:
    """Получить проект или 404."""
    result = await db.execute(select(Project).where(Project.id == project_id))
    project = result.scalar_one_or_none()
    if not project:
        raise HTTPException(404, "Проект не найден")
    return project
```

### Правила именования

#### Файлы и модули
- **API роутеры**: `{resource}.py` (например, `projects.py`, `users.py`)
- **Модели**: `{entity}.py` (например, `user.py`, `project.py`)
- **Схемы**: `{entity}.py` (например, `user.py`, `project.py`)
- **Агенты**: `{agent_name}.py` (например, `task_analyst.py`)
- Все файлы в **snake_case**

#### Классы
- **Модели**: `{Entity}` (например, `User`, `Project`, `Task`)
- **Схемы**: `{Entity}Create`, `{Entity}Update`, `{Entity}Response`
- **Агенты**: `{AgentName}Agent` (например, `TaskAnalystAgent`)
- **Enums**: `{Entity}Status`, `{Entity}Role` (например, `ProjectStatus`, `UserRole`)
- Все классы в **PascalCase**

#### Функции и переменные
- **Endpoints**: `verb_noun` (например, `create_project`, `get_user`)
- **Зависимости**: `get_*`, `require_*` (например, `get_db`, `get_current_user`)
- **Константы**: `UPPER_SNAKE_CASE` (например, `PROJECT_LOAD_OPTIONS`)
- Все функции и переменные в **snake_case**

#### API endpoints
- Версионирование: `/api/v1/{resource}`
- RESTful: `GET /{id}`, `POST /`, `PUT /{id}`, `DELETE /{id}`
- Вложенные ресурсы: `/{parent_id}/{child}` (например, `/projects/{id}/tasks`)

### Где размещать новые файлы

- **Новый REST эндпоинт** → `app/api/{resource}.py` (например, `app/api/contracts.py`)
- **Новая модель БД** → `app/models/{entity}.py` (например, `app/models/notification.py`)
- **Новые схемы** → `app/schemas/{entity}.py` (например, `app/schemas/contract.py`)
- **Новый AI-агент** → `app/agents/{agent_name}.py`
- **Новые зависимости** → добавить в `app/api/deps.py`
- **Новые настройки** → добавить в `app/core/config.py` (класс `Settings`)
- **Новые миграции** → `alembic revision --autogenerate -m "description"`

### Корпоративные стандарты кодирования

1. **Типизация**: Все функции должны иметь type hints, использовать `Optional[T]` вместо `T | None`
2. **Асинхронность**: Все I/O операции (БД, HTTP) должны быть `async/await`
3. **Валидация**: Все входные данные через Pydantic схемы
4. **Документация**: Краткие docstrings (1-2 строки) только для публичных API
5. **Обработка ошибок**: Использовать `HTTPException` с правильными статусами (404, 403, 400)
6. **Зависимости**: Выносить повторяющуюся логику в `Depends()` (проверки прав, загрузка данных)
7. **Версионирование API**: Все эндпоинты под `/api/v1/`
8. **Работа с БД**: Использовать `selectinload()` для eager loading связанных данных
9. **Импорты**: Группировать (стандартная библиотека → сторонние → локальные)
10. **Константы**: Выносить повторяющиеся паттерны (например, `selectinload` цепочки) в константы

### Структура импортов

```python
# 1. Стандартная библиотека
from datetime import datetime
from typing import Optional, List

# 2. Сторонние библиотеки
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from pydantic import BaseModel, Field

# 3. Локальные импорты
from app.core.database import get_db
from app.core.config import settings
from app.models.user import User
from app.schemas.user import UserResponse
from app.api.deps import get_current_active_user
```

### Работа с базой данных

**Стандарты:**
- Всегда использовать `AsyncSession` из `get_db()`
- Использовать `select()` для запросов (SQLAlchemy 2.0)
- `scalar_one_or_none()` для одного результата
- `scalars().all()` для списка
- Использовать `selectinload()` для загрузки связанных данных
- Выносить общие паттерны загрузки в константы

**Пример:**
```python
PROJECT_LOAD = (
    selectinload(Project.assignee),
    selectinload(Project.tasks).selectinload(Task.assignee)
)

result = await db.execute(
    select(Project)
    .options(*PROJECT_LOAD)
    .where(Project.id == project_id)
)
project = result.scalar_one_or_none()
```

### Аутентификация и авторизация

**Стандарты:**
- JWT токены через `python-jose`
- `OAuth2PasswordBearer` для получения токена из заголовка
- `get_current_user()` — проверка токена и получение пользователя
- `get_current_active_user()` — дополнительная проверка активности
- Проверка прав доступа в зависимостях или в начале endpoint

**Пример:**
```python
@router.put("/{project_id}")
async def update_project(
    project_id: int,
    data: ProjectUpdate,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    project = await get_project_by_id(project_id, db)
    if project.customer_id != current_user.id:
        raise HTTPException(403, "Нет прав")
    # ...
```

### Миграции Alembic

**Стандарты:**
- Использовать `alembic revision --autogenerate` для создания миграций
- Проверять сгенерированные миграции перед применением
- Применять через `alembic upgrade head`
- Откатывать через `alembic downgrade -1`

### Логирование и отладка

**Стандарты:**
- Использовать `print()` для отладки (временно)
- В production использовать `logging` модуль
- Логировать ошибки перед `raise HTTPException`
- Не логировать пароли и токены

---

*Последнее обновление: 2025-01-27*
