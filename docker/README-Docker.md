# Инструкция по работе с Docker

## ⚠️ Важно: Проблема с паролем при сборке

### Проблема
PostgreSQL в Docker применяет переменные окружения `POSTGRES_USER`, `POSTGRES_PASSWORD` и `POSTGRES_DB` **только при первом запуске** (когда база данных инициализируется впервые).

Если volume уже существует, эти переменные **игнорируются**, и используются старые настройки из volume.

### Решение

#### Вариант 1: Удалить volume и пересоздать (если нет важных данных)

```bash
# Остановить контейнеры
cd docker
docker-compose down

# Удалить volume с данными
docker volume rm docker_postgres_data

# Запустить заново (создастся новая БД с новым паролем)
docker-compose up -d db
```

#### Вариант 2: Изменить пароль в существующей БД

```bash
# Подключиться к PostgreSQL
docker exec -it work21-db psql -U postgres

# Изменить пароль пользователя work21
ALTER USER work21 WITH PASSWORD 'work21password';

# Выйти
\q
```

#### Вариант 3: Использовать .env файл

1. Скопируйте `.env.example` в `.env`:
   ```bash
   cd docker
   cp .env.example .env
   ```

2. Отредактируйте `.env` с нужными значениями

3. Запустите:
   ```bash
   docker-compose up -d
   ```

---

## Режимы работы

### Development режим (по умолчанию)

```bash
cd docker
docker-compose up -d
```

**Характеристики:**
- `DEBUG=True` (если указано в .env)
- Hot reload для backend и frontend
- Volumes для разработки (код монтируется)

### Production режим

```bash
cd docker
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```

**Характеристики:**
- `DEBUG=False`
- Без hot reload
- Оптимизированные образы

---

## Команды для работы

### Сборка и запуск

```bash
# Сборка всех образов
docker-compose build

# Сборка конкретного сервиса
docker-compose build backend

# Запуск в фоне
docker-compose up -d

# Запуск с пересборкой
docker-compose up -d --build

# Запуск с просмотром логов
docker-compose up
```

### Остановка и очистка

```bash
# Остановить контейнеры
docker-compose down

# Остановить и удалить volumes (⚠️ удалит данные БД!)
docker-compose down -v

# Остановить и удалить volumes и образы
docker-compose down -v --rmi all
```

### Просмотр логов

```bash
# Все сервисы
docker-compose logs -f

# Конкретный сервис
docker-compose logs -f backend
docker-compose logs -f db
```

### Работа с базой данных

```bash
# Подключиться к PostgreSQL
docker exec -it work21-db psql -U work21 -d work21

# Выполнить SQL команду
docker exec -it work21-db psql -U work21 -d work21 -c "SELECT version();"

# Применить миграции
docker exec -it work21-backend alembic upgrade head

# Проверить статус БД
docker exec -it work21-backend python db_status.py
```

---

## Проверка подключения

### Проверка через командную строку

```bash
# Проверить, что PostgreSQL доступен
docker exec -it work21-db pg_isready -U work21

# Подключиться
docker exec -it work21-db psql -U work21 -d work21
```

### Проверка через DBeaver

**Параметры подключения:**
```
Host: localhost
Port: 5433
Database: work21
Username: work21
Password: work21password  (или из .env файла)
```

**Если пароль не принимается:**
1. Проверьте, что используется правильный пароль из `.env` или `docker-compose.yml`
2. Если volume старый, используйте Вариант 2 выше (изменить пароль в БД)
3. Или удалите volume и пересоздайте (Вариант 1)

---

## Переменные окружения

Все переменные можно задать через:
1. Файл `.env` в папке `docker/` (рекомендуется)
2. Переменные окружения системы
3. Прямо в `docker-compose.yml` (не рекомендуется для паролей)

**Приоритет:** `.env` файл > переменные окружения > значения по умолчанию в docker-compose.yml

---

## Troubleshooting

### Проблема: "Пароль не принимается"

**Причина:** Volume существует с другим паролем

**Решение:**
```bash
# Вариант 1: Удалить volume (если нет важных данных)
docker-compose down -v
docker-compose up -d db

# Вариант 2: Изменить пароль в БД
docker exec -it work21-db psql -U postgres -c "ALTER USER work21 WITH PASSWORD 'work21password';"
```

### Проблема: "База данных не найдена"

**Решение:**
```bash
docker exec -it work21-db psql -U postgres -c "CREATE DATABASE work21;"
docker exec -it work21-db psql -U postgres -c "GRANT ALL PRIVILEGES ON DATABASE work21 TO work21;"
```

### Проблема: "Порт 5433 уже занят"

**Решение:**
```bash
# Проверить, что занимает порт
netstat -ano | findstr :5433

# Или изменить порт в docker-compose.yml на другой
ports:
  - "5434:5432"  # Внешний:Внутренний
```

---

## Полезные команды

```bash
# Просмотр всех volumes
docker volume ls

# Просмотр всех контейнеров
docker ps -a

# Просмотр логов конкретного контейнера
docker logs work21-db
docker logs work21-backend

# Перезапустить сервис
docker-compose restart db

# Выполнить команду в контейнере
docker exec -it work21-backend bash
```

