import { Song } from '@shared/types';
import { useAudio } from '@/context/AudioContext';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { formatDuration, formatTimeAgo } from '@/lib/utils';
import { Play, Pause, Heart, MoreHorizontal, Clock } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import { api } from '@/services/api';
import { queryClient } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

interface SongListProps {
  songs: Song[];
  showAlbum?: boolean;
  showDateAdded?: boolean;
  showPlayCount?: boolean;
}

export function SongList({ songs, showAlbum = true, showDateAdded = true, showPlayCount = false }: SongListProps) {
  const { currentSong, isPlaying, playSong, togglePlayPause } = useAudio();
  const { user } = useAuth();
  const { toast } = useToast();

  const favoriteMutation = useMutation({
    mutationFn: async ({ songId, action }: { songId: number; action: 'add' | 'remove' }) => {
      if (action === 'add') {
        await api.addFavorite(songId);
      } else {
        await api.removeFavorite(songId);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/user/songs/favorites'] });
      toast({
        title: "Success",
        description: "Favorites updated",
      });
    },
  });

  const handlePlay = (song: Song) => {
    if (currentSong?.id === song.id) {
      togglePlayPause();
    } else {
      playSong(song);
    }
  };

  const handleFavoriteToggle = async (songId: number) => {
    if (!user) return;

    try {
      const isFavorite = await api.checkFavorite(songId);
      favoriteMutation.mutate({
        songId,
        action: isFavorite ? 'remove' : 'add'
      });
    } catch (error) {
      console.error('Failed to toggle favorite:', error);
    }
  };

  return (
    <div className="bg-music-card rounded-xl overflow-hidden">
      {/* Header */}
      <div className="grid gap-4 p-4 border-b border-gray-700 text-gray-400 text-sm">
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-1">#</div>
          <div className="col-span-5">Title</div>
          {showAlbum && <div className="col-span-3">Album</div>}
          {showDateAdded && <div className="col-span-2">Date Added</div>}
          {showPlayCount && <div className="col-span-1">Plays</div>}
          <div className="col-span-1">
            <Clock className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* Song List */}
      <div className="space-y-0">
        {songs.map((song, index) => {
          const isCurrentSong = currentSong?.id === song.id;
          const isCurrentlyPlaying = isCurrentSong && isPlaying;

          return (
            <div
              key={song.id}
              className="grid grid-cols-12 gap-4 p-4 hover:bg-music-gray transition-colors cursor-pointer group"
            >
              <div className="col-span-1 flex items-center">
                <span className={`text-gray-400 group-hover:hidden ${isCurrentSong ? 'text-music-primary' : ''}`}>
                  {index + 1}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handlePlay(song)}
                  className="hidden group-hover:flex text-white hover:text-music-primary p-0 h-auto"
                >
                  {isCurrentlyPlaying ? (
                    <Pause className="w-4 h-4" />
                  ) : (
                    <Play className="w-4 h-4" />
                  )}
                </Button>
              </div>

              <div className="col-span-5 flex items-center space-x-3">
                <img
                  src={song.coverImageUrl || "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?ixlib=rb-4.0.3&auto=format&fit=crop&w=60&h=60"}
                  alt={`${song.title} cover`}
                  className="w-12 h-12 rounded object-cover"
                />
                <div className="min-w-0">
                  <p className={`font-medium truncate ${isCurrentSong ? 'text-music-primary' : 'text-white'}`}>
                    {song.title}
                  </p>
                  <p className="text-gray-400 text-sm truncate">{song.artist}</p>
                </div>
              </div>

              {showAlbum && (
                <div className="col-span-3 flex items-center text-gray-400 truncate">
                  {song.album || 'Unknown Album'}
                </div>
              )}

              {showDateAdded && (
                <div className="col-span-2 flex items-center text-gray-400">
                  {formatTimeAgo(new Date(song.createdAt))}
                </div>
              )}

              {showPlayCount && (
                <div className="col-span-1 flex items-center text-gray-400">
                  {song.playCount?.toLocaleString() || '0'}
                </div>
              )}

              <div className="col-span-1 flex items-center justify-between">
                {user && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleFavoriteToggle(song.id)}
                    className="text-gray-400 hover:text-music-error p-0 h-auto"
                  >
                    <Heart className="w-4 h-4" />
                  </Button>
                )}

                <span className="text-gray-400 text-sm">
                  {song.duration ? formatDuration(song.duration) : '0:00'}
                </span>

                <Button
                  variant="ghost"
                  size="sm"
                  className="text-gray-400 hover:text-white opacity-0 group-hover:opacity-100 p-0 h-auto"
                >
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
