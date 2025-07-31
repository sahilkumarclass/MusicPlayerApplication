import { useQuery } from '@tanstack/react-query';
import { api } from '@/services/api';
import { SongList } from '@/components/common/SongList';
import { Button } from '@/components/ui/button';
import { List, Grid3X3 } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';

export default function LibraryPage() {
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const { user } = useAuth();
  
  const { data: songs, isLoading } = useQuery({
    queryKey: ['/api/songs'],
    queryFn: api.getSongs,
    enabled: !!user,
  });

  if (!user) {
    return (
      <div className="p-6 text-center">
        <h1 className="text-3xl font-bold text-white mb-4">Your Library</h1>
        <p className="text-gray-400">Please log in to view your library.</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-white">Your Library</h1>
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setViewMode('list')}
            className={`${viewMode === 'list' ? 'text-white' : 'text-gray-400 hover:text-white'}`}
          >
            <List className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setViewMode('grid')}
            className={`${viewMode === 'grid' ? 'text-white' : 'text-gray-400 hover:text-white'}`}
          >
            <Grid3X3 className="w-4 h-4" />
          </Button>
        </div>
      </div>
      
      {isLoading ? (
        <div className="text-gray-400">Loading your library...</div>
      ) : songs && songs.length > 0 ? (
        <SongList songs={songs} />
      ) : (
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold text-white mb-2">Your library is empty</h2>
          <p className="text-gray-400">Start by exploring music and adding songs to your favorites.</p>
        </div>
      )}
    </div>
  );
}
