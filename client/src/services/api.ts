import { Song } from '@shared/types';

// Configure the API base URL - update this to point to your Spring Boot backend
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

export const api = {
  // Songs
  getSongs: async (): Promise<Song[]> => {
    const response = await fetch(`${API_BASE_URL}/api/songs`);
    if (!response.ok) throw new Error('Failed to fetch songs');
    return response.json();
  },

  searchSongs: async (query: string): Promise<Song[]> => {
    const response = await fetch(`${API_BASE_URL}/api/songs/search?q=${encodeURIComponent(query)}`);
    if (!response.ok) throw new Error('Failed to search songs');
    return response.json();
  },

  // Favorites
  getFavorites: async (): Promise<Song[]> => {
    const response = await fetch(`${API_BASE_URL}/api/user/songs/favorites`, { credentials: 'include' });
    if (!response.ok) throw new Error('Failed to fetch favorites');
    return response.json();
  },

  addFavorite: async (songId: number): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/api/favorites`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ songId }),
      credentials: 'include',
    });
    if (!response.ok) throw new Error('Failed to add favorite');
  },

  removeFavorite: async (songId: number): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/api/favorites/${songId}`, {
      method: 'DELETE',
      credentials: 'include',
    });
    if (!response.ok) throw new Error('Failed to remove favorite');
  },

  checkFavorite: async (songId: number): Promise<boolean> => {
    const response = await fetch(`${API_BASE_URL}/api/favorites/${songId}/check`, {
      credentials: 'include',
    });
    if (!response.ok) return false;
    const data = await response.json();
    return data.isFavorite;
  },

  // Admin
  getDashboard: async () => {
    const response = await fetch(`${API_BASE_URL}/api/admin/dashboard`, { credentials: 'include' });
    if (!response.ok) throw new Error('Failed to fetch dashboard stats');
    return response.json();
  },

  getUsers: async () => {
    const response = await fetch(`${API_BASE_URL}/api/admin/users`, { credentials: 'include' });
    if (!response.ok) throw new Error('Failed to fetch users');
    return response.json();
  },

  toggleUserStatus: async (userId: number, isActive: boolean) => {
    const response = await fetch(`${API_BASE_URL}/api/admin/users/${userId}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isActive }),
      credentials: 'include',
    });
    if (!response.ok) throw new Error('Failed to update user status');
    return response.json();
  },

  deleteUser: async (userId: number) => {
    const response = await fetch(`${API_BASE_URL}/api/admin/users/${userId}`, {
      method: 'DELETE',
      credentials: 'include',
    });
    if (!response.ok) throw new Error('Failed to delete user');
  },

  uploadSong: async (songData: { file: File; title: string; artist: string }) => {
    const token = localStorage.getItem('token');

    const formData = new FormData();
    formData.append('file', songData.file);         // 🔥 file is required
    formData.append('title', songData.title);
    formData.append('artist', songData.artist);

    const response = await fetch(`${API_BASE_URL}/api/songs/upload`, {
      method: 'POST',
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        // ❌ Do NOT set Content-Type manually for FormData!
      },
      body: formData,
    });

    if (!response.ok) throw new Error('Failed to upload song');
    return response.json();
  },

  createSong: async (songData: any) => {
    const response = await fetch(`${API_BASE_URL}/api/songs`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(songData),
      credentials: 'include',
    });
    if (!response.ok) throw new Error('Failed to create song');
    return response.json();
  },

  deleteSong: async (songId: number) => {
    const response = await fetch(`${API_BASE_URL}/api/songs/${songId}`, {
      method: 'DELETE',
      credentials: 'include',
    });
    if (!response.ok) throw new Error('Failed to delete song');
  },

  // Health check
  getHealthStatus: async () => {
    const response = await fetch(`${API_BASE_URL}/api/health`);
    if (!response.ok) throw new Error('Failed to fetch health status');
    return response.json();
  },

  // Cache stats (Admin only)
  getCacheStats: async () => {
    const response = await fetch(`${API_BASE_URL}/api/admin/cache/stats`, { credentials: 'include' });
    if (!response.ok) throw new Error('Failed to fetch cache stats');
    return response.json();
  },

  // Rate limit reset (Admin only)
  resetRateLimit: async (identifier: string) => {
    const response = await fetch(`${API_BASE_URL}/api/admin/rate-limit/reset/${identifier}`, {
      method: 'POST',
      credentials: 'include',
    });
    if (!response.ok) throw new Error('Failed to reset rate limit');
    return response.json();
  },

  // Toggle favorite (updated to match Spring Boot structure)
  toggleFavorite: async (songId: number) => {
    const response = await fetch(`${API_BASE_URL}/api/songs/${songId}/favorite`, {
      method: 'PUT',
      credentials: 'include',
    });
    if (!response.ok) throw new Error('Failed to toggle favorite');
    return response.json();
  },

  // User profile
  getUserProfile: async () => {
    const response = await fetch(`${API_BASE_URL}/api/user/profile`, { credentials: 'include' });
    if (!response.ok) throw new Error('Failed to fetch user profile');
    return response.json();
  },

  // Recent songs
  getRecentSongs: async () => {
    const response = await fetch(`${API_BASE_URL}/api/songs/recent`, { credentials: 'include' });
    if (!response.ok) throw new Error('Failed to fetch recent songs');
    return response.json();
  },

  // Popular songs
  getPopularSongs: async () => {
    const response = await fetch(`${API_BASE_URL}/api/songs/popular`, { credentials: 'include' });
    if (!response.ok) throw new Error('Failed to fetch popular songs');
    return response.json();
  },
};
