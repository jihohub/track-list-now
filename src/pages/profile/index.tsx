import FavoriteSection from "@/components/FavoriteSection";
import SearchModal from "@/components/SearchModal";
import spotifyApi from "@/lib/axios";
import { useFavoritesStore } from "@/store/favoritesStore";
import { Artist, Track, UserFavorite } from "@/types/types";
import axios from "axios";
import download from "downloadjs";
import * as htmlToImage from "html-to-image";
import { GetServerSideProps } from "next";
import { useSession } from "next-auth/react";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useCallback, useEffect, useRef, useState } from "react";

const ProfilePage = () => {
  const { t } = useTranslation("common");
  const { data: session } = useSession();

  const {
    allTimeArtists,
    allTimeTracks,
    currentArtists,
    currentTracks,
    addAllTimeArtist,
    addAllTimeTrack,
    addCurrentArtist,
    addCurrentTrack,
    removeAllTimeArtist,
    removeAllTimeTrack,
    removeCurrentArtist,
    removeCurrentTrack,
  } = useFavoritesStore();

  const [isEditing, setIsEditing] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<"artist" | "track" | "">("");
  const [activeSection, setActiveSection] = useState<
    "allTimeArtists" | "allTimeTracks" | "currentArtists" | "currentTracks" | ""
  >("");

  const pageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchSpotifyDataBatch = async (
      type: "artists" | "tracks",
      ids: string[],
    ): Promise<Artist[] | Track[]> => {
      if (ids.length === 0) {
        return [];
      }

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
        console.error("Spotify 데이터 요청 중 오류:", error);
        return [];
      }
    };

    const fetchData = async () => {
      try {
        const userId = session?.user?.id;
        if (userId) {
          const response = await axios.get(
            `/api/userFavorites?userId=${userId}`,
          );
          const favorites: UserFavorite[] = response.data;

          const atfArtistIds = favorites
            .filter((item) => item.favoriteType === "atfArtists")
            .map((item) => item.artistId as string);
          const atfTrackIds = favorites
            .filter((item) => item.favoriteType === "atfTracks")
            .map((item) => item.trackId as string);
          const cfArtistIds = favorites
            .filter((item) => item.favoriteType === "cfArtists")
            .map((item) => item.artistId as string);
          const cfTrackIds = favorites
            .filter((item) => item.favoriteType === "cfTracks")
            .map((item) => item.trackId as string);

          const atfArtistsData = await fetchSpotifyDataBatch(
            "artists",
            atfArtistIds,
          );
          const formattedAtfArtists: Artist[] = atfArtistsData.map(
            (artistData, index) => ({
              id: atfArtistIds[index],
              name: artistData.name,
              images: artistData.images,
              followers: artistData.followers,
            }),
          );
          formattedAtfArtists.forEach((artist) => {
            const exists = allTimeArtists.find((a) => a.id === artist.id);
            if (!exists) addAllTimeArtist(artist);
          });

          const atfTracksData = await fetchSpotifyDataBatch(
            "tracks",
            atfTrackIds,
          );
          const formattedAtfTracks: Track[] = atfTracksData.map(
            (trackData, index) => ({
              id: atfTrackIds[index],
              name: trackData.name,
              album: trackData.album,
              artists: trackData.artists,
              popularity: trackData.popularity,
            }),
          );
          formattedAtfTracks.forEach((track) => {
            const exists = allTimeTracks.find((t) => t.id === track.id);
            if (!exists) addAllTimeTrack(track);
          });

          const cfArtistsData = await fetchSpotifyDataBatch(
            "artists",
            cfArtistIds,
          );
          const formattedCfArtists: Artist[] = cfArtistsData.map(
            (artistData, index) => ({
              id: cfArtistIds[index],
              name: artistData.name,
              images: artistData.images,
              followers: artistData.followers,
            }),
          );
          formattedCfArtists.forEach((artist) => {
            const exists = currentArtists.find((a) => a.id === artist.id);
            if (!exists) addCurrentArtist(artist);
          });

          const cfTracksData = await fetchSpotifyDataBatch(
            "tracks",
            cfTrackIds,
          );
          const formattedCfTracks: Track[] = cfTracksData.map(
            (trackData, index) => ({
              id: cfTrackIds[index],
              name: trackData.name,
              album: trackData.album,
              artists: trackData.artists,
              popularity: trackData.popularity,
            }),
          );
          formattedCfTracks.forEach((track) => {
            const exists = currentTracks.find((t) => t.id === track.id);
            if (!exists) addCurrentTrack(track);
          });
        }
      } catch (error) {
        console.error("데이터 가져오기 실패:", error);
      }
    };

    fetchData();
  }, [
    session,
    allTimeArtists,
    allTimeTracks,
    currentArtists,
    currentTracks,
    addAllTimeArtist,
    addAllTimeTrack,
    addCurrentArtist,
    addCurrentTrack,
  ]);

  const openModal = (type: "artist" | "track", section: string) => {
    setModalType(type);
    setActiveSection(section);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalType("artist");
    setActiveSection("");
  };

  const toggleEditing = () => {
    setIsEditing((prev) => !prev);
  };

  const handleSaveChanges = async () => {
    try {
      const userId = session?.user?.id;

      const formattedAllTimeArtists = allTimeArtists.map((artist) => ({
        id: artist.id,
        followers: artist.followers?.total ?? 0,
      }));

      const formattedAllTimeTracks = allTimeTracks.map((track) => ({
        id: track.id,
        popularity: track.popularity ?? 0,
      }));

      const formattedCurrentArtists = currentArtists.map((artist) => ({
        id: artist.id,
        followers: artist.followers?.total ?? 0,
      }));

      const formattedCurrentTracks = currentTracks.map((track) => ({
        id: track.id,
        popularity: track.popularity ?? 0,
      }));

      const response = await axios.patch("/api/userFavorites", {
        userId,
        allTimeArtists: formattedAllTimeArtists,
        allTimeTracks: formattedAllTimeTracks,
        currentArtists: formattedCurrentArtists,
        currentTracks: formattedCurrentTracks,
      });

      setIsEditing(false);
    } catch (error) {
      console.error("Error saving changes:", error);
    }
  };

  const handleSaveAsImage = useCallback(() => {
    if (pageRef.current === null) return;

    const filter = (node: HTMLElement) => {
      const exclusionClasses = ["not-contain"];
      return !exclusionClasses.some((classname) =>
        node.classList?.contains(classname),
      );
    };

    htmlToImage
      .toJpeg(pageRef.current, {
        cacheBust: true,
        filter,
      })
      .then((dataUrl) => {
        const now = new Date();
        const formattedDate = `${now.getFullYear().toString().slice(2)}${String(
          now.getMonth() + 1,
        ).padStart(2, "0")}${String(now.getDate()).padStart(2, "0")}${String(
          now.getHours(),
        ).padStart(2, "0")}${String(now.getMinutes()).padStart(2, "0")}`;
        const fileName = `${session?.user?.name}-${formattedDate}.jpeg`;
        download(dataUrl, fileName);
      })
      .catch((error) => {
        console.error("이미지로 저장 실패:", error);
      });
  }, [pageRef]);

  return (
    <div className="max-w-3xl mx-auto text-white">
      <div ref={pageRef} className="p-6">
        {session && (
          <div className="text-center mb-8">
            <img
              className="w-24 h-24 rounded-full mx-auto"
              src={session.user?.image || ""}
              alt={session.user?.name || ""}
            />
            <h1 className="text-3xl font-bold">{session.user?.name}</h1>
            <p className="text-gray-400">{session.user?.email}</p>
          </div>
        )}

        <div className="flex justify-end mb-6">
          <button
            onClick={isEditing ? handleSaveChanges : toggleEditing}
            className="not-contain bg-sky-800 text-white px-4 py-2 rounded-lg"
          >
            {isEditing ? t("save") : t("edit")}
          </button>
        </div>

        <div>
          <FavoriteSection
            title={t("all_time_favorite_artists")}
            items={allTimeArtists}
            openModal={() => openModal("artist", "allTimeArtists")}
            type="artist"
            isEditing={isEditing}
            handleDelete={(id) => removeAllTimeArtist(id)}
          />
          <FavoriteSection
            title={t("all_time_favorite_tracks")}
            items={allTimeTracks}
            openModal={() => openModal("track", "allTimeTracks")}
            type="track"
            isEditing={isEditing}
            handleDelete={(id) => removeAllTimeTrack(id)}
          />
          <FavoriteSection
            title={t("current_favorite_artists")}
            items={currentArtists}
            openModal={() => openModal("artist", "currentArtists")}
            type="artist"
            isEditing={isEditing}
            handleDelete={(id) => removeCurrentArtist(id)}
          />
          <FavoriteSection
            title={t("current_favorite_tracks")}
            items={currentTracks}
            openModal={() => openModal("track", "currentTracks")}
            type="track"
            isEditing={isEditing}
            handleDelete={(id) => removeCurrentTrack(id)}
          />
        </div>

        {!isEditing && (
          <div className="flex justify-center mt-6">
            <button
              onClick={handleSaveAsImage}
              className="not-contain bg-sky-800 text-white px-4 py-2 rounded-lg"
            >
              {t("to_image")}
            </button>
          </div>
        )}

        {isModalOpen && (
          <SearchModal
            closeModal={closeModal}
            modalType={modalType}
            activeSection={activeSection}
            handleAddItem={(section, item) => {
              if (section === "allTimeArtists") {
                addAllTimeArtist(item);
              } else if (section === "allTimeTracks") {
                addAllTimeTrack(item);
              } else if (section === "currentArtists") {
                addCurrentArtist(item);
              } else if (section === "currentTracks") {
                addCurrentTrack(item);
              }
            }}
          />
        )}
      </div>
    </div>
  );
};

export default ProfilePage;

export const getServerSideProps: GetServerSideProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale ?? "ko", ["common"])),
  },
});
