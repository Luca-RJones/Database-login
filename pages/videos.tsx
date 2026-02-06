import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/router";



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

//state to store the videos and error
export default function VideosPage() {
  const [videos, setVideos] = useState<VideoRow[]>([]);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    async function guard() {
      const { data } = await supabase.auth.getUser();
  
      if (!data.user) {
        router.replace("/login");
        return;
      }
    }
  
    guard();
  }, [router]);
  

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
    <main className="p-6">
    
      <h1 className="text-2xl font-bold">Videos </h1>

      
      {error && <p className="text-red-600 mb-4">ERROR: {error}</p>}

      
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">

        
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
                className="border border-grey-300 rounded-lg p-3 bg-black"
              
            >
              <p>{video.title}</p>
        
              <iframe
                src={`https://www.youtube.com/embed/${id}`}
                title={video.title}
                className="w-full aspect-video border-0 rounded-md"
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
