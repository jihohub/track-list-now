import { Artist, Track } from "@/types/types";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface FavoritesState {
  allTimeArtists: Artist[];
  allTimeTracks: Track[];
  currentArtists: Artist[];
  currentTracks: Track[];
  addAllTimeArtist: (artist: Artist) => void;
  addAllTimeTrack: (track: Track) => void;
  addCurrentArtist: (artist: Artist) => void;
  addCurrentTrack: (track: Track) => void;
  removeAllTimeArtist: (id: string) => void;
  removeAllTimeTrack: (id: string) => void;
  removeCurrentArtist: (id: string) => void;
  removeCurrentTrack: (id: string) => void;
}

export const useFavoritesStore = create(
  persist<FavoritesState>(
    (set) => ({
      allTimeArtists: [],
      allTimeTracks: [],
      currentArtists: [],
      currentTracks: [],

      addAllTimeArtist: (artist) =>
        set((state) => ({
          allTimeArtists: [...state.allTimeArtists, artist],
        })),
      addAllTimeTrack: (track) =>
        set((state) => ({
          allTimeTracks: [...state.allTimeTracks, track],
        })),
      addCurrentArtist: (artist) =>
        set((state) => ({
          currentArtists: [...state.currentArtists, artist],
        })),
      addCurrentTrack: (track) =>
        set((state) => ({
          currentTracks: [...state.currentTracks, track],
        })),

      removeAllTimeArtist: (id) =>
        set((state) => ({
          allTimeArtists: state.allTimeArtists.filter(
            (artist) => artist.id !== id,
          ),
        })),
      removeAllTimeTrack: (id) =>
        set((state) => ({
          allTimeTracks: state.allTimeTracks.filter((track) => track.id !== id),
        })),
      removeCurrentArtist: (id) =>
        set((state) => ({
          currentArtists: state.currentArtists.filter(
            (artist) => artist.id !== id,
          ),
        })),
      removeCurrentTrack: (id) =>
        set((state) => ({
          currentTracks: state.currentTracks.filter((track) => track.id !== id),
        })),
    }),
    {
      name: "favorites-storage",
      getStorage: () => localStorage,
    },
  ),
);
