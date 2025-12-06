package com.example.agentestimator.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
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

    @Schema(description = "Ориентировочная стоимость проекта в рублях (если ответ содержит оценку)", example = "100000")
    private Integer price;

    @Schema(description = "Структурированная оценка проекта (если ответ содержит JSON с оценкой)")
    private EstimationResponse estimation;
}

