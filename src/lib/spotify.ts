import spotifyApi from "@/lib/axios";
import { Artist, Track } from "@/types/types";

export const fetchSpotifyDataBatch = async (
  type: "artists" | "tracks",
  ids: string[],
): Promise<Artist[] | Track[]> => {
  if (ids.length === 0) return [];

  try {
    if (ids.length === 1) {
      const result = await spotifyApi.get(`/${type}/${ids[0]}`);
      return [result.data];
    }

    const result = await spotifyApi.get(`/${type}`, {
      params: { ids: ids.join(",") },
    });
    return result.data[type === "tracks" ? "tracks" : "artists"];
  } catch (error) {
    console.error("Error fetching Spotify data:", error);
    return [];
  }
};
