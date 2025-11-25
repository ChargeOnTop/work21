# Архитектура WORK21

## Обзор системы

WORK21 построена как классическое трёхуровневое приложение с микросервисной архитектурой AI-агентов.

## Компоненты

### 1. Frontend Layer

**Технологии**: Next.js 14, React 18, TypeScript, Tailwind CSS

**Модули**:
- `Landing` — публичная витрина платформы
- `Auth` — регистрация и авторизация
- `Dashboard` — личный кабинет (студент/заказчик)
- `Projects` — управление проектами
- `Ratings` — рейтинговая система
- `JobConnect` — модуль трудоустройства

### 2. Backend Layer (FastAPI)

**Технологии**: Python 3.11+, FastAPI, SQLAlchemy 2.0, Pydantic v2

**API Модули**:
```
/api/v1/
├── /auth           # Авторизация (JWT)
├── /users          # Управление пользователями
├── /projects       # CRUD проектов
├── /tasks          # Задачи внутри проектов
├── /applications   # Заявки студентов
├── /ratings        # Рейтинговая система
├── /contracts      # Договоры
└── /jobs           # Job Connect вакансии
```

### 3. AI Agents Layer

Три ключевых AI-агента работают асинхронно:

#### Task Analyst (Агент-аналитик)
- **Input**: Описание задачи от заказчика
- **Output**: Структурированное ТЗ с подзадачами
- **Функции**:
  - Анализ требований
  - Декомпозиция на этапы
  - Оценка сложности и сроков
  - Выявление рисков

#### Talent Matcher (HR-агент)
- **Input**: Требования проекта (стек, сложность)
- **Output**: Список подходящих кандидатов
- **Функции**:
  - Поиск по навыкам
  - Анализ рейтинга и портфолио
  - Проверка доступности
  - Ранжирование кандидатов

#### Legal Assistant (Агент-юрист)
- **Input**: Параметры сделки
- **Output**: Типовой договор
- **Функции**:
  - Генерация договора по шаблону
  - Фиксация условий и сроков
  - Обработка платежей
  - Закрытие договора

### 4. Database Layer

**PostgreSQL** (production) / **SQLite** (development)

**Основные сущности**:
```
Users (id, email, role, profile_data, rating, created_at)
Projects (id, customer_id, title, description, budget, status, created_at)
Tasks (id, project_id, title, requirements, deadline, status)
Applications (id, task_id, student_id, status, created_at)
Ratings (id, user_id, project_id, score, comment)
Contracts (id, project_id, terms, status, signed_at)
Jobs (id, company_id, title, requirements, salary_range)
```

## Потоки данных

### Создание проекта

```
Заказчик → POST /projects → Task Analyst → ТЗ
                                ↓
                        Talent Matcher → Кандидаты
                                ↓
                        Legal Assistant → Договор
```

### Выполнение проекта

```
Студент → Заявка → Одобрение → Выполнение → Ревью → Оплата
                                    ↓
                              Обновление рейтинга
```

## Безопасность

- JWT токены для аутентификации
- RBAC (Role-Based Access Control): student, customer, admin
- Эскроу-платежи через платформу
- Шифрование персональных данных

## Масштабирование

- Stateless backend (горизонтальное масштабирование)
- Redis для кэширования и сессий
- Celery для фоновых задач (AI-агенты)
- PostgreSQL read replicas для чтения


