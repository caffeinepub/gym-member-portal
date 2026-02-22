import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Music, Play, Pause } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

interface Song {
  id: string;
  title: string;
  artist: string;
  duration: string;
  url: string;
}

const workoutPlaylist: Song[] = [
  { id: '1', title: 'Eye of the Tiger', artist: 'Survivor', duration: '4:05', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3' },
  { id: '2', title: "Gonna Fly Now", artist: 'Bill Conti', duration: '2:47', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3' },
  { id: '3', title: 'Stronger', artist: 'Kanye West', duration: '5:12', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3' },
  { id: '4', title: 'Till I Collapse', artist: 'Eminem', duration: '4:57', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3' },
  { id: '5', title: 'Lose Yourself', artist: 'Eminem', duration: '5:26', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3' },
  { id: '6', title: 'Remember the Name', artist: 'Fort Minor', duration: '3:50', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3' },
  { id: '7', title: "Can't Hold Us", artist: 'Macklemore', duration: '4:18', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3' },
  { id: '8', title: 'Thunderstruck', artist: 'AC/DC', duration: '4:52', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3' },
  { id: '9', title: 'We Will Rock You', artist: 'Queen', duration: '2:02', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3' },
  { id: '10', title: 'The Final Countdown', artist: 'Europe', duration: '5:09', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3' },
];

export default function MusicPlaylistWidget() {
  const [playingSongId, setPlayingSongId] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Create audio element
    if (!audioRef.current) {
      audioRef.current = new Audio();
      audioRef.current.volume = 0.7;

      // Handle audio end
      audioRef.current.addEventListener('ended', () => {
        setPlayingSongId(null);
      });

      // Handle audio errors
      audioRef.current.addEventListener('error', (e) => {
        console.error('Audio playback error:', e);
        setPlayingSongId(null);
      });
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
      }
    };
  }, []);

  const handlePlayPause = (songId: string) => {
    if (!audioRef.current) return;

    if (playingSongId === songId) {
      // Pause current song
      audioRef.current.pause();
      setPlayingSongId(null);
    } else {
      // Play new song
      const song = workoutPlaylist.find((s) => s.id === songId);
      if (song) {
        audioRef.current.src = song.url;
        audioRef.current.play().catch((error) => {
          console.error('Failed to play audio:', error);
        });
        setPlayingSongId(songId);
      }
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Music className="h-5 w-5" />
          Workout Playlist
        </CardTitle>
        <CardDescription>Curated songs to power your training session</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-3">
            {workoutPlaylist.map((song) => (
              <div
                key={song.id}
                className={`flex items-center justify-between rounded-lg border p-3 transition-colors ${
                  playingSongId === song.id ? 'border-primary bg-primary/5' : 'hover:bg-muted/50'
                }`}
              >
                <div className="flex-1">
                  <p className="font-medium">{song.title}</p>
                  <p className="text-sm text-muted-foreground">{song.artist}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-muted-foreground">{song.duration}</span>
                  <Button
                    variant={playingSongId === song.id ? 'default' : 'outline'}
                    size="icon"
                    onClick={() => handlePlayPause(song.id)}
                    className="min-h-[44px] min-w-[44px]"
                  >
                    {playingSongId === song.id ? (
                      <Pause className="h-4 w-4" />
                    ) : (
                      <Play className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
