# API Контракты WORK21

Базовый URL: `http://localhost:8000/api/v1`

## Аутентификация

Все защищённые endpoints требуют JWT токен в заголовке:
```
Authorization: Bearer <token>
```

---

## Auth API

### POST /auth/register
Регистрация нового пользователя.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securepassword123",
  "first_name": "Иван",
  "last_name": "Петров",
  "role": "student"  // "student" | "customer"
}
```

**Response 201:**
```json
{
  "id": 1,
  "email": "user@example.com",
  "first_name": "Иван",
  "last_name": "Петров",
  "role": "student",
  "rating_score": 0.0,
  "completed_projects": 0,
  "is_active": true,
  "is_verified": false,
  "created_at": "2025-01-01T00:00:00Z"
}
```

### POST /auth/login
Авторизация (получение JWT токена).

**Request Body (form-data):**
```
username: user@example.com
password: securepassword123
```

**Response 200:**
```json
{
  "access_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
  "token_type": "bearer"
}
```

---

## Users API

### GET /users/me
Получить профиль текущего пользователя.

**Auth Required:** Yes

**Response 200:**
```json
{
  "id": 1,
  "email": "user@example.com",
  "first_name": "Иван",
  "last_name": "Петров",
  "role": "student",
  "bio": "Python разработчик",
  "skills": "[\"Python\", \"FastAPI\", \"React\"]",
  "rating_score": 4.5,
  "completed_projects": 10
}
```

### PUT /users/me
Обновить профиль текущего пользователя.

**Auth Required:** Yes

**Request Body:**
```json
{
  "first_name": "Иван",
  "last_name": "Иванов",
  "bio": "Fullstack разработчик",
  "skills": ["Python", "FastAPI", "React", "TypeScript"]
}
```

### GET /users/{user_id}
Получить публичный профиль пользователя.

### GET /users/
Получить список студентов (для заказчиков).

**Query Parameters:**
- `skip`: int (default: 0)
- `limit`: int (default: 20)

### GET /users/leaderboard
Получить топ студентов по рейтингу.

**Query Parameters:**
- `limit`: int (default: 10)

---

## Projects API

### POST /projects/
Создать новый проект (только для заказчиков).

**Auth Required:** Yes (role: customer)

**Request Body:**
```json
{
  "title": "Мобильное приложение для доставки",
  "description": "Разработка кроссплатформенного приложения",
  "requirements": "iOS и Android, Firebase, push-уведомления",
  "budget": 150000,
  "deadline": "2025-02-01T00:00:00Z",
  "tech_stack": ["React Native", "Firebase", "TypeScript"]
}
```

**Response 201:**
```json
{
  "id": 1,
  "title": "Мобильное приложение для доставки",
  "description": "...",
  "budget": 150000,
  "status": "draft",
  "customer_id": 1,
  "created_at": "2025-01-01T00:00:00Z",
  "tasks": []
}
```

### GET /projects/
Получить список открытых проектов.

**Query Parameters:**
- `status`: ProjectStatus (optional)
- `skip`: int (default: 0)
- `limit`: int (default: 20)

### GET /projects/my
Получить проекты текущего пользователя.

**Auth Required:** Yes

### GET /projects/{project_id}
Получить проект по ID.

### PUT /projects/{project_id}
Обновить проект (только владелец).

**Auth Required:** Yes

### POST /projects/{project_id}/publish
Опубликовать проект (перевести в статус OPEN).

**Auth Required:** Yes

---

## Applications API (Заявки)

### POST /projects/{project_id}/apply
Подать заявку на проект (только для студентов).

**Auth Required:** Yes (role: student)

**Request Body:**
```json
{
  "project_id": 1,
  "cover_letter": "Имею опыт работы с React Native...",
  "proposed_rate": 140000
}
```

**Response 201:**
```json
{
  "id": 1,
  "project_id": 1,
  "student_id": 2,
  "cover_letter": "...",
  "proposed_rate": 140000,
  "status": "pending",
  "created_at": "2025-01-01T00:00:00Z"
}
```

### GET /projects/{project_id}/applications
Получить заявки на проект (только владелец).

**Auth Required:** Yes

### PUT /projects/{project_id}/applications/{application_id}
Обновить статус заявки (принять/отклонить).

**Auth Required:** Yes

**Request Body:**
```json
{
  "status": "accepted"  // "accepted" | "rejected"
}
```

---

## Ratings API

### POST /ratings/
Создать рейтинг/отзыв (после завершения проекта).

**Auth Required:** Yes (role: customer)

**Request Body:**
```json
{
  "project_id": 1,
  "reviewee_id": 2,
  "score": 5,
  "comment": "Отличная работа!",
  "quality_score": 5,
  "communication_score": 4,
  "deadline_score": 5
}
```

### GET /ratings/user/{user_id}
Получить отзывы о пользователе.

**Query Parameters:**
- `skip`: int (default: 0)
- `limit`: int (default: 20)

---

## Статусы

### ProjectStatus
- `draft` — Черновик
- `open` — Открыт для заявок
- `in_progress` — В работе
- `review` — На проверке
- `completed` — Завершён
- `cancelled` — Отменён

### ApplicationStatus
- `pending` — Ожидает рассмотрения
- `accepted` — Принята
- `rejected` — Отклонена

### UserRole
- `student` — Студент
- `customer` — Заказчик
- `admin` — Администратор

---

## Коды ошибок

| Код | Описание |
|-----|----------|
| 400 | Bad Request — неверные данные |
| 401 | Unauthorized — требуется авторизация |
| 403 | Forbidden — нет доступа |
| 404 | Not Found — ресурс не найден |
| 422 | Validation Error — ошибка валидации |
| 500 | Internal Server Error |

---

## Пример интеграции (Frontend)

```typescript
// lib/api.ts
const API_BASE = 'http://localhost:8000/api/v1';

export async function login(email: string, password: string) {
  const formData = new FormData();
  formData.append('username', email);
  formData.append('password', password);
  
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    body: formData,
  });
  
  return res.json();
}

export async function getProjects(token: string) {
  const res = await fetch(`${API_BASE}/projects/`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  
  return res.json();
}
```

