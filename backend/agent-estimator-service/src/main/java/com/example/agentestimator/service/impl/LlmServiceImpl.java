package com.example.agentestimator.service.impl;

import com.example.agentestimator.client.OllamaClient;
import com.example.agentestimator.dto.ChatMessage;
import com.example.agentestimator.dto.ChatRequest;
import com.example.agentestimator.dto.ChatResponse;
import com.example.agentestimator.dto.SimpleChatRequest;
import com.example.agentestimator.dto.SimpleChatResponse;
import com.example.agentestimator.service.LlmService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.util.ArrayList;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
@RequiredArgsConstructor
@Slf4j
public class LlmServiceImpl implements LlmService {

    private final OllamaClient ollamaClient;

    @Value("${ollama.default-model:deepseek-r1}")
    private String defaultModel;

    @Value("${ollama.system-prompt:}")
    private String defaultSystemPrompt;

    @Value("${ollama.temperature:0.3}")
    private Double defaultTemperature;

    @Value("${ollama.topP:0.9}")
    private Double defaultTopP;

    @Value("${ollama.topK:40}")
    private Integer defaultTopK;

    @Value("${ollama.repeat-penalty:1.1}")
    private Double defaultRepeatPenalty;

    @Value("${ollama.num-predict:512}")
    private Integer defaultNumPredict;

    @Value("${ollama.seed:#{null}}")
    private Long defaultSeed;

    @Value("${ollama.stop:#{null}}")
    private List<String> defaultStop;

    @Override
    public ChatResponse chat(ChatRequest request) {
        log.info("Отправка запроса к модели: {}, количество сообщений: {}",
                request.getModel(), request.getMessages().size());

        // Устанавливаем stream=false для получения полного ответа
        request.setStream(false);

        // Добавляем системный промпт из конфигурации, если он задан
        ChatRequest enrichedRequest = enrichWithSystemPrompt(request);

        // Применяем параметры стабильности по умолчанию
        enrichedRequest = applyStabilityParameters(enrichedRequest);

        ChatResponse response = ollamaClient.chat(enrichedRequest);

        log.info("Получен ответ от модели: {}, статус: {}",
                response.getModel(), response.getDone());

        return response;
    }

    @Override
    public SimpleChatResponse simpleChat(SimpleChatRequest request) {
        try {
            String model = request.getModel() != null ? request.getModel() : defaultModel;
            
            // Объединяем системный промпт из запроса с системным промптом из конфигурации
            String systemPrompt = combineSystemPrompts(request.getSystemPrompt(), defaultSystemPrompt);

            log.info("Простой запрос к модели: {}, системный промпт: {}, промпт: {}",
                    model, 
                    StringUtils.hasText(systemPrompt) ? "задан" : "отсутствует",
                    truncateForLog(request.getPrompt()));

            // Выполняем 3 запроса к ИИ для получения более стабильной оценки
            List<EstimationPair> estimations = new ArrayList<>();
            for (int i = 1; i <= 3; i++) {
                log.debug("Выполнение запроса {} из 3", i);
                ChatRequest chatRequest = createRequestWithSystemPrompt(model, systemPrompt, request.getPrompt());
                chatRequest.setStream(false);
                chatRequest = applyStabilityParameters(chatRequest);
                
                ChatResponse chatResponse = ollamaClient.chat(chatRequest);
                String responseContent = chatResponse.getMessage() != null
                        ? chatResponse.getMessage().getContent()
                        : null;
                
                if (responseContent != null) {
                    EstimationPair pair = parseEstimations(responseContent);
                    if (pair != null) {
                        estimations.add(pair);
                        log.debug("Запрос {}: оптимистичная={}, пессимистичная={}", 
                                i, pair.getOptimistic(), pair.getPessimistic());
                    } else {
                        log.warn("Не удалось распарсить ответ из запроса {}: {}", i, responseContent);
                    }
                }
            }

            if (estimations.isEmpty()) {
                log.error("Не удалось получить ни одной валидной оценки из 3 запросов");
                return SimpleChatResponse.builder()
                        .success(false)
                        .error("Не удалось получить валидные оценки от модели")
                        .build();
            }

            // Вычисляем средние значения
            double avgOptimistic = estimations.stream()
                    .mapToDouble(EstimationPair::getOptimistic)
                    .average()
                    .orElse(0.0);
            
            double avgPessimistic = estimations.stream()
                    .mapToDouble(EstimationPair::getPessimistic)
                    .average()
                    .orElse(0.0);

            // Округляем до целых чисел
            int optimisticRounded = (int) Math.round(avgOptimistic);
            int pessimisticRounded = (int) Math.round(avgPessimistic);

            String finalResponse = optimisticRounded + " " + pessimisticRounded;
            
            log.info("Средние оценки по {} запросам: оптимистичная={}, пессимистичная={}", 
                    estimations.size(), optimisticRounded, pessimisticRounded);

            return SimpleChatResponse.builder()
                    .model(model)
                    .response(finalResponse)
                    .success(true)
                    .build();

        } catch (Exception e) {
            log.error("Ошибка при обработке запроса: {}", e.getMessage(), e);
            return SimpleChatResponse.builder()
                    .success(false)
                    .error(e.getMessage())
                    .build();
        }
    }

    /**
     * Применяет параметры стабильности по умолчанию к запросу
     */
    private ChatRequest applyStabilityParameters(ChatRequest request) {
        ChatRequest.ChatRequestBuilder builder = ChatRequest.builder()
                .model(request.getModel())
                .messages(request.getMessages())
                .stream(request.getStream());

        // Применяем параметры только если они не заданы в запросе
        if (request.getTemperature() == null && defaultTemperature != null) {
            builder.temperature(defaultTemperature);
        } else {
            builder.temperature(request.getTemperature());
        }

        if (request.getTopP() == null && defaultTopP != null) {
            builder.topP(defaultTopP);
        } else {
            builder.topP(request.getTopP());
        }

        if (request.getTopK() == null && defaultTopK != null) {
            builder.topK(defaultTopK);
        } else {
            builder.topK(request.getTopK());
        }

        if (request.getRepeatPenalty() == null && defaultRepeatPenalty != null) {
            builder.repeatPenalty(defaultRepeatPenalty);
        } else {
            builder.repeatPenalty(request.getRepeatPenalty());
        }

        if (request.getNumPredict() == null && defaultNumPredict != null) {
            builder.numPredict(defaultNumPredict);
        } else {
            builder.numPredict(request.getNumPredict());
        }

        if (request.getSeed() == null && defaultSeed != null) {
            builder.seed(defaultSeed);
        } else {
            builder.seed(request.getSeed());
        }

        if ((request.getStop() == null || request.getStop().isEmpty()) && defaultStop != null && !defaultStop.isEmpty()) {
            builder.stop(defaultStop);
        } else if (request.getStop() != null && !request.getStop().isEmpty()) {
            builder.stop(request.getStop());
        }

        return builder.build();
    }

    /**
     * Обогащает запрос системным промптом из конфигурации
     */
    private ChatRequest enrichWithSystemPrompt(ChatRequest request) {
        if (!StringUtils.hasText(defaultSystemPrompt)) {
            return request;
        }

        List<ChatMessage> messages = new ArrayList<>(request.getMessages());
        
        // Проверяем, есть ли уже системное сообщение в запросе
        boolean hasSystemMessage = messages.stream()
                .anyMatch(msg -> "system".equals(msg.getRole()));
        
        if (hasSystemMessage) {
            // Если есть системное сообщение, объединяем промпты
            ChatMessage existingSystemMessage = messages.stream()
                    .filter(msg -> "system".equals(msg.getRole()))
                    .findFirst()
                    .orElse(null);
            
            if (existingSystemMessage != null) {
                // Объединяем системные промпты: сначала из конфигурации, затем из запроса
                String combinedPrompt = combineSystemPrompts(
                        existingSystemMessage.getContent(), 
                        defaultSystemPrompt
                );
                existingSystemMessage.setContent(combinedPrompt);
            }
        } else {
            // Если системного сообщения нет, добавляем системный промпт из конфигурации
            messages.add(0, ChatMessage.builder()
                    .role("system")
                    .content(defaultSystemPrompt)
                    .build());
        }
        
        ChatRequest.ChatRequestBuilder builder = ChatRequest.builder()
                .model(request.getModel())
                .messages(messages)
                .stream(request.getStream());

        // Сохраняем параметры стабильности из исходного запроса
        if (request.getTemperature() != null) {
            builder.temperature(request.getTemperature());
        }
        if (request.getTopP() != null) {
            builder.topP(request.getTopP());
        }
        if (request.getTopK() != null) {
            builder.topK(request.getTopK());
        }
        if (request.getRepeatPenalty() != null) {
            builder.repeatPenalty(request.getRepeatPenalty());
        }
        if (request.getNumPredict() != null) {
            builder.numPredict(request.getNumPredict());
        }
        if (request.getSeed() != null) {
            builder.seed(request.getSeed());
        }
        if (request.getStop() != null && !request.getStop().isEmpty()) {
            builder.stop(request.getStop());
        }

        return builder.build();
    }

    /**
     * Объединяет системные промпты из запроса и конфигурации
     */
    private String combineSystemPrompts(String requestPrompt, String configPrompt) {
        if (!StringUtils.hasText(requestPrompt) && !StringUtils.hasText(configPrompt)) {
            return null;
        }
        if (!StringUtils.hasText(requestPrompt)) {
            return configPrompt;
        }
        if (!StringUtils.hasText(configPrompt)) {
            return requestPrompt;
        }
        // Объединяем промпты: сначала системный из конфигурации, затем из запроса
        return configPrompt + "\n\n" + requestPrompt;
    }

    /**
     * Создаёт запрос с системным промптом и пользовательским сообщением
     */
    private ChatRequest createRequestWithSystemPrompt(String model, String systemPrompt, String userMessage) {
        List<ChatMessage> messages = new ArrayList<>();
        
        // Добавляем системный промпт, если он задан
        if (StringUtils.hasText(systemPrompt)) {
            messages.add(ChatMessage.builder()
                    .role("system")
                    .content(systemPrompt)
                    .build());
        }
        
        // Добавляем сообщение пользователя
        messages.add(ChatMessage.builder()
                .role("user")
                .content(userMessage)
                .build());
        
        return ChatRequest.builder()
                .model(model)
                .messages(messages)
                .stream(false)
                .build();
    }

    private String truncateForLog(String text) {
        if (text == null) return null;
        return text.length() > 100 ? text.substring(0, 100) + "..." : text;
    }

    /**
     * Парсит ответ от ИИ и извлекает две цифры (оптимистичную и пессимистичную оценки)
     * 
     * @param response ответ от ИИ
     * @return пара оценок или null, если не удалось распарсить
     */
    private EstimationPair parseEstimations(String response) {
        if (response == null || response.trim().isEmpty()) {
            return null;
        }

        // Удаляем все лишние пробелы и переносы строк
        String cleaned = response.trim().replaceAll("\\s+", " ");
        
        // Паттерн для поиска двух чисел, разделенных пробелом
        // Ищем последовательность: число, пробел(ы), число
        Pattern pattern = Pattern.compile("(\\d+)\\s+(\\d+)");
        Matcher matcher = pattern.matcher(cleaned);
        
        if (matcher.find()) {
            try {
                int optimistic = Integer.parseInt(matcher.group(1));
                int pessimistic = Integer.parseInt(matcher.group(2));
                
                if (optimistic > 0 && pessimistic > 0 && optimistic <= pessimistic) {
                    return new EstimationPair(optimistic, pessimistic);
                } else {
                    log.warn("Некорректные значения оценок: optimistic={}, pessimistic={}", 
                            optimistic, pessimistic);
                }
            } catch (NumberFormatException e) {
                log.warn("Ошибка при парсинге чисел из ответа: {}", response);
            }
        } else {
            log.warn("Не найдены две цифры в ответе: {}", response);
        }
        
        return null;
    }

    /**
     * Вспомогательный класс для хранения пары оценок
     */
    private static class EstimationPair {
        private final int optimistic;
        private final int pessimistic;

        public EstimationPair(int optimistic, int pessimistic) {
            this.optimistic = optimistic;
            this.pessimistic = pessimistic;
        }

        public int getOptimistic() {
            return optimistic;
        }

        public int getPessimistic() {
            return pessimistic;
        }
    }
}

