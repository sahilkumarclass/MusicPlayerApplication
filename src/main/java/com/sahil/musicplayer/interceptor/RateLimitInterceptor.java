package com.sahil.musicplayer.interceptor;

import io.github.bucket4j.Bucket;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

import java.util.Map;

@Component
@RequiredArgsConstructor
public class RateLimitInterceptor implements HandlerInterceptor {

    private final Map<String, Bucket> rateLimitBuckets;

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler)
            throws Exception {
        String bucketKey = getBucketKey(request);
        Bucket bucket = rateLimitBuckets.getOrDefault(bucketKey, rateLimitBuckets.get("default"));

        if (bucket.tryConsume(1)) {
            return true;
        }

        response.setStatus(HttpStatus.TOO_MANY_REQUESTS.value());
        response.getWriter().write("Rate limit exceeded. Please try again later.");
        return false;
    }

    private String getBucketKey(HttpServletRequest request) {
        String path = request.getRequestURI();
        if (path.contains("/upload")) {
            return "upload";
        } else if (path.contains("/search")) {
            return "search";
        }
        return "default";
    }
}