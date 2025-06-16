package com.sahil.musicplayer.controllers;

import com.mongodb.client.model.Filters;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/health")
@RequiredArgsConstructor
public class HealthController {

    private final RedisConnectionFactory redisConnectionFactory;
    private final MongoTemplate mongoTemplate;

    @GetMapping
    public ResponseEntity<Map<String, String>> healthCheck() {
        Map<String, String> healthStatus = new HashMap<>();

        // Check Redis
        try {
            redisConnectionFactory.getConnection().ping();
            healthStatus.put("redis", "UP");
        } catch (Exception e) {
            healthStatus.put("redis", "DOWN");
        }

        // Check MongoDB
        try {
            mongoTemplate.getDb().runCommand(Filters.eq("ping", 1));
            healthStatus.put("mongodb", "UP");
        } catch (Exception e) {
            healthStatus.put("mongodb", "DOWN");
        }

        // Check application
        healthStatus.put("application", "UP");

        return ResponseEntity.ok(healthStatus);
    }
}