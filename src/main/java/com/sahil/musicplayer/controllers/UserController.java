package com.sahil.musicplayer.controllers;

import com.sahil.musicplayer.model.Song;
import com.sahil.musicplayer.service.SongService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/user")
@PreAuthorize("hasRole('USER')")
@RequiredArgsConstructor
public class UserController {

    private final SongService songService;

    @GetMapping("/songs/favorites")
    public ResponseEntity<List<Song>> getFavoriteSongs() {
        List<Song> favoriteSongs = songService.getAllSongs().stream()
                .filter(Song::isFavorite)
                .toList();
        return ResponseEntity.ok(favoriteSongs);
    }
}