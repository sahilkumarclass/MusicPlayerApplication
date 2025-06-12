package com.sahil.musicplayer.service;

import com.sahil.musicplayer.model.Song;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface SongService {
    Song uploadSong(MultipartFile file, String title, String artist);
    List<Song> getAllSongs();
    Song getSongById(String id);
    Song updateSong(String id, Song updatedSong);
    void deleteSong(String id);
    void toggleFavorite(String id);
}
