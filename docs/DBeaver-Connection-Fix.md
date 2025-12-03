# Решение проблем подключения к PostgreSQL в DBeaver

## Ошибка: "Пользователь 'work21' не может подключиться (нет прав доступа)"

### Причина
Пользователь `work21` не существует в PostgreSQL или не имеет прав доступа к базе данных.

---

## Решение

### Вариант 1: Если PostgreSQL запущен через Docker

#### Шаг 1: Проверьте, запущен ли контейнер
```bash
docker ps | grep work21-db
```

Если контейнер не запущен:
```bash
cd docker
docker-compose up -d db
```

#### Шаг 2: Подключитесь к PostgreSQL как суперпользователь
```bash
docker exec -it work21-db psql -U postgres
```

#### Шаг 3: Создайте пользователя и базу данных (если их нет)
```sql
-- Проверьте, существует ли пользователь
SELECT usename FROM pg_user WHERE usename = 'work21';

-- Если пользователя нет, создайте его
CREATE USER work21 WITH PASSWORD 'work21password';

-- Создайте базу данных (если не существует)
CREATE DATABASE work21;

-- Дайте все права пользователю
GRANT ALL PRIVILEGES ON DATABASE work21 TO work21;

-- Дайте права на создание баз данных (опционально)
ALTER USER work21 CREATEDB;

-- Выйдите
\q
```

#### Шаг 4: Проверьте подключение
```bash
docker exec -it work21-db psql -U work21 -d work21
```

Если подключение успешно, вы увидите приглашение `work21=#`

---

### Вариант 2: Если PostgreSQL установлен локально

#### Шаг 1: Подключитесь как суперпользователь
```bash
# Windows (если PostgreSQL в PATH)
psql -U postgres

# Linux/macOS
sudo -u postgres psql
```

#### Шаг 2: Создайте пользователя и базу данных
```sql
CREATE USER work21 WITH PASSWORD 'work21password';
CREATE DATABASE work21;
GRANT ALL PRIVILEGES ON DATABASE work21 TO work21;
ALTER USER work21 CREATEDB;
\q
```

---

## Настройка подключения в DBeaver

### Параметры подключения

1. **Создайте новое подключение PostgreSQL:**
   - Правый клик → `New` → `Database Connection`
   - Выберите `PostgreSQL`

2. **Основные настройки:**
   ```
   Host: localhost
   Port: 5433
   Database: work21
   Username: work21
   Password: work21password
   ```

3. **Дополнительные настройки (если нужно):**
   - Вкладка `Driver properties`:
     - `allowEncodingChanges`: `true`
     - `charSet`: `UTF8`

4. **Настройки кодировки (для исправления кракозябр):**
   - Вкладка `Connection settings` → `Encoding`:
     - Выберите `UTF-8`

5. **Тест подключения:**
   - Нажмите `Test Connection`
   - Должно появиться сообщение "Connected"

---

## Проверка прав доступа

Если проблема сохраняется, проверьте права:

```sql
-- Подключитесь как postgres
psql -U postgres

-- Проверьте пользователей
\du

-- Проверьте базы данных
\l

-- Дайте права на схему public
\c work21
GRANT ALL ON SCHEMA public TO work21;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO work21;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO work21;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO work21;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO work21;
```

---

## Альтернативное решение: Использовать пользователя postgres

Если не удается создать пользователя `work21`, можно временно использовать `postgres`:

**Параметры подключения в DBeaver:**
```
Host: localhost
Port: 5433
Database: work21
Username: postgres
Password: <пароль postgres>
```

**⚠️ Внимание:** Использование пользователя `postgres` в production не рекомендуется!

---

## Проверка подключения через командную строку

```bash
# Через Docker
docker exec -it work21-db psql -U work21 -d work21

# Локально
psql -U work21 -d work21 -h localhost
```

Если подключение через командную строку работает, а в DBeaver нет — проблема в настройках DBeaver.

---

## Исправление кодировки в DBeaver

Если видите кракозябры вместо русских букв:

1. **В настройках подключения:**
   - `Connection settings` → `Encoding`: `UTF-8`

2. **В настройках DBeaver:**
   - `Window` → `Preferences` → `Editors` → `Text Editors` → `Spelling`
   - Убедитесь, что кодировка UTF-8

3. **Перезапустите DBeaver**

---

## Быстрая проверка

Создайте скрипт для проверки:

```bash
# check_db.sh
docker exec -it work21-db psql -U postgres -c "
SELECT 
    usename as username,
    usesuper as is_superuser
FROM pg_user 
WHERE usename = 'work21';
"
```

Если пользователь существует, вы увидите его в списке.

