package com.example.agentestimator.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Запрос к LLM модели")
public class ChatRequest {

    @Schema(description = "Название модели", example = "deepseek-r1")
    @NotBlank(message = "Название модели не может быть пустым")
    private String model;

    @Schema(description = "Список сообщений чата")
    @NotEmpty(message = "Список сообщений не может быть пустым")
    @Valid
    private List<ChatMessage> messages;

    @Schema(description = "Включить потоковую передачу ответа", example = "false")
    @Builder.Default
    private Boolean stream = false;

    @Schema(description = "Температура генерации (0.0-1.0). Низкие значения делают ответы более детерминированными", example = "0.3")
    private Double temperature;

    @Schema(description = "Top-p sampling (0.0-1.0). Контролирует разнообразие токенов", example = "0.9")
    @JsonProperty("top_p")
    private Double topP;

    @Schema(description = "Top-k sampling. Ограничивает выборку топ-K токенов для более предсказуемой генерации", example = "40")
    @JsonProperty("top_k")
    private Integer topK;

    @Schema(description = "Штраф за повторения (1.0-2.0). Значения >1.0 снижают вероятность повторения токенов", example = "1.1")
    @JsonProperty("repeat_penalty")
    private Double repeatPenalty;

    @Schema(description = "Seed для воспроизводимости результатов. Если не задан, используется случайный seed")
    private Long seed;

    @Schema(description = "Максимальное количество токенов для генерации. Ограничивает длину ответа")
    @JsonProperty("num_predict")
    private Integer numPredict;

    @Schema(description = "Список стоп-слов. Генерация остановится при встрече любого из этих слов")
    private List<String> stop;
}

