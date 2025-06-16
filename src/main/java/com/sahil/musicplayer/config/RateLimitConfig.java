package com.sahil.musicplayer.config;

import io.github.bucket4j.Bandwidth;
import io.github.bucket4j.Bucket;
import io.github.bucket4j.Bucket4j;
import io.github.bucket4j.Refill;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.time.Duration;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Configuration
public class RateLimitConfig {

    private final Map<String, Bucket> buckets = new ConcurrentHashMap<>();

    @Bean
    public Map<String, Bucket> rateLimitBuckets() {
        // Default rate limit: 100 requests per minute
        Bandwidth defaultLimit = Bandwidth.simple(100, Duration.ofMinutes(1));

        // Create buckets for different endpoints
        buckets.put("default", createNewBucket(defaultLimit));
        buckets.put("upload", createNewBucket(Bandwidth.simple(10, Duration.ofMinutes(1)))); // 10 uploads per minute
        buckets.put("search", createNewBucket(Bandwidth.simple(60, Duration.ofMinutes(1)))); // 60 searches per minute

        return buckets;
    }

    private Bucket createNewBucket(Bandwidth limit) {
        return Bucket4j.builder()
                .addLimit(limit)
                .build();
    }
}