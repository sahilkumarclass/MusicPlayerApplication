package com.sahil.musicplayer.repository;

import com.sahil.musicplayer.model.Song;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface SongRepository extends MongoRepository<Song, String> {
}
