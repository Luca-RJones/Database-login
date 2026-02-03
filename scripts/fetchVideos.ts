import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";


  const SEARCH_TERMS = ["a", "e", "i", "o", "u", "the", "how", "music", "game", "vlog"];


dotenv.config({ path: ".env.local" });

const adminSupabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
  
  
async function testYoutube() {
    const REGION_CODES = ["US", "GB", "CA", "AU", "NZ", "IN", "JP", "KR", "DE", "BR"];

    const randomQuery =
    SEARCH_TERMS[Math.floor(Math.random() * SEARCH_TERMS.length)];
  
  console.log("USING QUERY:", randomQuery);
  

const randomRegion =
  REGION_CODES[Math.floor(Math.random() * REGION_CODES.length)];


console.log("USING REGION:", randomRegion);

  

const url =
  "https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=50" +
  "&q=" + encodeURIComponent(randomQuery) +
  "&regionCode=" + randomRegion +
  "&key=" + process.env.YOUTUBE_API_KEY;



  const res = await fetch(url);
  const data = await res.json();
  console.log("PAGE 1 FIRST VIDEO ID:", data.items?.[0]?.id);

  if (!data.items) {
    console.log("YOUTUBE ERROR RESPONSE:", data);
    return;
  }
  
  if (!data.nextPageToken) {
    console.log("No nextPageToken, stopping after first page.");
    return;
  }
  
  console.log("NEXT PAGE TOKEN:", data.nextPageToken);
  const page2Url =
  "https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=50" +
  "&q=" + encodeURIComponent(randomQuery) +
  "&regionCode=" + randomRegion +
  "&key=" + process.env.YOUTUBE_API_KEY +
  "&pageToken=" + data.nextPageToken;




const res2 = await fetch(page2Url);
const data2 = await res2.json();
const allItems = [...data.items, ...data2.items];

console.log("TOTAL ITEMS:", allItems.length);
console.log("PAGE 2 FIRST TITLE:", data2.items[0].snippet.title);

  const rowsToInsert: {
    video_id: string;
    title: string;
    url: string;
    published_at: string;
  }[] = [];
  
  
  
  for (const item of allItems) {
    const videoId = item.id.videoId;
    const title = item.snippet.title;
    const watchUrl = "https://www.youtube.com/watch?v=" + videoId;
    const publishedAt = item.snippet.publishedAt;

    rowsToInsert.push({
        video_id: videoId,
      title: title,
      url: watchUrl,
      published_at: publishedAt,
    });

  
    console.log("TITLE:", title);
    console.log("VIDEO ID:", videoId);
    console.log("URL:", watchUrl);
    console.log("-----");
  }
  console.log("ROWS TO INSERT:", rowsToInsert.length);

  const { data: upserted, error } = await adminSupabase
  .from("videos")
  .upsert(rowsToInsert, { onConflict: "video_id" })
  .select("video_id");




if (error) {
  console.log("INSERT ERROR:", error.message);
  return;
}
console.log("UPSERT RETURNED ROWS:", upserted?.length ?? 0);

console.log("Inserted videos into Supabase ✅");


 

  
}

console.log("Running YouTube test...");
testYoutube();
