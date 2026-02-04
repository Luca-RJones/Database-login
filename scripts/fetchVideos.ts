import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";


  const SEARCH_TERMS = ["a", "e", "i", "o", "u", "the", "how", "music", "game", "vlog"];


dotenv.config({ path: ".env.local" });

//creates the admin supabase client.
const adminSupabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
  
  
async function testYoutube() {
    const REGION_CODES = ["US", "GB", "CA", "AU", "NZ", "IN", "JP", "KR", "DE", "BR"];

    const randomQuery =
    SEARCH_TERMS[Math.floor(Math.random() * SEARCH_TERMS.length)];
  
  
    const randomRegion =
    REGION_CODES[Math.floor(Math.random() * REGION_CODES.length)];


  
//defines the first page search url.
const url =
  "https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=50" +
  "&q=" + encodeURIComponent(randomQuery) +
  "&regionCode=" + randomRegion +
  "&key=" + process.env.YOUTUBE_API_KEY;


  const res = await fetch(url);
  const data = await res.json();
  

  if (!data.items) {
    console.log("YOUTUBE ERROR RESPONSE:", data);
    return;
  }

  
  //defines the second page search url.
  const page2Url =
  "https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=50" +
  "&q=" + encodeURIComponent(randomQuery) +
  "&regionCode=" + randomRegion +
  "&key=" + process.env.YOUTUBE_API_KEY +
  "&pageToken=" + data.nextPageToken;



//fetches the second page.
const res2 = await fetch(page2Url);
const data2 = await res2.json();
const allItems = [...data.items, ...data2.items];

//defines the blueprint for rowsToInsert.
  const rowsToInsert: {
    video_id: string;
    title: string;
    url: string;
    published_at: string;
  }[] = [];
  
  
  //extracts from the items.
  for (const item of allItems) {
    const videoId = item.id.videoId;
    const title = item.snippet.title;
    const watchUrl = "https://www.youtube.com/watch?v=" + videoId;
    const publishedAt = item.snippet.publishedAt;


    //adds the rows to the array one at a time.
    rowsToInsert.push({
        video_id: videoId,
      title: title,
      url: watchUrl,
      published_at: publishedAt,
    });

  
   
  }
//inserts or updates the rows into the database. And gives feedback.
  const { data: error } = await adminSupabase
  .from("videos")
  .upsert(rowsToInsert, { onConflict: "video_id" })
  




if (error) {
  console.log("INSERT ERROR:", error);
  return;
}





 

  
}


testYoutube();
