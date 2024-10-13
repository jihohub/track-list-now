import { create } from "zustand";
import { persist } from "zustand/middleware";

interface Artist {
  id: string;
  name: string;
  images: { url: string }[];
  followers?: { total: number };
}

interface Track {
  id: string;
  name: string;
  album: { images: { url: string }[] };
  artists: Artist[];
}

interface RankingState {
  allTimeArtists: Artist[];
  allTimeTracks: Track[];
  currentArtists: Artist[];
  currentTracks: Track[];
  addAllTimeArtist: (artist: Artist) => void;
  addAllTimeTrack: (track: Track) => void;
  addCurrentArtist: (artist: Artist) => void;
  addCurrentTrack: (track: Track) => void;
}

const useRankingStore = create(
  persist<RankingState>(
    (set) => ({
      allTimeArtists: [],
      allTimeTracks: [],
      currentArtists: [],
      currentTracks: [],

      addAllTimeArtist: (artist) =>
        set(() => ({
          allTimeArtists: artist,
        })),
      addAllTimeTrack: (track) =>
        set(() => ({
          allTimeTracks: track,
        })),
      addCurrentArtist: (artist) =>
        set(() => ({
          currentArtists: artist,
        })),
      addCurrentTrack: (track) =>
        set(() => ({
          currentTracks: track,
        })),
    }),
    {
      name: "ranking-storage",
      getStorage: () => localStorage,
    },
  ),
);

export default useRankingStore;
