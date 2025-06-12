package com.sahil.musicplayer.service;

import com.sahil.musicplayer.dto.DashboardStats;
import com.sahil.musicplayer.model.User;
import com.sahil.musicplayer.repository.SongRepository;
import com.sahil.musicplayer.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class AdminService {

    private final UserRepository userRepository;
    private final SongRepository songRepository;

    @Cacheable(value = "users")
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @Cacheable(value = "dashboardStats")
    public DashboardStats getDashboardStats() {
        long totalUsers = userRepository.count();
        long totalSongs = songRepository.count();
        long activeUsers = userRepository.countByEnabled(true);

        return DashboardStats.builder()
                .totalUsers(totalUsers)
                .totalSongs(totalSongs)
                .activeUsers(activeUsers)
                .build();
    }

    @Transactional
    @CacheEvict(value = {"users", "dashboardStats"}, allEntries = true)
    public void toggleUserStatus(String userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> {
                    log.warn("Attempted to toggle status for non-existing user with id: {}", userId);
                    return new RuntimeException("User not found with id: " + userId);
                });

        user.setEnabled(!user.isEnabled());
        userRepository.save(user);
        log.info("User status toggled for user: {}", user.getUsername());
    }

    @Transactional
    @CacheEvict(value = {"users", "dashboardStats"}, allEntries = true)
    public void deleteUser(String userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> {
                    log.warn("Attempted to delete non-existing user with id: {}", userId);
                    return new RuntimeException("User not found with id: " + userId);
                });

        userRepository.delete(user);
        log.info("User deleted: {}", user.getUsername());
    }
}