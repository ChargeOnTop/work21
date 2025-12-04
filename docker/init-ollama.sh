#!/bin/sh
# Скрипт для предзагрузки модели deepseek-r1 в Ollama

# Определяем хост Ollama (по умолчанию ollama, но может быть localhost при network_mode)
OLLAMA_HOST=${OLLAMA_HOST:-ollama}
OLLAMA_PORT=${OLLAMA_PORT:-11434}

echo "Ожидание запуска Ollama на $OLLAMA_HOST:$OLLAMA_PORT..."
sleep 10

# Проверяем доступность Ollama API
check_ollama() {
  # Пробуем разные способы проверки
  if command -v curl > /dev/null 2>&1; then
    curl -f -s --max-time 2 http://$OLLAMA_HOST:$OLLAMA_PORT/api/version > /dev/null 2>&1
    return $?
  elif command -v wget > /dev/null 2>&1; then
    wget -q --spider --timeout=2 http://$OLLAMA_HOST:$OLLAMA_PORT/api/version 2>/dev/null
    return $?
  elif command -v nc > /dev/null 2>&1; then
    nc -z $OLLAMA_HOST $OLLAMA_PORT 2>/dev/null
    return $?
  else
    # Последняя попытка через /dev/tcp (bash-специфично)
    (timeout 1 bash -c "cat < /dev/null > /dev/tcp/$OLLAMA_HOST/$OLLAMA_PORT" 2>/dev/null) && return 0 || return 1
  fi
}

# Ждем доступности Ollama API (максимум 2 минуты)
MAX_WAIT=40
WAIT_COUNT=0
until check_ollama; do
  WAIT_COUNT=$((WAIT_COUNT + 1))
  if [ $WAIT_COUNT -ge $MAX_WAIT ]; then
    echo "ОШИБКА: Ollama API не стал доступен за отведенное время"
    echo "Проверка подключения к $OLLAMA_HOST:$OLLAMA_PORT..."
    exit 1
  fi
  echo "Ожидание доступности Ollama API на $OLLAMA_HOST:$OLLAMA_PORT... ($WAIT_COUNT/$MAX_WAIT)"
  sleep 3
done

echo "Ollama API доступен. Загрузка модели deepseek-r1 через API..."

# Загружаем модель через API Ollama (повторяем попытки при необходимости)
MAX_RETRIES=3
RETRY=0
while [ $RETRY -lt $MAX_RETRIES ]; do
  echo "Попытка загрузки модели deepseek-r1 через API (попытка $((RETRY + 1))/$MAX_RETRIES)..."
  
  # Используем API для загрузки модели (API возвращает потоковый ответ)
  if command -v curl > /dev/null 2>&1; then
    echo "Загрузка модели deepseek-r1 через API (это может занять несколько минут)..."
    # Запускаем загрузку в фоне и отслеживаем прогресс
    curl -f -s -X POST http://$OLLAMA_HOST:$OLLAMA_PORT/api/pull \
      -H "Content-Type: application/json" \
      -d '{"name":"deepseek-r1"}' &
    CURL_PID=$!
    
    # Ждем завершения загрузки (максимум 10 минут)
    WAIT_COUNT=0
    MAX_WAIT_LOAD=200
    while kill -0 $CURL_PID 2>/dev/null && [ $WAIT_COUNT -lt $MAX_WAIT_LOAD ]; do
      sleep 3
      WAIT_COUNT=$((WAIT_COUNT + 1))
      if [ $((WAIT_COUNT % 10)) -eq 0 ]; then
        echo "Ожидание завершения загрузки модели... ($((WAIT_COUNT * 3)) секунд)"
      fi
    done
    
    wait $CURL_PID
    CURL_EXIT=$?
    
    if [ $CURL_EXIT -eq 0 ]; then
      echo "Загрузка модели завершена"
      sleep 2
      break
    else
      echo "Ошибка при загрузке модели (код: $CURL_EXIT)"
    fi
  elif command -v wget > /dev/null 2>&1; then
    echo "Загрузка модели deepseek-r1 через API (это может занять несколько минут)..."
    wget -q -O- --post-data='{"name":"deepseek-r1"}' \
      --header='Content-Type: application/json' \
      http://$OLLAMA_HOST:$OLLAMA_PORT/api/pull
    if [ $? -eq 0 ]; then
      echo "Загрузка модели завершена"
      sleep 2
      break
    else
      echo "Ошибка при загрузке модели"
    fi
  else
    # Если нет curl/wget, пробуем использовать команду ollama напрямую
    echo "Использование команды ollama pull..."
    if OLLAMA_HOST=$OLLAMA_HOST:$OLLAMA_PORT ollama pull deepseek-r1 2>&1; then
      echo "Модель deepseek-r1 успешно загружена!"
      break
    fi
  fi
  
  RETRY=$((RETRY + 1))
  if [ $RETRY -lt $MAX_RETRIES ]; then
    echo "Попытка $RETRY не удалась. Повтор через 5 секунд..."
    sleep 5
  else
    echo "Ошибка: не удалось загрузить модель deepseek-r1 после $MAX_RETRIES попыток"
    exit 1
  fi
done

# Проверяем, что модель загружена через API
echo "Проверка наличия модели..."
if command -v curl > /dev/null 2>&1; then
  MODELS=$(curl -s http://$OLLAMA_HOST:$OLLAMA_PORT/api/tags)
  if echo "$MODELS" | grep -q "deepseek-r1"; then
    echo "Модель deepseek-r1 подтверждена в списке моделей"
  else
    echo "Предупреждение: модель не найдена в списке"
  fi
elif command -v wget > /dev/null 2>&1; then
  MODELS=$(wget -q -O- http://$OLLAMA_HOST:$OLLAMA_PORT/api/tags)
  if echo "$MODELS" | grep -q "deepseek-r1"; then
    echo "Модель deepseek-r1 подтверждена в списке моделей"
  else
    echo "Предупреждение: модель не найдена в списке"
  fi
fi

echo "Инициализация Ollama завершена успешно!"

