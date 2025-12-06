# WORK21 Frontend - Документация для AI

## Обзор

**WORK21 Frontend** — клиентское приложение на Next.js 14 для платформы, соединяющей студентов Школы 21 с заказчиками. Поддерживает роли студентов, заказчиков и администраторов.

## Основные функции

- Landing страница с информацией о платформе и AI-агентах
- Аутентификация (регистрация и вход)
- Dashboard для студентов и заказчиков
- Управление проектами (создание, просмотр, редактирование, подача заявок)
- Рейтинговая система с лидербордом
- Профили пользователей
- Интеграция с AI-оценщиком для оценки стоимости проектов
- Темная/светлая тема

## Технологический стек

- **Next.js 14.2.0** — React фреймворк с App Router
- **React 18.2.0** — UI библиотека
- **TypeScript 5.3.3** — типизация
- **Tailwind CSS 3.4.1** — стилизация
- **Lucide React** — иконки

## Структура проекта

```
frontend/
├── src/
│   ├── app/                    # Next.js App Router страницы
│   │   ├── dashboard/          # Защищённая область
│   │   ├── login/              # Страница входа
│   │   └── register/           # Страница регистрации
│   ├── components/             # React компоненты
│   └── lib/                    # Утилиты и контексты
│       ├── api.ts              # API клиент
│       ├── auth-context.tsx    # Контекст аутентификации
│       └── theme-context.tsx   # Контекст темы
```

## Поток данных

1. Пользователь → UI
2. React компоненты → `lib/api.ts`
3. API клиент → Backend (FastAPI) или Agent Estimator Service
4. Контексты → управление состоянием (auth, theme)
5. Компоненты → обновление UI

## API Интеграция

### Backend API (FastAPI)

**Базовый URL**: `http://localhost:8000` (через `NEXT_PUBLIC_API_URL`)

**Модули:**
- **authApi** — `register()`, `login()`
- **usersApi** — `getMe()`, `updateMe()`, `getStudents()`, `getLeaderboard()`
- **projectsApi** — `create()`, `getList()`, `getMy()`, `getById()`, `update()`, `publish()`, `apply()`, `getApplications()`, `updateApplicationStatus()`, `assignTaskAssignee()`, `assignProjectAssignee()`, `createTask()`, `complete()`, `requestReview()`
- **applicationsApi** — `getMy()`
- **ratingsApi** — `create()`, `getUserRatings()`

### Agent Estimator Service API

**Базовый URL**: `http://localhost:8080` (через `NEXT_PUBLIC_ESTIMATOR_API_URL`)

- **estimatorApi** — `estimate(prompt, model?)` — оценка стоимости проекта через LLM

**Обработка ошибок:**
- API клиент использует класс `ApiError` для обработки ошибок
- Все API функции автоматически добавляют JWT токен из `localStorage` в заголовки

## Контексты (State Management)

### AuthContext (`src/lib/auth-context.tsx`)

Управляет состоянием аутентификации.

```typescript
const { user, login, logout, isAuthenticated } = useAuth();
```

### ThemeContext (`src/lib/theme-context.tsx`)

Управляет темой приложения (dark/light).

```typescript
const { theme, toggleTheme } = useTheme();
```

## Роли пользователей

### Student (Студент)
- Просмотр открытых проектов
- Подача заявок на проекты
- Просмотр своих заявок и назначенных проектов
- Просмотр рейтинга и лидерборда

### Customer (Заказчик)
- Создание и управление проектами
- Управление заявками (принятие/отклонение)
- Назначение исполнителей
- Просмотр списка студентов

### Admin (Администратор)
- Все функции заказчика
- Управление пользователями

## Типы данных

### User
```typescript
interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  role: 'student' | 'customer' | 'admin';
  bio?: string;
  skills?: string;
  avatar_url?: string;
  rating_score: number;
  completed_projects: number;
  is_active: boolean;
  is_verified: boolean;
  created_at: string;
}
```

### Project
```typescript
interface Project {
  id: number;
  title: string;
  description: string;
  requirements?: string;
  budget: number;
  deadline?: string;
  tech_stack?: string | string[];
  status: 'draft' | 'open' | 'in_progress' | 'review' | 'completed' | 'cancelled';
  customer_id: number;
  assignee_id?: number;
  assignee?: ProjectAssignee;
  generated_spec?: string;
  llm_estimation?: string;
  created_at: string;
  updated_at: string;
  tasks: Task[];
}
```

### Task
```typescript
interface Task {
  id: number;
  title: string;
  description: string;
  complexity: number;
  estimated_hours?: number;
  deadline?: string;
  status: 'pending' | 'in_progress' | 'review' | 'completed';
  project_id: number;
  assignee_id?: number;
  assignee?: TaskAssignee;
  order: number;
  created_at: string;
}
```

### Application
```typescript
interface Application {
  id: number;
  project_id: number;
  student_id: number;
  cover_letter?: string;
  proposed_rate?: number;
  status: 'pending' | 'accepted' | 'rejected';
  created_at: string;
}
```

## Переменные окружения

Создайте файл `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_ESTIMATOR_API_URL=http://localhost:8080
```

## Запуск и разработка

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production сборка
npm run lint     # линтинг
```

## Особенности реализации

- **Защита маршрутов**: Dashboard layout автоматически редиректит неавторизованных на `/login`
- **JWT токены**: хранятся в `localStorage` под ключом `access_token`
- **Тема**: предотвращение мерцания через inline script в `<head>`
- **Типизация**: все API функции типизированы через TypeScript
- **Стилизация**: Tailwind CSS с кастомными классами и CSS переменными

## Связанные сервисы

- **Backend (FastAPI)** — `http://localhost:8000`
- **Agent Estimator Service** — `http://localhost:8080`
- **PostgreSQL** — база данных

