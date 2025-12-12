import { Track } from "@/lib/deezer";
import { Play, Pause, ExternalLink } from "lucide-react";
import { motion } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";

interface TrackCardProps {
  track: Track;
  isPlaying: boolean;
  onPlayToggle: () => void;
}

export function TrackCard({ track, isPlaying, onPlayToggle }: TrackCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className={cn(
        "group relative bg-card rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 border border-border/50",
        isPlaying && "ring-2 ring-primary ring-offset-2"
      )}
    >
      <div className="p-3 flex items-center gap-4">
        {/* Album Art with Play Overlay */}
        <div className="relative w-16 h-16 md:w-20 md:h-20 flex-shrink-0 rounded-lg overflow-hidden bg-muted">
          <img 
            src={track.album.cover_medium} 
            alt={track.album.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div 
            className={cn(
              "absolute inset-0 flex items-center justify-center bg-black/40 transition-opacity duration-300",
              isPlaying || isHovered ? "opacity-100" : "opacity-0"
            )}
          >
            <button
              onClick={onPlayToggle}
              className="w-10 h-10 rounded-full bg-white/90 text-primary flex items-center justify-center hover:scale-110 transition-transform shadow-lg"
              data-testid={`play-button-${track.id}`}
            >
              {isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" className="ml-0.5" />}
            </button>
          </div>
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-foreground truncate pr-2" title={track.title}>
            {track.title}
          </h3>
          <p className="text-sm text-muted-foreground truncate">{track.artist.name}</p>
        </div>

        {/* Deezer Link */}
        <a 
          href={track.link} 
          target="_blank" 
          rel="noopener noreferrer"
          className="p-2 text-muted-foreground hover:text-primary transition-colors"
          title="Open in Deezer"
        >
          <ExternalLink size={18} />
        </a>
      </div>
      
      {/* Progress Bar (Visual Only for now as we don't have full duration easily accesssible without loading) */}
      {isPlaying && (
        <motion.div 
          className="absolute bottom-0 left-0 h-0.5 bg-primary z-10"
          initial={{ width: "0%" }}
          animate={{ width: "100%" }}
          transition={{ duration: 30, ease: "linear" }}
        />
      )}
    </motion.div>
  );
}
