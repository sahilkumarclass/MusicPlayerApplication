package com.sahil.musicplayer.service;

import com.sahil.musicplayer.dto.AuthResponse;
import com.sahil.musicplayer.dto.LoginRequest;
import com.sahil.musicplayer.dto.RegisterRequest;
import com.sahil.musicplayer.model.Role;
import com.sahil.musicplayer.model.User;
import com.sahil.musicplayer.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    // Hardcoded admin credentials
    private static final String ADMIN_EMAIL = "sahilkumarclass@gmail.com";
    private static final String ADMIN_USERNAME = "sahilkumarclass10";
    private static final String ADMIN_PASSWORD = "Sahil@2003";

    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new RuntimeException("Username already exists");
        }
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        var user = User.builder()
                .username(request.getUsername())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(Role.USER) // Default role is USER
                .enabled(true)
                .build();

        userRepository.save(user);
        var jwtToken = jwtService.generateToken(user);

        return AuthResponse.builder()
                .token(jwtToken)
                .username(user.getUsername())
                .role(user.getRole().name())
                .message("User registered successfully")
                .build();
    }

    public AuthResponse authenticate(LoginRequest request) {
        // Check if it's the hardcoded admin credentials
        if (isHardcodedAdmin(request.getUsername(), request.getPassword())) {
            log.info("Hardcoded admin login detected for username: {}", request.getUsername());

            // Check if admin user exists in database, if not create it
            User adminUser = userRepository.findByUsername(ADMIN_USERNAME)
                    .orElseGet(() -> createHardcodedAdminUser());

            var jwtToken = jwtService.generateToken(adminUser);

            return AuthResponse.builder()
                    .token(jwtToken)
                    .username(adminUser.getUsername())
                    .role(adminUser.getRole().name())
                    .message("Admin authentication successful")
                    .build();
        }

        // Regular authentication flow
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            request.getUsername(),
                            request.getPassword()));
        } catch (BadCredentialsException e) {
            throw new RuntimeException("Invalid credentials");
        }

        var user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));

        var jwtToken = jwtService.generateToken(user);

        return AuthResponse.builder()
                .token(jwtToken)
                .username(user.getUsername())
                .role(user.getRole().name())
                .message("Authentication successful")
                .build();
    }

    private boolean isHardcodedAdmin(String username, String password) {
        return (ADMIN_USERNAME.equals(username) || ADMIN_EMAIL.equals(username))
                && ADMIN_PASSWORD.equals(password);
    }

    private User createHardcodedAdminUser() {
        log.info("Creating hardcoded admin user in database");

        var admin = User.builder()
                .username(ADMIN_USERNAME)
                .email(ADMIN_EMAIL)
                .password(passwordEncoder.encode(ADMIN_PASSWORD))
                .role(Role.ADMIN)
                .enabled(true)
                .build();

        return userRepository.save(admin);
    }

    public AuthResponse createAdmin(RegisterRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new RuntimeException("Username already exists");
        }
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        var admin = User.builder()
                .username(request.getUsername())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(Role.ADMIN)
                .enabled(true)
                .build();

        userRepository.save(admin);
        var jwtToken = jwtService.generateToken(admin);

        return AuthResponse.builder()
                .token(jwtToken)
                .username(admin.getUsername())
                .role(admin.getRole().name())
                .message("Admin created successfully")
                .build();
    }
}