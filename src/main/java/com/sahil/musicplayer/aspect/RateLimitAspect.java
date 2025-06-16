package com.sahil.musicplayer.aspect;

import com.sahil.musicplayer.annotation.RateLimit;
import com.sahil.musicplayer.service.RateLimitService;
import io.github.bucket4j.Bandwidth;
import io.github.bucket4j.Refill;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import java.time.Duration;

@Aspect
@Component
@RequiredArgsConstructor
@Slf4j
public class RateLimitAspect {

    private final RateLimitService rateLimitService;

    @Around("@annotation(rateLimit)")
    public Object around(ProceedingJoinPoint joinPoint, RateLimit rateLimit) throws Throwable {
        HttpServletRequest request = ((ServletRequestAttributes) RequestContextHolder.currentRequestAttributes())
                .getRequest();

        String clientId = getClientIdentifier(request);
        String rateLimitKey = rateLimit.key().isEmpty() ? clientId + ":" + joinPoint.getSignature().getName()
                : clientId + ":" + rateLimit.key();

        Bandwidth bandwidth = Bandwidth.classic(rateLimit.requests(),
                Refill.intervally(rateLimit.requests(), Duration.ofSeconds(rateLimit.windowSeconds())));

        if (!rateLimitService.isAllowed(rateLimitKey, bandwidth)) {
            log.warn("Rate limit exceeded for method: {} by client: {}", joinPoint.getSignature().getName(), clientId);
            return ResponseEntity.status(HttpStatus.TOO_MANY_REQUESTS)
                    .body("Rate limit exceeded. Please try again later.");
        }

        return joinPoint.proceed();
    }

    private String getClientIdentifier(HttpServletRequest request) {
        String authHeader = request.getHeader("Authorization");
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            return "user:" + authHeader.substring(7, Math.min(authHeader.length(), 20));
        }
        return "ip:" + request.getRemoteAddr();
    }
}