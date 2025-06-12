package com.sahil.musicplayer.model;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "songs")
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Song {

    @Id
    private String id;
    private String fileName;
    @Indexed
    private String title;
    @Indexed
    private String artist;
    private String url;
    private String publicId;
    @Indexed
    private boolean isFavorite;
}
