import { useQuery } from '@tanstack/react-query';
import { api } from '@/services/api';
import { SongCard } from '@/components/common/SongCard';
import { Skeleton } from '@/components/ui/skeleton';
import { Headphones, Heart, Search } from 'lucide-react';

export default function HomePage() {
  const { data: recentSongs, isLoading } = useQuery({
    queryKey: ['/api/songs/recent'],
    queryFn: api.getRecentSongs,
  });

  return (
    <div className="p-6 space-y-8">
      {/* Welcome Section */}
      <div className="text-center py-12">
        <h1 className="text-4xl font-bold text-white mb-4">Welcome to MusicPlayer</h1>
        <p className="text-xl text-gray-400 mb-8">Discover and enjoy your favorite music</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <div className="bg-music-card rounded-xl p-6 text-center">
            <Headphones className="w-12 h-12 text-music-primary mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">High Quality Audio</h3>
            <p className="text-gray-400">Crystal clear sound quality for the best listening experience</p>
          </div>
          <div className="bg-music-card rounded-xl p-6 text-center">
            <Heart className="w-12 h-12 text-music-error mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">Create Favorites</h3>
            <p className="text-gray-400">Save your favorite songs and access them anytime</p>
          </div>
          <div className="bg-music-card rounded-xl p-6 text-center">
            <Search className="w-12 h-12 text-music-accent mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">Discover Music</h3>
            <p className="text-gray-400">Find new songs and artists to expand your musical horizons</p>
          </div>
        </div>
      </div>

      {/* Recently Added Songs */}
      <section>
        <h2 className="text-2xl font-bold text-white mb-6">Recently Added</h2>
        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="space-y-3">
                <Skeleton className="aspect-square rounded-lg bg-music-gray" />
                <Skeleton className="h-4 bg-music-gray" />
                <Skeleton className="h-3 w-3/4 bg-music-gray" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {recentSongs?.map((song: any) => (
              <SongCard key={song.id} song={song} />
            )) || <div className="text-gray-400 col-span-full text-center py-8">No songs available</div>}
          </div>
        )}
      </section>
    </div>
  );
}
