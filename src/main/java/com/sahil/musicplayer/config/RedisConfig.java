package com.sahil.musicplayer.config;

import io.github.bucket4j.Bandwidth;
import io.github.bucket4j.Bucket;
import io.github.bucket4j.Refill;
import org.springframework.cache.CacheManager;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.cache.RedisCacheConfiguration;
import org.springframework.data.redis.cache.RedisCacheManager;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.serializer.GenericJackson2JsonRedisSerializer;
import org.springframework.data.redis.serializer.RedisSerializationContext;
import org.springframework.data.redis.serializer.StringRedisSerializer;

import java.time.Duration;
import java.util.concurrent.ConcurrentHashMap;

@Configuration
@EnableCaching
public class RedisConfig {

    @Bean
    public RedisTemplate<String, Object> redisTemplate(RedisConnectionFactory connectionFactory) {
        RedisTemplate<String, Object> template = new RedisTemplate<>();
        template.setConnectionFactory(connectionFactory);
        template.setKeySerializer(new StringRedisSerializer());
        template.setValueSerializer(new StringRedisSerializer());
        return template;
    }

    @Bean
    public ConcurrentHashMap<String, Bucket> bucketCache() {
        return new ConcurrentHashMap<>();
    }

    @Bean
    public CacheManager cacheManager(RedisConnectionFactory connectionFactory) {
        RedisCacheConfiguration config = RedisCacheConfiguration.defaultCacheConfig()
                .entryTtl(Duration.ofMinutes(60)) // Default TTL of 60 minutes
                .serializeKeysWith(
                        RedisSerializationContext.SerializationPair.fromSerializer(new StringRedisSerializer()))
                .serializeValuesWith(RedisSerializationContext.SerializationPair
                        .fromSerializer(new GenericJackson2JsonRedisSerializer()))
                .disableCachingNullValues();

        return RedisCacheManager.builder(connectionFactory)
                .cacheDefaults(config)
                .withCacheConfiguration("songs",
                        RedisCacheConfiguration.defaultCacheConfig()
                                .entryTtl(Duration.ofMinutes(30)))
                .withCacheConfiguration("song",
                        RedisCacheConfiguration.defaultCacheConfig()
                                .entryTtl(Duration.ofMinutes(15)))
                .withCacheConfiguration("user",
                        RedisCacheConfiguration.defaultCacheConfig()
                                .entryTtl(Duration.ofMinutes(45)))
                .build();
    }

    // Rate limiting configurations
    public static class RateLimit {
        // Authentication endpoints - more restrictive
        public static final Bandwidth AUTH_BANDWIDTH = Bandwidth.classic(5,
                Refill.intervally(5, Duration.ofMinutes(1)));

        // Song upload - very restrictive for admins
        public static final Bandwidth UPLOAD_BANDWIDTH = Bandwidth.classic(3,
                Refill.intervally(3, Duration.ofMinutes(5)));

        // General API endpoints
        public static final Bandwidth GENERAL_BANDWIDTH = Bandwidth.classic(100,
                Refill.intervally(100, Duration.ofMinutes(1)));

        // Admin operations
        public static final Bandwidth ADMIN_BANDWIDTH = Bandwidth.classic(50,
                Refill.intervally(50, Duration.ofMinutes(1)));
    }
}
