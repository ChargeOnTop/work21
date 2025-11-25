# Создание новой фичи для WORK21

## Контекст проекта

WORK21 — платформа для студентов Школы 21 и заказчиков.
- Backend: Python 3.11+ / FastAPI
- Frontend: Next.js 14 / React 18 / TypeScript
- DB: SQLAlchemy 2.0 + PostgreSQL/SQLite

## Структура

```
backend/app/
├── api/        # REST endpoints
├── models/     # SQLAlchemy модели
├── schemas/    # Pydantic схемы
├── services/   # Бизнес-логика
└── agents/     # AI-агенты

frontend/src/
├── app/        # Next.js страницы (App Router)
├── components/ # React компоненты
└── lib/        # Утилиты, API клиент
```

## При создании фичи

1. **Backend**:
   - Создай модель в `models/`
   - Создай схемы в `schemas/`
   - Добавь роутер в `api/`
   - Обнови `api/__init__.py`

2. **Frontend**:
   - Создай компоненты в `components/`
   - Создай страницу в `app/`
   - Используй Tailwind CSS

## Стиль кода

- Python: PEP 8, type hints, async/await
- TypeScript: strict mode, функциональные компоненты
- Commit messages: на русском, краткие и понятные


