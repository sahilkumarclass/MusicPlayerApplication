export interface User {
    id: number;
    username: string;
    email: string;
    password: string;
    role: 'USER' | 'ADMIN';
    isActive: boolean;
    createdAt: Date;
}

export interface Song {
    id: number;
    title: string;
    artist: string;
    album?: string | null;
    genre?: string | null;
    duration?: number | null; // in seconds
    fileUrl: string;
    coverImageUrl?: string | null;
    uploadedBy: number;
    playCount: number;
    createdAt: Date;
}

export interface Favorite {
    id: number;
    userId: number;
    songId: number;
    createdAt: Date;
}

export interface LoginCredentials {
    identifier: string;
    password: string;
}

export interface InsertUser {
    username: string;
    email: string;
    password: string;
}

export interface InsertSong {
    title: string;
    artist: string;
    album?: string | null;
    genre?: string | null;
    duration?: number | null;
    fileUrl: string;
    coverImageUrl?: string | null;
}

export interface InsertFavorite {
    songId: number;
} 