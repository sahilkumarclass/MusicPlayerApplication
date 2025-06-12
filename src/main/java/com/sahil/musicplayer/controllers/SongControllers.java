package com.sahil.musicplayer.controllers;

import com.sahil.musicplayer.model.Song;
import com.sahil.musicplayer.service.SongService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/songs")
@RequiredArgsConstructor
public class SongControllers {

    private final SongService songService;

    @PostMapping("/upload")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> uploadSong(@RequestParam("file") MultipartFile file,
                                        @RequestParam("title") String title,
                                        @RequestParam("artist") String artist) {
        try {
            Song uploaded = songService.uploadSong(file, title, artist);
            return ResponseEntity.ok(uploaded);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to upload song: " + e.getMessage());
        }
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('USER')")
    public ResponseEntity<List<Song>> getAllSongs() {
        List<Song> songs = songService.getAllSongs();
        return ResponseEntity.ok(songs);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('USER')")
    public ResponseEntity<Song> getSongById(@PathVariable String id) {
        Song song = songService.getSongById(id);
        return ResponseEntity.ok(song);
    }


    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Song> updateSong(@PathVariable String id,
                                           @RequestBody Song updatedSong) {
        try {
            Song song = songService.updateSong(id, updatedSong);
            return ResponseEntity.ok(song);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(null);
        }
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> deleteSong(@PathVariable String id) {
        try {
            songService.deleteSong(id);
            return ResponseEntity.ok("Song deleted successfully");
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Failed to delete song: " + e.getMessage());
        }
    }

    @PutMapping("/{id}/favorite")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<String> toggleFavorite(@PathVariable String id) {
        try {
            songService.toggleFavorite(id);
            return ResponseEntity.ok("Favorite status updated");
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Failed to update favorite: " + e.getMessage());
        }
    }
}