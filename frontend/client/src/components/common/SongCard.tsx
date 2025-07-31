import { Song } from '@shared/types';
import { useAudio } from '@/context/AudioContext';
import { Button } from '@/components/ui/button';
import { Play, Pause } from 'lucide-react';

interface SongCardProps {
  song: Song;
  className?: string;
}

export function SongCard({ song, className = '' }: SongCardProps) {
  const { currentSong, isPlaying, playSong, togglePlayPause } = useAudio();
  const isCurrentSong = currentSong?.id === song.id;

  const handlePlay = () => {
    if (isCurrentSong) {
      togglePlayPause();
    } else {
      playSong(song);
    }
  };

  return (
    <div className={`bg-music-card rounded-lg p-4 hover:bg-gray-700 transition-colors cursor-pointer group relative ${className}`}>
      <img
        src={song.coverImageUrl || "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300"}
        alt={`${song.title} cover`}
        className="w-full aspect-square object-cover rounded-lg mb-3"
      />

      <h3 className="text-white font-medium truncate">{song.title}</h3>
      <p className="text-gray-400 text-sm truncate">{song.artist}</p>

      <Button
        onClick={handlePlay}
        className={`absolute top-4 right-4 w-12 h-12 bg-music-primary rounded-full flex items-center justify-center hover:scale-105 transition-all ${isCurrentSong ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
          }`}
      >
        {isCurrentSong && isPlaying ? (
          <Pause className="text-white w-5 h-5" />
        ) : (
          <Play className="text-white w-5 h-5 ml-1" />
        )}
      </Button>
    </div>
  );
}
