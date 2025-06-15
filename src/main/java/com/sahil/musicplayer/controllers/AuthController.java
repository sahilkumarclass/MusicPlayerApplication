package com.sahil.musicplayer.controllers;

import com.sahil.musicplayer.dto.ApiResponse;
import com.sahil.musicplayer.dto.AuthResponse;
import com.sahil.musicplayer.dto.LoginRequest;
import com.sahil.musicplayer.dto.RegisterRequest;
import com.sahil.musicplayer.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<AuthResponse>> register(@Valid @RequestBody RegisterRequest request) {
        AuthResponse response = authService.register(request);
        return ResponseEntity.ok(ApiResponse.<AuthResponse>builder()
                .success(true)
                .message("User registered successfully")
                .data(response)
                .build());
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthResponse>> authenticate(@Valid @RequestBody LoginRequest request) {
        AuthResponse response = authService.authenticate(request);
        return ResponseEntity.ok(ApiResponse.<AuthResponse>builder()
                .success(true)
                .message("Authentication successful")
                .data(response)
                .build());
    }

    @PostMapping("/create-admin")
    public ResponseEntity<ApiResponse<AuthResponse>> createAdmin(@Valid @RequestBody RegisterRequest request) {
        AuthResponse response = authService.createAdmin(request);
        return ResponseEntity.ok(ApiResponse.<AuthResponse>builder()
                .success(true)
                .message("Admin created successfully")
                .data(response)
                .build());
    }
}