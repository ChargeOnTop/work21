package com.example.agentestimator.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Упрощённый запрос к LLM")
public class SimpleChatRequest {

    @Schema(description = "Название модели", example = "deepseek-r1")
    private String model;

    @Schema(description = "Текст запроса пользователя", example = "Сколько будет 2+2?")
    @NotBlank(message = "Запрос не может быть пустым")
    private String prompt;

    @Schema(description = "Системный промпт (переопределяет настройки по умолчанию)", 
            example = "Ты эксперт по программированию")
    private String systemPrompt;
}

