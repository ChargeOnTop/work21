# Agent Estimator Service

Микросервис на Java для взаимодействия с локальным LLM (Ollama).

## Требования

- Java 17+
- Maven 3.8+
- Ollama (запущенный на localhost:11434)

## Быстрый старт

### 1. Установите и запустите Ollama

```bash
# Скачайте Ollama с https://ollama.ai
# Запустите и загрузите модель
ollama pull deepseek-r1
ollama serve
```

### 2. Соберите и запустите сервис

```bash
# Сборка проекта
mvn clean package

# Запуск
java -jar target/agent-estimator-service-1.0.0-SNAPSHOT.jar

# Или запуск через Maven
mvn spring-boot:run
```

### 3. Откройте Swagger UI

После запуска откройте в браузере: http://localhost:8080/swagger-ui.html

## Примеры использования

### Простой запрос

```bash
curl -X POST http://localhost:8080/api/v1/llm/ask \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "Сколько будет 2+2?"
  }'
```

**Ответ:**
```json
{
  "model": "deepseek-r1",
  "response": "2+2 равно 4",
  "success": true
}
```

### Полный запрос с историей чата

```bash
curl -X POST http://localhost:8080/api/v1/llm/chat \
  -H "Content-Type: application/json" \
  -d '{
    "model": "deepseek-r1",
    "messages": [
      {"role": "system", "content": "Ты полезный ассистент"},
      {"role": "user", "content": "Сколько будет 2+2?"}
    ]
  }'
```

## Конфигурация

Настройки можно изменить через переменные окружения или `application.yml`:

| Переменная | Описание | По умолчанию |
|-----------|----------|--------------|
| `SERVER_PORT` | Порт сервиса | 8080 |
| `OLLAMA_API_URL` | URL Ollama API | http://localhost:11434 |
| `OLLAMA_DEFAULT_MODEL` | Модель по умолчанию | deepseek-r1 |

## API документация

- **Swagger UI**: http://localhost:8080/swagger-ui.html
- **OpenAPI JSON**: http://localhost:8080/api-docs

## Структура проекта

См. [FILE_INDEX.md](FILE_INDEX.md) для подробного описания структуры проекта.

