package com.sahil.musicplayer.service;

import io.github.bucket4j.Bandwidth;
import io.github.bucket4j.Bucket;
import io.github.bucket4j.ConsumptionProbe;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.util.concurrent.ConcurrentHashMap;

@Service
@RequiredArgsConstructor
@Slf4j
public class RateLimitService {

    private final RedisTemplate<String, Object> redisTemplate;
    private final ConcurrentHashMap<String, Bucket> bucketCache;

    public boolean isAllowed(String key, Bandwidth bandwidth) {
        Bucket bucket = bucketCache.computeIfAbsent(key, k -> createBucket(bandwidth));
        ConsumptionProbe probe = bucket.tryConsumeAndReturnRemaining(1);

        if (probe.isConsumed()) {
            log.debug("Rate limit check passed for key: {}, remaining tokens: {}", key, probe.getRemainingTokens());
            return true;
        } else {
            log.warn("Rate limit exceeded for key: {}, retry after: {} seconds",
                    key, probe.getNanosToWaitForRefill() / 1_000_000_000);
            return false;
        }
    }

    public long getWaitTime(String key, Bandwidth bandwidth) {
        Bucket bucket = bucketCache.computeIfAbsent(key, k -> createBucket(bandwidth));
        ConsumptionProbe probe = bucket.tryConsumeAndReturnRemaining(1);
        return probe.getNanosToWaitForRefill() / 1_000_000_000; // Convert to seconds
    }

    private Bucket createBucket(Bandwidth bandwidth) {
        return Bucket.builder()
                .addLimit(bandwidth)
                .build();
    }

    public void resetLimit(String key) {
        bucketCache.remove(key);
        log.info("Rate limit reset for key: {}", key);
    }
}