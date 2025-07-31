import { useAudio } from '@/context/AudioContext';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { formatDuration } from '@/lib/utils';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Shuffle,
  Repeat,
  Volume2,
  VolumeX,
  Heart,
  List,
  Monitor
} from 'lucide-react';

export function AudioPlayer() {
  const {
    currentSong,
    isPlaying,
    currentTime,
    duration,
    volume,
    isMuted,
    isShuffled,
    repeatMode,
    togglePlayPause,
    nextSong,
    previousSong,
    seekTo,
    setVolume,
    toggleMute,
    toggleShuffle,
    toggleRepeat,
  } = useAudio();

  if (!currentSong) return null;

  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;

  const handleSeek = (value: number[]) => {
    if (duration > 0) {
      const newTime = (value[0] / 100) * duration;
      seekTo(newTime);
    }
  };

  const handleVolumeChange = (value: number[]) => {
    setVolume(value[0] / 100);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-music-gray border-t border-gray-800 p-4 z-50">
      <div className="flex items-center justify-between max-w-screen-xl mx-auto">
        {/* Current Song Info */}
        <div className="flex items-center space-x-4 w-1/4">
          <img
            src={currentSong.coverImageUrl || "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-4.0.3&auto=format&fit=crop&w=60&h=60"}
            alt={currentSong.title}
            className="w-14 h-14 rounded object-cover"
          />
          <div className="min-w-0">
            <p className="text-white font-medium truncate">{currentSong.title}</p>
            <p className="text-gray-400 text-sm truncate">{currentSong.artist}</p>
          </div>
          <Button variant="ghost" size="sm" className="text-gray-400 hover:text-music-error">
            <Heart className="w-4 h-4" />
          </Button>
        </div>

        {/* Player Controls */}
        <div className="flex flex-col items-center w-1/2">
          <div className="flex items-center space-x-6 mb-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleShuffle}
              className={`transition-colors ${isShuffled ? 'text-music-primary' : 'text-gray-400 hover:text-white'
                }`}
            >
              <Shuffle className="w-4 h-4" />
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={previousSong}
              className="text-gray-400 hover:text-white"
            >
              <SkipBack className="w-5 h-5" />
            </Button>

            <Button
              onClick={togglePlayPause}
              className="w-12 h-12 bg-white hover:bg-gray-100 text-black rounded-full flex items-center justify-center hover:scale-105 transition-transform"
            >
              {isPlaying ? (
                <Pause className="w-5 h-5" />
              ) : (
                <Play className="w-5 h-5 ml-1" />
              )}
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={nextSong}
              className="text-gray-400 hover:text-white"
            >
              <SkipForward className="w-5 h-5" />
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={toggleRepeat}
              className={`transition-colors ${repeatMode !== 'off' ? 'text-music-primary' : 'text-gray-400 hover:text-white'
                }`}
            >
              <Repeat className="w-4 h-4" />
            </Button>
          </div>

          {/* Progress Bar */}
          <div className="flex items-center space-x-3 w-full max-w-lg">
            <span className="text-gray-400 text-sm min-w-[40px]">
              {formatDuration(Math.floor(currentTime))}
            </span>
            <Slider
              value={[progressPercentage]}
              onValueChange={handleSeek}
              max={100}
              step={0.1}
              className="flex-1"
            />
            <span className="text-gray-400 text-sm min-w-[40px]">
              {formatDuration(Math.floor(duration))}
            </span>
          </div>
        </div>

        {/* Volume and Additional Controls */}
        <div className="flex items-center space-x-4 w-1/4 justify-end">
          <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
            <List className="w-4 h-4" />
          </Button>

          <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
            <Monitor className="w-4 h-4" />
          </Button>

          <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleMute}
              className="text-gray-400 hover:text-white"
            >
              {isMuted || volume === 0 ? (
                <VolumeX className="w-4 h-4" />
              ) : (
                <Volume2 className="w-4 h-4" />
              )}
            </Button>

            <Slider
              value={[isMuted ? 0 : volume * 100]}
              onValueChange={handleVolumeChange}
              max={100}
              step={1}
              className="w-24"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
