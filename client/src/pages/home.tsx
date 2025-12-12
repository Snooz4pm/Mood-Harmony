import { useState, useRef, useEffect } from "react";
import { MoodSelector } from "@/components/MoodSelector";
import { TrackCard } from "@/components/TrackCard";
import { searchTracks, Track } from "@/lib/deezer";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, Music, Volume2, VolumeX, Sparkles, Shuffle } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";

export default function Home() {
  const [currentMood, setCurrentMood] = useState<string | null>(null);
  const [tracks, setTracks] = useState<Track[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [playingTrackId, setPlayingTrackId] = useState<number | null>(null);
  const [volume, setVolume] = useState([50]);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Initialize audio
    audioRef.current = new Audio();
    audioRef.current.volume = volume[0] / 100;
    
    // Handle track end
    audioRef.current.onended = () => {
      setPlayingTrackId(null);
    };

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume[0] / 100;
    }
  }, [volume]);

  const handleMoodSelect = async (mood: string) => {
    setCurrentMood(mood);
    setIsLoading(true);
    setPlayingTrackId(null); // Stop current track
    if (audioRef.current) audioRef.current.pause();

    try {
      const results = await searchTracks(mood);
      setTracks(results);
    } catch (error) {
      console.error("Error fetching tracks", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleShuffle = () => {
    setTracks(prev => [...prev].sort(() => Math.random() - 0.5));
  };

  const togglePlay = (track: Track) => {
    if (!audioRef.current) return;

    if (playingTrackId === track.id) {
      audioRef.current.pause();
      setPlayingTrackId(null);
    } else {
      audioRef.current.src = track.preview;
      audioRef.current.play().catch(e => console.error("Play failed", e));
      setPlayingTrackId(track.id);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground pb-20 font-sans selection:bg-primary/20">
      {/* Header */}
      <header className="sticky top-0 z-50 glass border-b border-border/40 transition-all duration-300">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.location.reload()}>
            <div className="bg-primary/10 p-2 rounded-lg">
              <Music className="text-primary w-6 h-6" />
            </div>
            <h1 className="font-bold text-xl tracking-tight">Moodify</h1>
          </div>
          
          <div className="flex items-center gap-4">
             {/* Volume Control - Desktop */}
             <div className="hidden md:flex items-center gap-2 w-32">
                {volume[0] === 0 ? <VolumeX size={18} className="text-muted-foreground" /> : <Volume2 size={18} className="text-muted-foreground" />}
                <Slider 
                  value={volume} 
                  onValueChange={setVolume} 
                  max={100} 
                  step={1} 
                  className="cursor-pointer"
                />
             </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 md:py-12 flex flex-col items-center">
        {/* Hero Section */}
        <div className="text-center mb-12 max-w-2xl mx-auto space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4"
          >
            <Sparkles size={14} />
            <span>AI-Powered Recommendations</span>
          </motion.div>
          
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/60 tracking-tight"
          >
            How are you feeling?
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-muted-foreground text-lg md:text-xl"
          >
            Select your mood and let the music match your vibe.
          </motion.p>
        </div>

        {/* Mood Selector */}
        <MoodSelector onSelect={handleMoodSelect} selected={currentMood} />

        {/* Results Area */}
        <div className="w-full max-w-5xl mt-12 min-h-[400px]">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
              <Loader2 className="w-10 h-10 animate-spin mb-4 text-primary" />
              <p className="animate-pulse">Curating your playlist...</p>
            </div>
          ) : tracks.length > 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-6"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/50 pb-4">
                <h3 className="text-2xl font-semibold flex items-center gap-2">
                  <span className="text-3xl">
                    {currentMood === "Happy" && "☀️"}
                    {currentMood === "Sad" && "🌧️"}
                    {currentMood === "Energetic" && "⚡"}
                    {currentMood === "Chill" && "☕"}
                  </span>
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
                    {currentMood} Playlist
                  </span>
                </h3>
                
                <div className="flex items-center gap-3">
                  <span className="text-sm text-muted-foreground font-medium bg-muted px-2 py-1 rounded-md">
                    {tracks.length} tracks
                  </span>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleShuffle}
                    className="gap-2 hover:bg-primary/10 hover:text-primary hover:border-primary/20"
                  >
                    <Shuffle size={16} />
                    Shuffle
                  </Button>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <AnimatePresence mode="popLayout">
                  {tracks.map((track, index) => (
                    <motion.div
                      layout
                      key={track.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.2, delay: index * 0.03 }}
                    >
                      <TrackCard 
                        track={track} 
                        isPlaying={playingTrackId === track.id}
                        onPlayToggle={() => togglePlay(track)}
                      />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </motion.div>
          ) : currentMood && !isLoading ? (
             <div className="text-center py-20 text-muted-foreground bg-muted/30 rounded-3xl border-2 border-dashed border-muted">
               <p>No tracks found. Try another mood.</p>
             </div>
          ) : null}
        </div>
      </main>
      
      {/* Floating Volume Control - Mobile */}
      <div className="md:hidden fixed bottom-6 right-6 z-50">
        <div className="glass p-4 rounded-full shadow-xl flex items-center gap-3 border border-white/20">
           {volume[0] === 0 ? <VolumeX size={20} className="text-primary" /> : <Volume2 size={20} className="text-primary" />}
           <Slider 
              value={volume} 
              onValueChange={setVolume} 
              max={100} 
              step={1} 
              className="w-24"
            />
        </div>
      </div>
    </div>
  );
}
