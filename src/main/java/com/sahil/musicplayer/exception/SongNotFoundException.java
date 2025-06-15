package com.sahil.musicplayer.exception;

public class SongNotFoundException extends RuntimeException {
    public SongNotFoundException(String songId) {
        super("Song not found with id: " + songId);
    }
}