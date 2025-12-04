package com.example.agentestimator.client;

import com.example.agentestimator.dto.ChatRequest;
import com.example.agentestimator.dto.ChatResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@FeignClient(
        name = "ollama-client",
        url = "${ollama.api.url:http://localhost:11434}"
)
public interface OllamaClient {

    @PostMapping("/api/chat")
    ChatResponse chat(@RequestBody ChatRequest request);
}

