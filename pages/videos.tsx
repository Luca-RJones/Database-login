import { useEffect, useState } from "react";
import { useRouter } from "next/router";
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
  
   
      if (u.hostname.includes("youtu.be")) {
        return u.pathname.replace("/", "");
      }
  
     
      if (u.pathname.startsWith("/shorts/")) {
        return u.pathname.split("/shorts/")[1];
      }
  
   
      if (u.pathname.startsWith("/embed/")) {
        return u.pathname.split("/embed/")[1];
      }
  
      return null;
    } catch {
      return null;
    }
  }
  

export default function VideosPage() {
  const router = useRouter();
  const [videos, setVideos] = useState<VideoRow[]>([]);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    async function loadVideos() {
        const { data, error } = await supabase.rpc("get_random_videos", {
            limit_count: 100,
          });
          
  
      if (error) {
        setLoadError(error.message);
        return;
      }
  
      setVideos(data ?? []);
    }
  
    loadVideos();
  }, []);
  

  
  

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) {
        router.replace("/login");
      }
    });
  }, [router]);

  return (
    <main style={{ padding: 24 }}>
      <h1>Videos</h1>
      <p>COUNT: {videos.length}</p>
      {loadError && <p style={{ color: "red" }}>ERROR: {loadError}</p>}

      
      <div
  style={{
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
    gap: 16,
  }}
>

  {videos.map((video) => {
    const id = getYouTubeId(video.url);

    return (
      <div
        key={video.id}
        style={{
          border: "1px solid #333",
          borderRadius: 8,
          padding: 12,
          maxWidth: 720,
        }}
      >
        {id ? (
          <div
          style={{
            position: "relative",
            width: "100%",
            aspectRatio: "9 / 16",
            background: "#000",
          }}
        >
        
            <iframe
              src={`https://www.youtube.com/embed/${id}`}
              title={video.title}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                border: 0,
              }}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        ) : (
          <p style={{ margin: 0 }}>
            Couldn’t parse video URL.{" "}
            <a href={video.url} target="_blank" rel="noreferrer">
              Open video
            </a>
          </p>
        )}

        <div style={{ marginTop: 10 }}>
          <a href={video.url} target="_blank" rel="noreferrer">
            {video.title}
          </a>
        </div>
      </div>
    );
  })}
</div>



    </main>
  );
}
