package com.sahil.musicplayer.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.sahil.musicplayer.exception.SongNotFoundException;
import com.sahil.musicplayer.model.Song;
import com.sahil.musicplayer.repository.SongRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.CachePut;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class SongServiceImpl implements SongService {

    private final Cloudinary cloudinary;
    private final SongRepository songRepository;

    @Override
    @Transactional
    @CacheEvict(value = { "songs", "song" }, allEntries = true)
    public Song uploadSong(MultipartFile file, String title, String artist) {
        String filename = file.getOriginalFilename();
        if (file.isEmpty() || filename == null || !filename.toLowerCase().endsWith(".mp3")) {
            throw new IllegalArgumentException("Only .mp3 files are allowed.");
        }
        try {
            Map<?, ?> uploadResult = cloudinary.uploader().upload(file.getBytes(), ObjectUtils.asMap(
                    "resource_type", "auto"));

            Song song = Song.builder()
                    .fileName(filename)
                    .title(title)
                    .artist(artist)
                    .url((String) uploadResult.get("secure_url"))
                    .publicId((String) uploadResult.get("public_id"))
                    .isFavorite(false)
                    .build();

            return songRepository.save(song);
        } catch (IOException e) {
            log.error("Error uploading song to Cloudinary", e);
            throw new RuntimeException("Failed to upload song to Cloudinary");
        }
    }

    @Override
    @Cacheable(value = "songs", key = "'all'", unless = "#result.isEmpty()")
    public List<Song> getAllSongs() {
        log.debug("Fetching all songs from database");
        return songRepository.findAll();
    }

    @Override
    @Cacheable(value = "song", key = "#id", unless = "#result == null")
    public Song getSongById(String id) {
        log.debug("Fetching song with id: {} from database", id);
        return songRepository.findById(id)
                .orElseThrow(() -> new SongNotFoundException("Song not found with id: " + id));
    }

    @Override
    @Transactional
    @CachePut(value = "song", key = "#id")
    @CacheEvict(value = "songs", allEntries = true)
    public Song updateSong(String id, Song updatedSong) {
        return songRepository.findById(id)
                .map(existing -> {
                    existing.setTitle(updatedSong.getTitle());
                    existing.setArtist(updatedSong.getArtist());
                    existing.setFavorite(updatedSong.isFavorite());
                    return songRepository.save(existing);
                })
                .orElseThrow(() -> {
                    log.warn("Attempted to update a non-existing song with id: {}", id);
                    return new SongNotFoundException("Song not found with id: " + id);
                });
    }

    @Override
    @Transactional
    @CacheEvict(value = { "songs", "song" }, allEntries = true)
    public void deleteSong(String id) {
        Song song = songRepository.findById(id)
                .orElseThrow(() -> {
                    log.warn("Attempted to delete a non-existing song with id: {}", id);
                    return new SongNotFoundException("Song not found with id: " + id);
                });

        String publicId = song.getPublicId();
        if (publicId == null || publicId.isEmpty()) {
            log.error("Public ID is missing for song with id: {}", id);
            throw new RuntimeException("Public ID is missing. Cannot delete from Cloudinary.");
        }

        try {
            cloudinary.uploader().destroy(publicId, ObjectUtils.asMap("resource_type", "video"));
            songRepository.deleteById(id);
        } catch (IOException e) {
            log.error("Failed to delete song from Cloudinary for id: {}", id, e);
            throw new RuntimeException("Failed to delete song from Cloudinary.");
        }
    }

    @Override
    @Transactional
    @CachePut(value = "song", key = "#id")
    @CacheEvict(value = "songs", allEntries = true)
    public void toggleFavorite(String id) {
        Song song = songRepository.findById(id)
                .orElseThrow(() -> {
                    log.warn("Attempted to toggle favorite for non-existing song with id: {}", id);
                    return new SongNotFoundException("Song not found with id: " + id);
                });

        song.setFavorite(!song.isFavorite());
        songRepository.save(song);
    }
}