// /pages/profile/index.tsx

import FavoriteSection from "@/features/profile/FavoriteSection";
import SearchModal from "@/features/profile/SearchModal";
import axios from "axios";
import download from "downloadjs";
import * as htmlToImage from "html-to-image";
import { GetServerSideProps } from "next";
import { getSession, useSession } from "next-auth/react";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Image from "next/image";
import { useCallback, useRef, useState } from "react";

interface UserFavoriteArtist {
  id: string;
  name: string;
  imageUrl: string;
  followers: number;
}

interface UserFavoriteTrack {
  id: string;
  name: string;
  albumImageUrl: string;
  artists: { name: string }[];
  popularity: number;
}

interface UserFavorites {
  allTimeArtists: UserFavoriteArtist[];
  allTimeTracks: UserFavoriteTrack[];
  currentArtists: UserFavoriteArtist[];
  currentTracks: UserFavoriteTrack[];
}

interface ProfilePageProps {
  userFavorites: UserFavorites;
}

const ProfilePage = ({ userFavorites }: ProfilePageProps) => {
  const { t } = useTranslation(["common", "profile"]);
  const { data: session } = useSession();
  const [favorites, setFavorites] = useState<UserFavorites>(userFavorites);

  const [isEditing, setIsEditing] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<"artist" | "track" | "">("");
  const [activeSection, setActiveSection] = useState<
    "allTimeArtists" | "allTimeTracks" | "currentArtists" | "currentTracks" | ""
  >("");

  const pageRef = useRef<HTMLDivElement>(null);
  const userId = session?.user?.id;

  const openModal = (type: "artist" | "track", section: string) => {
    setModalType(type);
    setActiveSection(section as any);
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
    if (!userId) {
      console.error("User ID is undefined");
      return;
    }

    try {
      await axios.patch("/api/userFavorites", {
        userId,
        allTimeArtists: favorites.allTimeArtists,
        allTimeTracks: favorites.allTimeTracks,
        currentArtists: favorites.currentArtists,
        currentTracks: favorites.currentTracks,
      });
      setIsEditing(false);
      alert("즐겨찾기가 성공적으로 저장되었습니다!");
    } catch (error) {
      console.error("Error saving changes:", error);
      alert("즐겨찾기 저장에 실패했습니다. 다시 시도해주세요.");
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
  }, [pageRef, session]);

  const handleDelete = (section: keyof UserFavorites, id: string) => {
    setFavorites((prev) => ({
      ...prev,
      [section]: prev[section].filter((item) => item.id !== id),
    }));
  };

  const handleAddItem = (
    section: keyof UserFavorites,
    item: UserFavoriteArtist | UserFavoriteTrack,
  ) => {
    setFavorites((prev) => ({
      ...prev,
      [section]: [...prev[section], item],
    }));
  };

  return (
    <div className="max-w-3xl mx-auto text-white">
      <div ref={pageRef} className="p-6">
        {session && (
          <div className="text-center mb-8">
            <Image
              className="rounded-full mx-auto"
              src={session.user?.image || ""}
              alt={session.user?.name || ""}
              width={100}
              height={100}
            />
            <h1 className="text-3xl font-bold">{session.user?.name}</h1>
          </div>
        )}

        <div className="flex justify-end mb-6">
          <button
            onClick={isEditing ? handleSaveChanges : toggleEditing}
            className="not-contain bg-sky-800 text-white px-4 py-2 rounded-lg"
          >
            {isEditing
              ? t("save", { ns: "profile" })
              : t("edit", { ns: "profile" })}
          </button>
        </div>

        <div>
          <FavoriteSection
            title={t("all_time_favorite_artists")}
            items={favorites.allTimeArtists}
            openModal={() => openModal("artist", "allTimeArtists")}
            type="artist"
            isEditing={isEditing}
            handleDelete={(id) => handleDelete("allTimeArtists", id)}
          />
          <FavoriteSection
            title={t("all_time_favorite_tracks")}
            items={favorites.allTimeTracks}
            openModal={() => openModal("track", "allTimeTracks")}
            type="track"
            isEditing={isEditing}
            handleDelete={(id) => handleDelete("allTimeTracks", id)}
          />
          <FavoriteSection
            title={t("current_favorite_artists")}
            items={favorites.currentArtists}
            openModal={() => openModal("artist", "currentArtists")}
            type="artist"
            isEditing={isEditing}
            handleDelete={(id) => handleDelete("currentArtists", id)}
          />
          <FavoriteSection
            title={t("current_favorite_tracks")}
            items={favorites.currentTracks}
            openModal={() => openModal("track", "currentTracks")}
            type="track"
            isEditing={isEditing}
            handleDelete={(id) => handleDelete("currentTracks", id)}
          />
        </div>

        {!isEditing && (
          <div className="flex justify-center mt-6">
            <button
              onClick={handleSaveAsImage}
              className="not-contain bg-sky-800 text-white px-4 py-2 rounded-lg"
            >
              {t("to_image", { ns: "profile" })}
            </button>
          </div>
        )}

        {isModalOpen && (
          <SearchModal
            closeModal={closeModal}
            modalType={modalType}
            activeSection={activeSection}
            handleAddItem={(section, item) => {
              if (
                section === "allTimeArtists" ||
                section === "currentArtists"
              ) {
                handleAddItem(
                  section as keyof UserFavorites,
                  item as UserFavoriteArtist,
                );
              } else {
                handleAddItem(
                  section as keyof UserFavorites,
                  item as UserFavoriteTrack,
                );
              }
            }}
          />
        )}
      </div>
    </div>
  );
};

export default ProfilePage;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const locale = context.locale ?? "ko";
  const session = await getSession(context);

  if (!session?.user?.id) {
    return {
      redirect: {
        destination: "/api/auth/signin",
        permanent: false,
      },
    };
  }

  const userId = session.user.id;

  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/userFavorites?userId=${userId}`,
    );
    const { allTimeArtists, allTimeTracks, currentArtists, currentTracks } =
      response.data;

    const userFavorites: UserFavorites = {
      allTimeArtists,
      allTimeTracks,
      currentArtists,
      currentTracks,
    };

    return {
      props: {
        ...(await serverSideTranslations(locale, ["common", "profile"])),
        userFavorites,
      },
    };
  } catch (error) {
    console.error("서버 사이드 데이터 페칭 실패:", error);
    return {
      props: {
        ...(await serverSideTranslations(locale, ["common", "profile"])),
        userFavorites: {
          allTimeArtists: [],
          allTimeTracks: [],
          currentArtists: [],
          currentTracks: [],
        },
      },
    };
  }
};
