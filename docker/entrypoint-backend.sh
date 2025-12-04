#!/bin/bash
set -e

echo "Ожидание готовности базы данных..."
# Ждем, пока PostgreSQL станет доступен
# Используем простую проверку через psycopg2
MAX_RETRIES=30
RETRY=0

while [ $RETRY -lt $MAX_RETRIES ]; do
  if python -c "
import sys
from urllib.parse import urlparse
try:
    import psycopg2
    db_url = '${DATABASE_URL}'
    # Преобразуем async URL в sync для проверки
    db_url = db_url.replace('+asyncpg', '').replace('postgresql+asyncpg://', 'postgresql://')
    parsed = urlparse(db_url)
    conn = psycopg2.connect(
        host=parsed.hostname,
        port=parsed.port or 5432,
        user=parsed.username,
        password=parsed.password,
        database=parsed.path[1:] if parsed.path else 'postgres',
        connect_timeout=2
    )
    conn.close()
    sys.exit(0)
except Exception:
    sys.exit(1)
" 2>/dev/null; then
    echo "База данных готова!"
    break
  fi
  
  RETRY=$((RETRY + 1))
  if [ $RETRY -lt $MAX_RETRIES ]; then
    echo "База данных недоступна - ожидание... ($RETRY/$MAX_RETRIES)"
    sleep 2
  else
    echo "ОШИБКА: База данных не стала доступна за отведенное время"
    exit 1
  fi
done

echo "Применение миграций Alembic..."
# Применяем миграции Alembic
if alembic upgrade head; then
    echo "Миграции успешно применены."
else
    echo "Предупреждение: Не удалось применить миграции. Продолжаем запуск..."
fi

echo "Запуск приложения..."
# Запускаем приложение с переданными аргументами
exec "$@"

