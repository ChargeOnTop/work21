package com.example.agentestimator.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Упрощённый ответ от LLM")
public class SimpleChatResponse {

    @Schema(description = "Название модели", example = "deepseek-r1")
    private String model;

    @Schema(description = "Ответ от модели", example = "2+2 равно 4")
    private String response;

    @Schema(description = "Флаг успешности")
    private Boolean success;

    @Schema(description = "Сообщение об ошибке (если есть)")
    private String error;
}

