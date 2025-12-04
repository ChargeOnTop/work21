package com.example.agentestimator;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.openfeign.EnableFeignClients;

@SpringBootApplication
@EnableFeignClients
public class AgentEstimatorApplication {

    public static void main(String[] args) {
        SpringApplication.run(AgentEstimatorApplication.class, args);
    }
}

