import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/services/api';
import { SongList } from '@/components/common/SongList';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

export default function SearchPage() {
  const [, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');

  // Get query from URL params
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const query = urlParams.get('q');
    if (query) {
      setSearchQuery(query);
      setDebouncedQuery(query);
    }
  }, []);

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const { data: searchResults, isLoading } = useQuery({
    queryKey: ['/api/songs/search', debouncedQuery],
    queryFn: () => api.searchSongs(debouncedQuery),
    enabled: debouncedQuery.length > 0,
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setLocation(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const categories = [
    { name: 'Pop', color: 'from-red-500 to-pink-600' },
    { name: 'Rock', color: 'from-blue-500 to-purple-600' },
    { name: 'Jazz', color: 'from-green-500 to-teal-600' },
    { name: 'Electronic', color: 'from-yellow-500 to-orange-600' },
    { name: 'Hip Hop', color: 'from-purple-500 to-indigo-600' },
    { name: 'Classical', color: 'from-pink-500 to-rose-600' },
    { name: 'R&B', color: 'from-cyan-500 to-blue-600' },
    { name: 'Country', color: 'from-orange-500 to-red-600' },
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-6 text-center">Search Music</h1>
        <form onSubmit={handleSearch} className="relative mb-8">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <Input
            type="text"
            placeholder="What do you want to listen to?"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-4 bg-music-card border-gray-600 rounded-xl text-white placeholder-gray-400 focus:border-music-primary text-lg"
          />
        </form>
      </div>
      
      {/* Search Results */}
      {debouncedQuery && (
        <div>
          <h2 className="text-xl font-bold text-white mb-4">
            Search Results for "{debouncedQuery}"
          </h2>
          {isLoading ? (
            <div className="text-gray-400">Searching...</div>
          ) : searchResults && searchResults.length > 0 ? (
            <SongList songs={searchResults} />
          ) : (
            <div className="text-gray-400">No results found.</div>
          )}
        </div>
      )}
      
      {/* Browse Categories */}
      {!debouncedQuery && (
        <section>
          <h2 className="text-2xl font-bold text-white mb-6">Browse by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.map((category) => (
              <div
                key={category.name}
                className={`bg-gradient-to-br ${category.color} rounded-lg p-6 cursor-pointer hover:scale-105 transition-transform`}
                onClick={() => setSearchQuery(category.name)}
              >
                <h3 className="text-white font-bold text-lg">{category.name}</h3>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
