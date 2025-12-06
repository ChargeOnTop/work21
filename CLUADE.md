# WORK21 — Платформа для Школы 21

> **ΔΩΔΕΠ** (древнегр. "стремиться, не сдаваться") — главная идея платформы

WORK21 — это платформа, соединяющая студентов Школы 21 с реальными заказчиками. Студенты получают коммерческий опыт и портфолио, а компании — качественную разработку по доступной цене.

---

## 🎯 Ключевые возможности

### Для студентов
- Реальные коммерческие проекты (не симуляции)
- Рейтинговая система с денежными бонусами
- Карьерный рост через Job Connect

### Для заказчиков
- Быстрый старт: от идеи до разработки за дни
- AI-оценка стоимости и сложности проекта
- Гарантия безопасности сделки

### AI-агенты
| Агент | Функция |
|-------|---------|
| **Task Analyst** | Анализ задачи → структурированное ТЗ |
| **Talent Matcher** | Подбор студентов под требования проекта |
| **Legal Assistant** | Формирование договора, защита сторон |

---

## 🏗️ Архитектура

```
┌─────────────────────────────────────────────────────────────┐
│                      FRONTEND (Next.js)                     │
│  Landing • Студенты • Заказчики • Проекты • Job Connect     │
└─────────────────────────┬───────────────────────────────────┘
                          │ REST API
┌─────────────────────────▼───────────────────────────────────┐
│                    BACKEND (FastAPI)                        │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌─────────────┐  │
│  │   Auth   │  │ Projects │  │ Ratings  │  │ Job Connect │  │
│  └──────────┘  └──────────┘  └──────────┘  └─────────────┘  │
│  ┌─────────────────────────────────────────────────────────┐│
│  │                    AI AGENTS                            ││
│  │  Task Analyst • Talent Matcher • Legal Assistant        ││
│  └─────────────────────────────────────────────────────────┘│
└─────────────────────────┬───────────────────────────────────┘
                          │
┌─────────────────────────▼───────────────────────────────────┐
│                   DATABASE (PostgreSQL)                     │
│        Users • Projects • Tasks • Ratings • Contracts       │
└─────────────────────────────────────────────────────────────┘
```

---

## 📁 Структура проекта

```
work21/
├── .cursor/                    # Правила и пресеты для Cursor IDE
│   ├── rules/                  # Локальные правила сервисов
│   └── presets/                # Готовые промпты
│
├── backend/                    # Python FastAPI сервис
│   ├── app/
│   │   ├── api/                # REST эндпоинты
│   │   │   ├── auth.py         # Авторизация
│   │   │   ├── projects.py     # Проекты
│   │   │   ├── users.py        # Пользователи
│   │   │   └── ratings.py      # Рейтинги
│   │   ├── core/               # Конфигурация, безопасность
│   │   ├── models/             # SQLAlchemy модели
│   │   ├── schemas/            # Pydantic схемы
│   │   ├── services/           # Бизнес-логика
│   │   └── agents/             # AI-агенты
│   ├── tests/                  # Тесты
│   └── requirements.txt        # Python зависимости
│
├── frontend/                   # Next.js приложение
│   ├── src/
│   │   ├── app/                # App Router страницы
│   │   ├── components/         # React компоненты
│   │   └── lib/                # Утилиты, API клиент
│   ├── public/                 # Статические файлы
│   ├── package.json
│   └── tailwind.config.js
│
├── docs/                       # Документация
│   ├── architecture.md         # Детальная архитектура
│   ├── api-contracts.md        # Контракты API
│   └── roadmap.md              # План развития
│
├── docker/                     # Docker конфигурации
│   ├── Dockerfile.backend
│   └── docker-compose.yml
│
└── README.md                   # Этот файл
```

---

## 🛠️ Технологический стек

### Backend (Python)
- **Framework**: FastAPI 0.109+
- **ORM**: SQLAlchemy 2.0
- **Validation**: Pydantic v2
- **Auth**: JWT (python-jose)
- **AI**: OpenAI API / LangChain

### Frontend (TypeScript)
- **Framework**: Next.js 14 (App Router)
- **UI**: React 18 + Tailwind CSS
- **State**: Zustand
- **HTTP**: Axios / fetch

### Database
- **Основная БД**: PostgreSQL 16+
- **Миграции**: Alembic

### Infrastructure
- Docker + Docker Compose
- Nginx (reverse proxy)

---

## 🚀 Быстрый старт

### Prerequisites
- Python 3.11+
- Node.js 18+
- PostgreSQL 16+ (обязательно)
- Docker и Docker Compose (опционально, для запуска через контейнеры)

---

## 🗄️ Настройка PostgreSQL

### Вариант 1: Локальная установка PostgreSQL

#### Установка PostgreSQL

**Windows:**
1. Скачайте установщик с [официального сайта](https://www.postgresql.org/download/windows/)
2. Установите PostgreSQL 16+
3. Запомните пароль для пользователя `postgres`

**Linux (Ubuntu/Debian):**
```bash
sudo apt update
sudo apt install postgresql-16 postgresql-contrib
```

**macOS:**
```bash
brew install postgresql@16
brew services start postgresql@16
```

#### Создание базы данных

```bash
# Подключитесь к PostgreSQL
psql -U postgres

# Создайте базу данных и пользователя
CREATE DATABASE work21;
CREATE USER work21 WITH PASSWORD 'work21password';
GRANT ALL PRIVILEGES ON DATABASE work21 TO work21;
ALTER USER work21 CREATEDB;
\q
```

#### Настройка переменных окружения

Создайте файл `backend/.env`:

```env
DATABASE_URL=postgresql+asyncpg://work21:work21password@localhost:5433/work21
SECRET_KEY=your-secret-key-change-in-production
DEBUG=True
```

### Вариант 2: Запуск через Docker Compose

```bash
# Перейдите в папку docker
cd docker

# Запустите PostgreSQL и приложение
docker-compose up -d db

# Проверьте статус
docker-compose ps
```

PostgreSQL будет доступен на `localhost:5433` с учетными данными:
- **Пользователь**: `work21`
- **Пароль**: `work21password`
- **База данных**: `work21`

### Подключение к PostgreSQL

#### Через psql (командная строка)

```bash
# Локальная установка (если используете Docker)
psql -U work21 -d work21 -h localhost -p 5433

# Docker (внутри контейнера порт остается 5432)
docker exec -it work21-db psql -U work21 -d work21
```

#### Через клиент (pgAdmin, DBeaver, DataGrip)

**Параметры подключения:**
- **Host**: `localhost`
- **Port**: `5433`
- **Database**: `work21`
- **Username**: `work21`
- **Password**: `work21password`

### Применение миграций

После настройки PostgreSQL необходимо применить миграции:

```bash
cd backend

# Создать начальную миграцию (если еще не создана)
alembic revision --autogenerate -m "Initial migration"

# Применить миграции
alembic upgrade head

# Проверить статус базы данных
python db_status.py
```

### Проверка подключения

```bash
cd backend
python db_status.py
```

Скрипт покажет:
- Список таблиц и количество записей
- Пользователей
- Проекты
- Заявки и рейтинги

---

## 🚀 Запуск приложения

### Backend

```bash
cd backend
python -m venv venv
venv\Scripts\activate  # Windows
# или
source venv/bin/activate  # Linux/macOS

pip install -r requirements.txt

# Применить миграции (если еще не применены)
alembic upgrade head

# Запустить сервер
uvicorn app.main:app --reload --port 8000
```

API будет доступен на http://localhost:8000
Документация API: http://localhost:8000/docs

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Откройте http://localhost:3000

### Запуск через Docker Compose (все сервисы)

```bash
cd docker
docker-compose up -d
```

Сервисы будут доступны:
- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:8000
- **PostgreSQL**: localhost:5433

---

## 📖 Документация

- [Архитектура](docs/architecture.md)
- [API контракты](docs/api-contracts.md)
- [Roadmap](docs/roadmap.md)

---

## 🤝 Комиссионная модель

- Платформа взимает комиссию с каждого завершённого заказа
- Средства удерживаются как гарант до успешного завершения
- Студент получает оплату в полном объёме после приёмки работы

---

## 📊 Рейтинговая система

Рейтинг студента формируется на основе:
- Количества выполненных проектов
- Оценок заказчиков
- Сложности задач
- Соблюдения сроков

**Бонусы**: Топ-студенты ежемесячно получают денежные премии из фонда платформы.

---

## 💼 Job Connect

Модуль трудоустройства:
- Платное размещение вакансий для работодателей
- Комиссия за успешное трудоустройство студента
- Интеграция с рейтинговой системой

---

**© 2024 WORK21** — Соединяем образование с рынком труда


