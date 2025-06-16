package com.sahil.musicplayer.controllers;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class WelcomeController {

    @GetMapping("/")
    public String welcome() {
        return """
                Welcome to Music Player API!

                Available endpoints:
                - /api/auth/register - Register a new user
                - /api/auth/login - Login
                - /api/songs - Get all songs (requires authentication)
                - /api/user/songs/favorites - Get favorite songs (requires USER role)
                - /api/admin/dashboard - Admin dashboard (requires ADMIN role)

                For API documentation, visit: /swagger-ui.html
                """;
    }
}