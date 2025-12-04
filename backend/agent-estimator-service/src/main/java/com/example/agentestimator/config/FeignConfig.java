package com.example.agentestimator.config;

import feign.Logger;
import feign.Request;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.concurrent.TimeUnit;

@Configuration
public class FeignConfig {

    /**
     * Настройка таймаутов для Feign клиента
     * LLM может долго генерировать ответ, поэтому увеличиваем таймауты
     */
    @Bean
    public Request.Options requestOptions() {
        return new Request.Options(
                10, TimeUnit.SECONDS,   // connectTimeout
                120, TimeUnit.SECONDS,  // readTimeout - увеличен для долгих запросов к LLM
                true                     // followRedirects
        );
    }

    /**
     * Уровень логирования Feign клиента
     */
    @Bean
    public Logger.Level feignLoggerLevel() {
        return Logger.Level.BASIC;
    }
}

