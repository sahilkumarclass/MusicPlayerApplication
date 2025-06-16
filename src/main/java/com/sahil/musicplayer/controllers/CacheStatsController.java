package com.sahil.musicplayer.controllers;

import lombok.RequiredArgsConstructor;
import org.springframework.cache.CacheManager;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/cache")
@PreAuthorize("hasRole('ADMIN')")
@RequiredArgsConstructor
public class CacheStatsController {

    private final CacheManager cacheManager;
    private final RedisConnectionFactory redisConnectionFactory;

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getCacheStats() {
        Map<String, Object> stats = new HashMap<>();

        // Redis stats
        try {
            Map<String, Object> redisStats = new HashMap<>();
            redisStats.put("usedMemory", redisConnectionFactory.getConnection().info("memory").get("used_memory"));
            redisStats.put("connectedClients",
                    redisConnectionFactory.getConnection().info("clients").get("connected_clients"));
            redisStats.put("totalKeys", redisConnectionFactory.getConnection().dbSize());
            stats.put("redis", redisStats);
        } catch (Exception e) {
            stats.put("redis", "Error fetching Redis stats: " + e.getMessage());
        }

        // Cache stats
        try {
            Map<String, Object> cacheStats = new HashMap<>();
            cacheManager.getCacheNames().forEach(name -> {
                cacheStats.put(name, "Cache exists");
            });
            stats.put("caches", cacheStats);
        } catch (Exception e) {
            stats.put("caches", "Error fetching cache stats: " + e.getMessage());
        }

        return ResponseEntity.ok(stats);
    }
}