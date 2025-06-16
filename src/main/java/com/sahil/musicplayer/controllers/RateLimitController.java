package com.sahil.musicplayer.controllers;

import com.sahil.musicplayer.service.RateLimitService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/rate-limit")
@PreAuthorize("hasRole('ADMIN')")
@RequiredArgsConstructor
public class RateLimitController {

    private final RateLimitService rateLimitService;

    @PostMapping("/reset/{identifier}")
    public ResponseEntity<String> resetRateLimit(@PathVariable String identifier) {
        rateLimitService.resetLimit(identifier);
        return ResponseEntity.ok("Rate limit reset for: " + identifier);
    }
}