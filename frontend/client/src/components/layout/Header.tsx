import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Plus, Menu } from 'lucide-react';
import { useLocation } from 'wouter';

interface HeaderProps {
  onSearch?: (query: string) => void;
  onUploadClick?: () => void;
}

export function Header({ onSearch, onUploadClick }: HeaderProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [, setLocation] = useLocation();
  const { user } = useAuth();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      if (onSearch) {
        onSearch(searchQuery);
      } else {
        setLocation(`/search?q=${encodeURIComponent(searchQuery)}`);
      }
    }
  };

  return (
    <header className="bg-music-gray bg-opacity-80 backdrop-blur-sm border-b border-gray-800 p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" className="lg:hidden text-gray-400 hover:text-white">
            <Menu className="w-5 h-5" />
          </Button>

          <form onSubmit={handleSearch} className="relative max-w-md">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              type="text"
              placeholder="Search songs, artists, albums..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-music-card border-gray-600 rounded-full text-white placeholder-gray-400 focus:border-music-primary"
            />
          </form>
        </div>

        {/* Admin Controls */}
        {user?.role === 'ADMIN' && (
          <div className="flex items-center space-x-3">
            <Button
              onClick={onUploadClick}
              className="bg-music-success hover:bg-green-600 text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Upload Song
            </Button>
          </div>
        )}

        {/* Debug Info - Remove this after fixing */}
        {user && (
          <div className="text-xs text-gray-400 bg-gray-800 px-2 py-1 rounded">
            User: {user.username} | Role: {user.role} | ID: {user.id}
          </div>
        )}
      </div>
    </header>
  );
}
