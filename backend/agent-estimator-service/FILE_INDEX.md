# Agent Estimator Service - File Index

## Описание проекта

Микросервис на Spring Boot для взаимодействия с локальным LLM (Ollama). Использует Feign для HTTP-клиента и предоставляет REST API с OpenAPI документацией.

## Структура проекта

```
agent-estimator-service/
├── pom.xml                           # Maven конфигурация с зависимостями
├── FILE_INDEX.md                     # Индекс файлов проекта (этот файл)
├── README.md                         # Документация проекта
└── src/
    └── main/
        ├── java/com/example/agentestimator/
        │   ├── AgentEstimatorApplication.java    # Точка входа приложения
        │   ├── client/
        │   │   └── OllamaClient.java             # Feign клиент для Ollama API
        │   ├── config/
        │   │   ├── FeignConfig.java              # Конфигурация Feign (таймауты)
        │   │   └── OpenApiConfig.java            # Конфигурация OpenAPI/Swagger
        │   ├── controller/
        │   │   └── LlmController.java            # REST контроллер
        │   ├── dto/
        │   │   ├── ChatMessage.java              # DTO сообщения чата
        │   │   ├── ChatRequest.java              # DTO запроса к Ollama
        │   │   ├── ChatResponse.java             # DTO ответа от Ollama
        │   │   ├── SimpleChatRequest.java        # Упрощённый запрос
        │   │   └── SimpleChatResponse.java       # Упрощённый ответ
        │   ├── exception/
        │   │   └── GlobalExceptionHandler.java   # Глобальный обработчик ошибок
        │   └── service/
        │       ├── LlmService.java               # Интерфейс сервиса
        │       └── impl/
        │           └── LlmServiceImpl.java       # Реализация сервиса
        └── resources/
            └── application.yml                   # Конфигурация приложения
```

## Технологический стек

- **Java 17**
- **Spring Boot 3.2.0**
- **Spring Cloud OpenFeign** - HTTP клиент для Ollama API
- **Lombok** - генерация boilerplate кода
- **SpringDoc OpenAPI** - документация API (Swagger UI)
- **Jakarta Validation** - валидация входных данных

## API Endpoints

| Метод | Путь | Описание |
|-------|------|----------|
| POST | `/api/v1/llm/chat` | Полный запрос к LLM с историей сообщений |
| POST | `/api/v1/llm/ask` | Упрощённый запрос с одним промптом |

## Конфигурация

### Основные параметры (application.yml)

| Параметр | Значение по умолчанию | Описание |
|----------|----------------------|----------|
| `server.port` | 8080 | Порт приложения |
| `ollama.api.url` | http://localhost:11434 | URL Ollama API |
| `ollama.default-model` | deepseek-r1 | Модель по умолчанию |
| `ollama.system-prompt` | (см. application.yml) | Системный промпт по умолчанию |

## Ссылки

- **Swagger UI**: http://localhost:8080/swagger-ui.html
- **OpenAPI JSON**: http://localhost:8080/api-docs

