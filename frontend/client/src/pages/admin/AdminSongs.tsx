import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { api } from '@/services/api';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { formatTimeAgo } from '@/lib/utils';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { UploadModal } from '@/components/admin/UploadModal';
import { queryClient } from '@/lib/queryClient';

export default function AdminSongs() {
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();
  
  const { data: songs, isLoading } = useQuery({
    queryKey: ['/api/songs'],
    queryFn: api.getSongs,
    enabled: user?.role === 'ADMIN',
  });

  const deleteMutation = useMutation({
    mutationFn: api.deleteSong,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/songs'] });
      toast({
        title: "Success",
        description: "Song deleted successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete song",
        variant: "destructive",
      });
    },
  });

  const handleDelete = (songId: number) => {
    if (confirm('Are you sure you want to delete this song?')) {
      deleteMutation.mutate(songId);
    }
  };

  if (user?.role !== 'ADMIN') {
    return (
      <div className="p-6 text-center">
        <h1 className="text-3xl font-bold text-white mb-4">Access Denied</h1>
        <p className="text-gray-400">You don't have permission to access this page.</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-white">Manage Songs</h1>
        <Button
          onClick={() => setUploadModalOpen(true)}
          className="bg-music-success hover:bg-green-600 text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          Upload Song
        </Button>
      </div>
      
      {/* Songs Table */}
      <div className="bg-music-card rounded-xl overflow-hidden">
        <div className="grid grid-cols-12 gap-4 p-4 border-b border-gray-700 text-gray-400 text-sm font-medium">
          <div className="col-span-4">Song</div>
          <div className="col-span-2">Artist</div>
          <div className="col-span-2">Album</div>
          <div className="col-span-2">Upload Date</div>
          <div className="col-span-1">Plays</div>
          <div className="col-span-1">Actions</div>
        </div>
        
        {isLoading ? (
          <div className="p-8 text-center text-gray-400">Loading songs...</div>
        ) : songs && songs.length > 0 ? (
          <div className="space-y-0">
            {songs.map((song) => (
              <div key={song.id} className="grid grid-cols-12 gap-4 p-4 hover:bg-music-gray transition-colors">
                <div className="col-span-4 flex items-center space-x-3">
                  <img
                    src={song.coverImageUrl || "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-4.0.3&auto=format&fit=crop&w=60&h=60"}
                    alt={`${song.title} cover`}
                    className="w-12 h-12 rounded object-cover"
                  />
                  <div className="min-w-0">
                    <p className="text-white font-medium truncate">{song.title}</p>
                    <p className="text-gray-400 text-sm">{song.duration ? `${Math.floor(song.duration / 60)}:${(song.duration % 60).toString().padStart(2, '0')}` : '0:00'}</p>
                  </div>
                </div>
                <div className="col-span-2 flex items-center text-gray-300">{song.artist}</div>
                <div className="col-span-2 flex items-center text-gray-300">{song.album || 'Unknown'}</div>
                <div className="col-span-2 flex items-center text-gray-300">{formatTimeAgo(new Date(song.createdAt))}</div>
                <div className="col-span-1 flex items-center text-gray-300">{song.playCount?.toLocaleString() || '0'}</div>
                <div className="col-span-1 flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-music-accent hover:text-blue-400 p-1 h-auto"
                    title="Edit"
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(song.id)}
                    className="text-music-error hover:text-red-400 p-1 h-auto"
                    title="Delete"
                    disabled={deleteMutation.isPending}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center text-gray-400">No songs uploaded yet.</div>
        )}
      </div>

      <UploadModal 
        isOpen={uploadModalOpen} 
        onClose={() => setUploadModalOpen(false)} 
      />
    </div>
  );
}
