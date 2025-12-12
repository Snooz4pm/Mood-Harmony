import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface MoodSelectorProps {
  onSelect: (mood: string) => void;
  selected: string | null;
}

const moods = [
  { 
    name: "Happy", 
    color: "from-yellow-400 to-orange-400", 
    shadow: "shadow-yellow-400/50",
    icon: "☀️" 
  },
  { 
    name: "Sad", 
    color: "from-blue-400 to-indigo-500", 
    shadow: "shadow-blue-400/50",
    icon: "🌧️" 
  },
  { 
    name: "Energetic", 
    color: "from-red-500 to-pink-600", 
    shadow: "shadow-red-500/50",
    icon: "⚡" 
  },
  { 
    name: "Chill", 
    color: "from-emerald-400 to-teal-500", 
    shadow: "shadow-emerald-400/50",
    icon: "☕" 
  },
];

export function MoodSelector({ onSelect, selected }: MoodSelectorProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-3xl mx-auto p-4">
      {moods.map((mood) => (
        <motion.button
          key={mood.name}
          whileHover={{ scale: 1.05, y: -5 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onSelect(mood.name)}
          className={cn(
            "relative overflow-hidden rounded-2xl p-6 h-32 flex flex-col items-center justify-center gap-3 transition-all duration-300",
            "bg-gradient-to-br text-white shadow-lg border border-white/20",
            mood.color,
            selected === mood.name ? "ring-4 ring-offset-2 ring-offset-background ring-primary scale-105" : "opacity-90 hover:opacity-100 hover:shadow-xl",
            mood.shadow
          )}
        >
          <span className="text-4xl filter drop-shadow-md">{mood.icon}</span>
          <span className="font-bold text-lg tracking-wide drop-shadow-sm">{mood.name}</span>
          
          {selected === mood.name && (
            <motion.div
              layoutId="active-indicator"
              className="absolute inset-0 bg-white/20"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            />
          )}
        </motion.button>
      ))}
    </div>
  );
}
