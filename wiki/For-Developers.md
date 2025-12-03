# Руководство разработчика

## 🛠️ Настройка окружения разработки

### VS Code Extensions

Рекомендуемые расширения:

```json
{
  "recommendations": [
    "ms-python.python",
    "ms-python.vscode-pylance",
    "bradlc.vscode-tailwindcss",
    "dbaeumer.vscode-eslint",
    "esbenp.prettier-vscode"
  ]
}
```

### Pre-commit hooks

```bash
pip install pre-commit
pre-commit install
```

---

## 📁 Структура кода

### Backend

```
backend/app/
├── __init__.py
├── main.py              # FastAPI application
│
├── api/                 # REST API endpoints
│   ├── __init__.py      # Router aggregation
│   ├── auth.py          # /auth/* endpoints
│   ├── users.py         # /users/* endpoints
│   ├── projects.py      # /projects/* endpoints
│   ├── ratings.py       # /ratings/* endpoints
│   └── deps.py          # Dependencies (auth, db)
│
├── core/                # Core configuration
│   ├── config.py        # Settings (pydantic)
│   ├── database.py      # SQLAlchemy setup
│   └── security.py      # JWT, password hashing
│
├── models/              # SQLAlchemy ORM models
│   ├── user.py
│   ├── project.py
│   ├── rating.py
│   └── contract.py
│
├── schemas/             # Pydantic schemas
│   ├── user.py
│   └── project.py
│
└── agents/              # AI agents
    ├── task_analyst.py
    ├── talent_matcher.py
    └── legal_assistant.py
```

### Frontend

```
frontend/src/
├── app/                 # Next.js App Router
│   ├── layout.tsx       # Root layout
│   ├── page.tsx         # Home page
│   ├── providers.tsx    # Context providers
│   ├── globals.css      # Global styles
│   │
│   ├── login/
│   ├── register/
│   ├── dashboard/
│   ├── students/
│   └── customers/
│
├── components/          # React components
│   ├── Header.tsx
│   ├── Footer.tsx
│   ├── Hero.tsx
│   └── ...
│
└── lib/                 # Utilities
    ├── api.ts           # API client
    └── auth-context.tsx # Auth context
```

---

## 🔧 Добавление нового endpoint

### 1. Создайте модель (если нужно)

```python
# backend/app/models/example.py
from sqlalchemy import String
from sqlalchemy.orm import Mapped, mapped_column
from app.core.database import Base

class Example(Base):
    __tablename__ = "examples"
    
    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(255))
```

### 2. Создайте схему

```python
# backend/app/schemas/example.py
from pydantic import BaseModel

class ExampleCreate(BaseModel):
    name: str

class ExampleResponse(ExampleCreate):
    id: int
    
    class Config:
        from_attributes = True
```

### 3. Создайте endpoint

```python
# backend/app/api/examples.py
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.models.example import Example
from app.schemas.example import ExampleCreate, ExampleResponse

router = APIRouter()

@router.post("/", response_model=ExampleResponse)
async def create_example(
    data: ExampleCreate,
    db: AsyncSession = Depends(get_db)
):
    example = Example(**data.model_dump())
    db.add(example)
    await db.commit()
    await db.refresh(example)
    return example
```

### 4. Зарегистрируйте router

```python
# backend/app/api/__init__.py
from app.api import examples

api_router.include_router(
    examples.router, 
    prefix="/examples", 
    tags=["examples"]
)
```

---

## 🎨 Добавление новой страницы (Frontend)

### 1. Создайте страницу

```tsx
// frontend/src/app/example/page.tsx
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function ExamplePage() {
  return (
    <>
      <Header />
      <main className="pt-16">
        <section className="section">
          <div className="container-lg mx-auto">
            <h1 className="text-4xl font-bold text-white">
              Example Page
            </h1>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
```

### 2. Добавьте в навигацию (если нужно)

```tsx
// frontend/src/components/Header.tsx
const navigation = [
  // ...
  { name: 'Example', href: '/example' },
]
```

---

## 🧪 Тестирование

### Backend

```bash
cd backend
pytest

# С покрытием
pytest --cov=app --cov-report=html
```

### Frontend

```bash
cd frontend
npm run lint
npm run build  # Type checking
```

---

## 📝 Code Style

### Python

- **Formatter:** Black
- **Linter:** Ruff
- **Type hints:** обязательны

```bash
black app/
ruff check app/
mypy app/
```

### TypeScript

- **Formatter:** Prettier
- **Linter:** ESLint
- **Strict mode:** включён

```bash
npm run lint
npm run format
```

---

## 🔀 Git Workflow

### Ветки

| Ветка | Назначение |
|-------|------------|
| `main` | Production-ready код |
| `develop` | Интеграция фич |
| `feature/*` | Новые фичи |
| `fix/*` | Исправления багов |

### Commit messages

Используем [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: добавлена регистрация пользователей
fix: исправлена ошибка bcrypt
docs: обновлена документация API
refactor: переработан модуль security
```

### Pull Request

1. Создайте ветку от `develop`
2. Внесите изменения
3. Напишите тесты
4. Создайте PR в `develop`
5. Пройдите code review

---

## 🚀 Деплой

### Docker

```bash
cd docker
docker-compose -f docker-compose.prod.yml up -d
```

### Environment Variables (Production)

```env
DEBUG=False
DATABASE_URL=postgresql+asyncpg://user:pass@host:5433/work21
SECRET_KEY=<generate-secure-key>
CORS_ORIGINS=["https://work21.ru"]
```

---

[[Home]] | [[Architecture]] | [[API Reference]]

