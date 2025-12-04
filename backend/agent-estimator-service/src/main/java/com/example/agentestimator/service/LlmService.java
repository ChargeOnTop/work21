package com.example.agentestimator.service;

import com.example.agentestimator.dto.ChatMessage;
import com.example.agentestimator.dto.ChatRequest;
import com.example.agentestimator.dto.ChatResponse;
import com.example.agentestimator.dto.SimpleChatRequest;
import com.example.agentestimator.dto.SimpleChatResponse;

import java.util.List;

public interface LlmService {

    /**
     * Отправляет полный запрос к LLM с несколькими сообщениями
     *
     * @param request запрос с моделью и сообщениями
     * @return ответ от LLM
     */
    ChatResponse chat(ChatRequest request);

    /**
     * Отправляет простой запрос к LLM
     *
     * @param request упрощённый запрос с промптом
     * @return упрощённый ответ от LLM
     */
    SimpleChatResponse simpleChat(SimpleChatRequest request);

    /**
     * Создаёт запрос к чату с одним пользовательским сообщением
     *
     * @param model название модели
     * @param userMessage сообщение пользователя
     * @return объект запроса
     */
    default ChatRequest createSimpleRequest(String model, String userMessage) {
        return ChatRequest.builder()
                .model(model)
                .messages(List.of(
                        ChatMessage.builder()
                                .role("user")
                                .content(userMessage)
                                .build()
                ))
                .stream(false)
                .build();
    }
}

