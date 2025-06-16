package com.sahil.musicplayer.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.sahil.musicplayer.dto.ApiErrorResponse;
import com.sahil.musicplayer.service.RateLimitService;
import io.github.bucket4j.Bandwidth;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.annotation.Order;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.time.LocalDateTime;

@Component
@Order(1)
@RequiredArgsConstructor
@Slf4j
public class RateLimitFilter extends OncePerRequestFilter {

    private final RateLimitService rateLimitService;
    private final ObjectMapper objectMapper;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response,
            FilterChain filterChain) throws ServletException, IOException {

        String clientId = getClientIdentifier(request);
        String requestPath = request.getRequestURI();

        Bandwidth bandwidth = getBandwidthForPath(requestPath);
        String rateLimitKey = clientId + ":" + getRateLimitCategory(requestPath);

        if (!rateLimitService.isAllowed(rateLimitKey, bandwidth)) {
            long waitTime = rateLimitService.getWaitTime(rateLimitKey, bandwidth);
            handleRateLimitExceeded(response, waitTime);
            return;
        }

        filterChain.doFilter(request, response);
    }

    private String getClientIdentifier(HttpServletRequest request) {
        // Try to get user from JWT token first
        String authHeader = request.getHeader("Authorization");
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            // Extract username from JWT token (simplified)
            // In real implementation, you might want to decode the JWT
            return "user:" + authHeader.substring(7, Math.min(authHeader.length(), 20));
        }

        // Fallback to IP address
        String xForwardedFor = request.getHeader("X-Forwarded-For");
        if (xForwardedFor != null && !xForwardedFor.isEmpty()) {
            return "ip:" + xForwardedFor.split(",")[0].trim();
        }

        return "ip:" + request.getRemoteAddr();
    }

    private Bandwidth getBandwidthForPath(String path) {
        if (path.startsWith("/api/auth/")) {
            return RedisConfig.RateLimit.AUTH_BANDWIDTH;
        } else if (path.contains("/upload")) {
            return RedisConfig.RateLimit.UPLOAD_BANDWIDTH;
        } else if (path.startsWith("/api/admin/")) {
            return RedisConfig.RateLimit.ADMIN_BANDWIDTH;
        } else {
            return RedisConfig.RateLimit.GENERAL_BANDWIDTH;
        }
    }

    private String getRateLimitCategory(String path) {
        if (path.startsWith("/api/auth/")) {
            return "auth";
        } else if (path.contains("/upload")) {
            return "upload";
        } else if (path.startsWith("/api/admin/")) {
            return "admin";
        } else {
            return "general";
        }
    }

    private void handleRateLimitExceeded(HttpServletResponse response, long waitTime) throws IOException {
        response.setStatus(HttpStatus.TOO_MANY_REQUESTS.value());
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
        response.setHeader("Retry-After", String.valueOf(waitTime));
        response.setHeader("X-RateLimit-Limit", "Rate limit exceeded");
        response.setHeader("X-RateLimit-Remaining", "0");
        response.setHeader("X-RateLimit-Reset", String.valueOf(System.currentTimeMillis() + (waitTime * 1000)));

        ApiErrorResponse errorResponse = ApiErrorResponse.builder()
                .success(false)
                .error("RATE_LIMIT_EXCEEDED")
                .message("Rate limit exceeded. Please try again after " + waitTime + " seconds.")
                .timestamp(LocalDateTime.now())
                .build();

        response.getWriter().write(objectMapper.writeValueAsString(errorResponse));
    }
}