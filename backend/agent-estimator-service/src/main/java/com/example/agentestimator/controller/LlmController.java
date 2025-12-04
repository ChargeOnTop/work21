package com.example.agentestimator.controller;

import com.example.agentestimator.dto.ChatRequest;
import com.example.agentestimator.dto.ChatResponse;
import com.example.agentestimator.dto.SimpleChatRequest;
import com.example.agentestimator.dto.SimpleChatResponse;
import com.example.agentestimator.service.LlmService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/llm")
@RequiredArgsConstructor
@Tag(name = "LLM API", description = "API для взаимодействия с локальной LLM (Ollama)")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:8000"}, maxAge = 3600)
public class LlmController {

    private final LlmService llmService;

    @Operation(
            summary = "Отправить сообщение в чат",
            description = "Отправляет полный запрос к LLM модели с историей сообщений"
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Успешный ответ от модели",
                    content = @Content(schema = @Schema(implementation = ChatResponse.class))
            ),
            @ApiResponse(
                    responseCode = "400",
                    description = "Некорректный запрос"
            ),
            @ApiResponse(
                    responseCode = "500",
                    description = "Ошибка сервера или недоступность LLM"
            )
    })
    @PostMapping("/chat")
    public ResponseEntity<ChatResponse> chat(@Valid @RequestBody ChatRequest request) {
        ChatResponse response = llmService.chat(request);
        return ResponseEntity.ok(response);
    }

    @Operation(
            summary = "Простой запрос к LLM",
            description = "Упрощённый API для отправки одного промпта к модели"
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Успешный ответ от модели",
                    content = @Content(schema = @Schema(implementation = SimpleChatResponse.class))
            ),
            @ApiResponse(
                    responseCode = "400",
                    description = "Некорректный запрос"
            )
    })
    @PostMapping("/ask")
    public ResponseEntity<SimpleChatResponse> ask(@Valid @RequestBody SimpleChatRequest request) {
        SimpleChatResponse response = llmService.simpleChat(request);
        return ResponseEntity.ok(response);
    }
}

