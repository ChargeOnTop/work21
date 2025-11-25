# Установка и запуск

## 📋 Требования

| Компонент | Версия |
|-----------|--------|
| Python | 3.10+ |
| Node.js | 18+ |
| npm | 9+ |
| Git | 2.x |

## 🚀 Быстрый старт

### 1. Клонирование репозитория

```bash
git clone https://github.com/ChargeOnTop/work21.git
cd work21
```

### 2. Настройка Backend (Python + FastAPI)

```bash
# Переход в папку backend
cd backend

# Создание виртуального окружения
python -m venv venv

# Активация (Windows PowerShell)
.\venv\Scripts\Activate.ps1

# Активация (Windows CMD)
.\venv\Scripts\activate.bat

# Активация (Linux/Mac)
source venv/bin/activate

# Установка зависимостей
pip install -r requirements.txt

# Запуск сервера разработки
uvicorn app.main:app --reload --port 8000
```

**Backend доступен по адресу:** http://localhost:8000

### 3. Настройка Frontend (Next.js)

```bash
# В новом терминале, переход в папку frontend
cd frontend

# Установка зависимостей
npm install

# Запуск сервера разработки
npm run dev
```

**Frontend доступен по адресу:** http://localhost:3000

## 🔧 Конфигурация

### Backend (.env)

Создайте файл `backend/.env`:

```env
# Основные настройки
APP_NAME=WORK21
DEBUG=True

# База данных (SQLite для разработки)
DATABASE_URL=sqlite+aiosqlite:///./work21.db

# JWT Security (измените в production!)
SECRET_KEY=your-super-secret-key-change-in-production
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# CORS
CORS_ORIGINS=["http://localhost:3000"]

# OpenAI (опционально, для AI-агентов)
OPENAI_API_KEY=
```

### Frontend (.env.local)

Создайте файл `frontend/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## 📁 Структура проекта

```
work21/
├── backend/                 # Python FastAPI
│   ├── app/
│   │   ├── api/            # REST endpoints
│   │   ├── core/           # Конфигурация
│   │   ├── models/         # SQLAlchemy модели
│   │   ├── schemas/        # Pydantic схемы
│   │   ├── agents/         # AI-агенты
│   │   └── main.py         # Entry point
│   ├── requirements.txt
│   └── work21.db           # SQLite база
│
├── frontend/                # Next.js React
│   ├── src/
│   │   ├── app/            # Страницы (App Router)
│   │   ├── components/     # React компоненты
│   │   └── lib/            # Утилиты, API клиент
│   └── package.json
│
├── docs/                    # Документация
├── docker/                  # Docker конфигурации
└── README.md
```

## 🐳 Docker (опционально)

```bash
# Сборка и запуск всех сервисов
cd docker
docker-compose up --build

# Или в фоне
docker-compose up -d --build
```

## ✅ Проверка работоспособности

### Backend Health Check
```bash
curl http://localhost:8000/health
# {"status": "healthy"}
```

### API Documentation
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

### Frontend
- Главная: http://localhost:3000
- Регистрация: http://localhost:3000/register
- Вход: http://localhost:3000/login

## 🔥 Частые проблемы

### Ошибка bcrypt на Windows

Если возникает ошибка с bcrypt:
```bash
pip install bcrypt==4.0.1 --force-reinstall
```

### Port already in use

```bash
# Windows - найти процесс
netstat -ano | findstr :8000

# Убить процесс
taskkill /PID <PID> /F
```

### CORS ошибки

Убедитесь, что `CORS_ORIGINS` в `.env` содержит URL фронтенда:
```env
CORS_ORIGINS=["http://localhost:3000"]
```

---

[[Home]] | [[Architecture]] | [[API Reference]]

