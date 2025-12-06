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
@Schema(description = "Ответ с оценкой времени и бюджета проекта")
public class EstimationResponse {

    @Schema(description = "Ориентировочная стоимость проекта в рублях", example = "100000")
    @JsonProperty("price")
    private Integer price;

    @Schema(description = "Текстовая информация с оценкой времени и разбиением по задачам", 
            example = "Оптимистичная: 40 часов, Пессимистичная: 80 часов\n\nЗадачи:\n1. Анализ требований (6ч)\n2. Разработка (45ч)...")
    @JsonProperty("data")
    private String data;
}

