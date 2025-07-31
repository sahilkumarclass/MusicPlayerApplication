import { useQuery } from '@tanstack/react-query';
import { api } from '@/services/api';
import { SongList } from '@/components/common/SongList';
import { Button } from '@/components/ui/button';
import { Heart, Play, Shuffle } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useAudio } from '@/context/AudioContext';

export default function FavoritesPage() {
  const { user } = useAuth();
  const { playSong } = useAudio();
  
  const { data: favorites, isLoading } = useQuery({
    queryKey: ['/api/user/songs/favorites'],
    queryFn: api.getFavorites,
    enabled: !!user,
  });

  const handlePlayAll = () => {
    if (favorites && favorites.length > 0) {
      playSong(favorites[0]);
    }
  };

  if (!user) {
    return (
      <div className="p-6 text-center">
        <h1 className="text-3xl font-bold text-white mb-4">Favorite Songs</h1>
        <p className="text-gray-400">Please log in to view your favorites.</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center space-x-6 mb-8">
        <div className="w-64 h-64 bg-gradient-to-br from-music-primary to-music-secondary rounded-lg flex items-center justify-center">
          <Heart className="text-white text-6xl" />
        </div>
        <div>
          <p className="text-gray-400 text-sm uppercase tracking-wider">Playlist</p>
          <h1 className="text-5xl font-bold text-white mb-4">Favorite Songs</h1>
          <p className="text-gray-400">Your most loved tracks</p>
          <p className="text-gray-400 mt-2">
            {favorites?.length || 0} songs
          </p>
        </div>
      </div>
      
      {favorites && favorites.length > 0 && (
        <div className="flex items-center space-x-6 mb-8">
          <Button
            onClick={handlePlayAll}
            className="w-14 h-14 bg-music-primary hover:bg-purple-700 rounded-full flex items-center justify-center hover:scale-105 transition-all"
          >
            <Play className="text-white text-lg ml-1" />
          </Button>
          <Button variant="ghost" className="text-gray-400 hover:text-white">
            <Shuffle className="w-6 h-6" />
          </Button>
        </div>
      )}
      
      {isLoading ? (
        <div className="text-gray-400">Loading your favorites...</div>
      ) : favorites && favorites.length > 0 ? (
        <SongList songs={favorites} showDateAdded={false} />
      ) : (
        <div className="text-center py-12">
          <Heart className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-white mb-2">No favorites yet</h2>
          <p className="text-gray-400">
            Start exploring music and add songs to your favorites by clicking the heart icon.
          </p>
        </div>
      )}
    </div>
  );
}
