package com.sahil.musicplayer.controllers;

import com.sahil.musicplayer.model.Song;
import com.sahil.musicplayer.model.User;
import com.sahil.musicplayer.service.AdminService;
import com.sahil.musicplayer.service.SongService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
@RequiredArgsConstructor
public class AdminController {

    private final SongService songService;
    private final AdminService adminService;

    @GetMapping("/dashboard")
    public ResponseEntity<?> getDashboard() {
        try {
            var dashboard = adminService.getDashboardStats();
            return ResponseEntity.ok(dashboard);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to fetch dashboard: " + e.getMessage());
        }
    }

    @GetMapping("/users")
    public ResponseEntity<List<User>> getAllUsers() {
        List<User> users = adminService.getAllUsers();
        return ResponseEntity.ok(users);
    }


    @PutMapping("/songs/{id}")
    public ResponseEntity<?> updateSong(@PathVariable String id,
                                        @RequestBody Song updatedSong) {
        try {
            Song song = songService.updateSong(id, updatedSong);
            return ResponseEntity.ok(song);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Failed to update song: " + e.getMessage());
        }
    }

    @DeleteMapping("/songs/{id}")
    public ResponseEntity<String> deleteSong(@PathVariable String id) {
        try {
            songService.deleteSong(id);
            return ResponseEntity.ok("Song deleted successfully");
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Failed to delete song: " + e.getMessage());
        }
    }

    @PutMapping("/users/{id}/status")
    public ResponseEntity<?> toggleUserStatus(@PathVariable String id) {
        try {
            adminService.toggleUserStatus(id);
            return ResponseEntity.ok("User status updated successfully");
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Failed to update user status: " + e.getMessage());
        }
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<String> deleteUser(@PathVariable String id) {
        try {
            adminService.deleteUser(id);
            return ResponseEntity.ok("User deleted successfully");
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Failed to delete user: " + e.getMessage());
        }
    }
}