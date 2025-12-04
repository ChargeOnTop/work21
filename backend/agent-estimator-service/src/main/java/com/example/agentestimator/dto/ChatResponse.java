package com.example.agentestimator.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Ответ от LLM модели")
public class ChatResponse {

    @Schema(description = "Название модели")
    private String model;

    @Schema(description = "Время создания ответа")
    @JsonProperty("created_at")
    private String createdAt;

    @Schema(description = "Сообщение от ассистента")
    private ChatMessage message;

    @Schema(description = "Флаг завершения генерации")
    private Boolean done;

    @Schema(description = "Общая продолжительность генерации (наносекунды)")
    @JsonProperty("total_duration")
    private Long totalDuration;

    @Schema(description = "Время загрузки модели (наносекунды)")
    @JsonProperty("load_duration")
    private Long loadDuration;

    @Schema(description = "Количество токенов в промпте")
    @JsonProperty("prompt_eval_count")
    private Integer promptEvalCount;

    @Schema(description = "Время обработки промпта (наносекунды)")
    @JsonProperty("prompt_eval_duration")
    private Long promptEvalDuration;

    @Schema(description = "Количество сгенерированных токенов")
    @JsonProperty("eval_count")
    private Integer evalCount;

    @Schema(description = "Время генерации ответа (наносекунды)")
    @JsonProperty("eval_duration")
    private Long evalDuration;
}

