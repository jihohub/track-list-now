// services/fetchSpotifyDataBatch.ts
import axiosInstance from "@/libs/axios/axiosInstance";
import { SpotifyArtist, SpotifyTrack } from "@/types/types";

async function fetchSpotifyDataBatch<T extends "artists" | "tracks">(
  type: T,
  ids: string[],
): Promise<T extends "artists" ? SpotifyArtist[] : SpotifyTrack[]> {
  if (ids.length === 0) return [];

  try {
    if (ids.length === 1) {
      const result = await axiosInstance.get(`/${type}/${ids[0]}`);
      return [result.data];
    }

    const result = await axiosInstance.get(`/${type}`, {
      params: { ids: ids.join(",") },
    });

    if (type === "artists") {
      return result.data.artists as SpotifyArtist[];
    }
    return result.data.tracks as SpotifyTrack[];
  } catch (error) {
    console.error("Error fetching Spotify data:", error);
    return [];
  }
}

export default fetchSpotifyDataBatch;
