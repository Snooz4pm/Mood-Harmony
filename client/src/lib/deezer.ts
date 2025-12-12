export interface Track {
  id: number;
  title: string;
  artist: {
    name: string;
    picture_medium: string;
  };
  album: {
    title: string;
    cover_medium: string;
  };
  preview: string;
  link: string;
}

export const searchTracks = async (mood: string): Promise<Track[]> => {
  const queryMap: Record<string, string> = {
    Happy: 'happy pop hits',
    Sad: 'sad acoustic',
    Energetic: 'high energy workout',
    Chill: 'lofi chill beats',
  };
  
  const query = queryMap[mood] || mood;
  
  try {
    // Using a reliable CORS proxy. 
    // Alternative: 'https://api.allorigins.win/get?url=' + encodeURIComponent(...)
    const response = await fetch(`https://corsproxy.io/?` + encodeURIComponent(`https://api.deezer.com/search?q=${query}&limit=25`));
    
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    
    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error("Failed to fetch tracks:", error);
    return [];
  }
};
