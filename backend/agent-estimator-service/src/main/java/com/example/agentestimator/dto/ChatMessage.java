package com.example.agentestimator.dto;

import com.fasterxml.jackson.annotation.JsonSetter;
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
@Schema(description = "Сообщение чата")
public class ChatMessage {

    @Schema(description = "Роль отправителя сообщения", example = "user", allowableValues = {"system", "user", "assistant"})
    @NotBlank(message = "Роль не может быть пустой")
    private String role;

    @Schema(description = "Содержимое сообщения", example = "Сколько будет 2+2?")
    @NotBlank(message = "Содержимое сообщения не может быть пустым")
    private String content;

    /**
     * Кастомный сеттер для автоматического приведения content к строке.
     * Принимает любое значение (String, Number, Object и т.д.) и преобразует его в строку.
     * Используется при десериализации JSON через Jackson.
     * Lombok Builder будет использовать этот сеттер через рефлексию или приведение типов.
     */
    @JsonSetter("content")
    public void setContent(Object contentValue) {
        if (contentValue == null) {
            this.content = null;
        } else if (contentValue instanceof String) {
            this.content = (String) contentValue;
        } else {
            // Приводим любое значение к строке (числа, объекты, массивы и т.д.)
            this.content = String.valueOf(contentValue);
        }
    }
}

