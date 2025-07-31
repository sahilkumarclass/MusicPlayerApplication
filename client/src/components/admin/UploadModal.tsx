import { useState, useRef } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Upload, CloudUpload, Image } from 'lucide-react';
import { api } from '@/services/api';
import { queryClient } from '@/lib/queryClient';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function UploadModal({ isOpen, onClose }: UploadModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [audioPreviewUrl, setAudioPreviewUrl] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    file: null as File | null,
    title: '',
    artist: '',
    album: '',
    genre: '',
    duration: 0,
    coverImageUrl: '',
  });

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({ ...prev, file })); // Store the File object for upload
      setAudioPreviewUrl(URL.createObjectURL(file)); // For preview only
    }
  };

  // Handle drag and drop
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      setFormData(prev => ({ ...prev, file }));
      setAudioPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (!formData.file) {
        toast({ title: 'Error', description: 'Please select an audio file.' });
        setIsLoading(false);
        return;
      }
      await api.uploadSong({
        file: formData.file,
        title: formData.title,
        artist: formData.artist,
      });
      queryClient.invalidateQueries({ queryKey: ['/api/songs'] });
      toast({
        title: "Success",
        description: "Song uploaded successfully!",
      });
      onClose();
      setFormData({
        file: null,
        title: '',
        artist: '',
        album: '',
        genre: '',
        duration: 0,
        coverImageUrl: '',
      });
      setAudioPreviewUrl(null);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to upload song",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-music-card border-gray-600 text-white max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Upload New Song</DialogTitle>
          <p className="text-gray-400">Add music to your library</p>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label className="text-gray-300">Song Title</Label>
            <Input
              type="text"
              placeholder="Enter song title"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              className="bg-music-gray border-gray-600 text-white placeholder-gray-400 focus:border-music-primary"
              required
            />
          </div>
          <div>
            <Label className="text-gray-300">Artist</Label>
            <Input
              type="text"
              placeholder="Enter artist name"
              value={formData.artist}
              onChange={(e) => handleInputChange('artist', e.target.value)}
              className="bg-music-gray border-gray-600 text-white placeholder-gray-400 focus:border-music-primary"
              required
            />
          </div>
          <div>
            <Label className="text-gray-300">Album</Label>
            <Input
              type="text"
              placeholder="Enter album name (optional)"
              value={formData.album}
              onChange={(e) => handleInputChange('album', e.target.value)}
              className="bg-music-gray border-gray-600 text-white placeholder-gray-400 focus:border-music-primary"
            />
          </div>
          <div>
            <Label className="text-gray-300">Genre</Label>
            <Input
              type="text"
              placeholder="Enter genre (optional)"
              value={formData.genre}
              onChange={(e) => handleInputChange('genre', e.target.value)}
              className="bg-music-gray border-gray-600 text-white placeholder-gray-400 focus:border-music-primary"
            />
          </div>
          <div>
            <Label className="text-gray-300">Duration (seconds)</Label>
            <Input
              type="number"
              placeholder="Duration in seconds (optional)"
              value={formData.duration || ''}
              onChange={(e) => handleInputChange('duration', parseInt(e.target.value) || 0)}
              className="bg-music-gray border-gray-600 text-white placeholder-gray-400 focus:border-music-primary"
            />
          </div>
          <div>
            <Label className="text-gray-300">Audio File</Label>
            <div
              className="mt-2 p-4 border-2 border-dashed border-gray-600 rounded-lg text-center hover:border-music-primary transition-colors cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
            >
              <input
                type="file"
                accept="audio/*"
                ref={fileInputRef}
                style={{ display: 'none' }}
                onChange={handleFileChange}
              />
              <CloudUpload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-300">Click to upload or drag and drop</p>
              <p className="text-sm text-gray-500 mt-1">MP3, WAV, FLAC files supported</p>
              {audioPreviewUrl && (
                <audio controls src={audioPreviewUrl} className="mx-auto mt-2" />
              )}
            </div>
          </div>
          <div>
            <Label className="text-gray-300">Album Cover URL (Optional)</Label>
            <Input
              type="url"
              placeholder="Enter cover image URL (optional)"
              value={formData.coverImageUrl}
              onChange={(e) => handleInputChange('coverImageUrl', e.target.value)}
              className="bg-music-gray border-gray-600 text-white placeholder-gray-400 focus:border-music-primary"
            />
          </div>
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-music-success hover:bg-green-600"
          >
            <Upload className="w-4 h-4 mr-2" />
            {isLoading ? 'Uploading...' : 'Upload Song'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
