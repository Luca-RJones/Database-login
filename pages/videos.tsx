import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";


type VideoRow = {
  id: number;     
  title: string;  
  url: string;    
};


function getYouTubeId(url: string) {
  try {
    
    const u = new URL(url); 

    const v = u.searchParams.get("v");
    if (v) return v;

    const lastPart = u.pathname.split("/").pop(); 
    return lastPart || null; 
  } catch {
   
    return null;
  }
}

export default function VideosPage() {
  const [videos, setVideos] = useState<VideoRow[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {

    async function loadVideos() {
     
      setError("");

      const { data, error } = await supabase.rpc("get_random_videos", {
        limit_count: 100,
      });

     
      if (error) {
        setError(error.message);
        return;
      }

      setVideos(data ?? []);
    }

    loadVideos();
  }, []);

  return (
    <main style={{ padding: 24 }}>
    
      <h1>Videos</h1>

      
      {error && <p style={{ color: "red" }}>ERROR: {error}</p>}

      
      <div style={{ display: "grid", gap: 16 }}>
        
        {videos.map((video) => {
          
          const id = getYouTubeId(video.url);
        
          if (!id) {
            return (
              <p key={video.id}>
                Couldn’t parse video URL
              </p>
            );
          }

          return (
            <div
              key={video.id}
              style={{
                border: "1px solid #333",
                padding: 12,
              }}
            >
              <p>{video.title}</p>
        
              <iframe
                src={`https://www.youtube.com/embed/${id}`}
                title={video.title}
                style={{
                  width: "100%",
                  aspectRatio: "16 / 9",
                  border: 0,
                }}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          );
        })}
      </div>
    </main>
  );
}
