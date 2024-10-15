import FavoriteSection from "@/features/profile/FavoriteSection";
import SearchModal from "@/features/profile/SearchModal";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import axios from "axios";
import download from "downloadjs";
import * as htmlToImage from "html-to-image";
import { GetServerSideProps } from "next";
import { getServerSession } from "next-auth/next";
import { useSession } from "next-auth/react";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { NextSeo } from "next-seo";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

interface UserFavoriteArtist {
  artistId: string;
  name: string;
  imageUrl: string;
  followers: number;
}

interface UserFavoriteTrack {
  trackId: string;
  name: string;
  albumImageUrl: string;
  artists: string;
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
  viewedUserName: string;
  profileImage: string | null;
  isOwnProfile: boolean;
  userId: number;
}

const isArtist = (
  item: UserFavoriteArtist | UserFavoriteTrack,
): item is UserFavoriteArtist => {
  return (item as UserFavoriteArtist).artistId !== undefined;
};

const isTrack = (
  item: UserFavoriteArtist | UserFavoriteTrack,
): item is UserFavoriteTrack => {
  return (item as UserFavoriteTrack).trackId !== undefined;
};

const sectionKeyMap: Record<keyof UserFavorites, "artistId" | "trackId"> = {
  allTimeArtists: "artistId",
  currentArtists: "artistId",
  allTimeTracks: "trackId",
  currentTracks: "trackId",
};

const fetchUserFavorites = async (userId: number): Promise<UserFavorites> => {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const response = await axios.get(
    `${baseUrl}/api/user-favorites?userId=${userId}`,
  );
  const { allTimeArtists, allTimeTracks, currentArtists, currentTracks } =
    response.data;

  return {
    allTimeArtists,
    allTimeTracks,
    currentArtists,
    currentTracks,
  };
};

const fetchUserData = async (
  userId: number,
): Promise<{ name: string; profileImage: string | null }> => {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const response = await axios.get(`${baseUrl}/api/users?userId=${userId}`);
  const { name, profileImage } = response.data;
  return { name, profileImage };
};

const ProfilePage = ({
  userFavorites,
  viewedUserName,
  profileImage,
  isOwnProfile,
  userId,
}: ProfilePageProps) => {
  const { t } = useTranslation(["common", "profile"]);
  const { data: session } = useSession();
  const [favorites, setFavorites] = useState<UserFavorites>(userFavorites);

  const [isEditing, setIsEditing] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<"artist" | "track" | undefined>(
    undefined,
  );
  const [activeSection, setActiveSection] = useState<
    keyof UserFavorites | undefined
  >(undefined);

  const pageRef = useRef<HTMLDivElement>(null);

  const openModal = (
    type: "artist" | "track",
    section: keyof UserFavorites,
  ) => {
    setModalType(type);
    setActiveSection(section);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalType(undefined);
    setActiveSection(undefined);
  };

  const toggleEditing = () => {
    setIsEditing((prev) => !prev);
  };

  const handleSaveChanges = async () => {
    if (!isOwnProfile || !session?.user?.id) {
      return;
    }

    try {
      await axios.patch("/api/user-favorites", {
        userId: session.user.id,
        allTimeArtists: favorites.allTimeArtists,
        allTimeTracks: favorites.allTimeTracks,
        currentArtists: favorites.currentArtists,
        currentTracks: favorites.currentTracks,
      });

      setIsEditing(false);
    } catch (error) {
      // TODO: 에러 처리
      JSON.stringify(error);
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
        includeQueryParams: true,
        filter,
      })
      .then((dataUrl) => {
        const now = new Date();
        const formattedDate = `${now.getFullYear().toString().slice(2)}${String(
          now.getMonth() + 1,
        ).padStart(2, "0")}${String(now.getDate()).padStart(2, "0")}${String(
          now.getHours(),
        ).padStart(2, "0")}${String(now.getMinutes()).padStart(2, "0")}`;
        const fileName = `${isOwnProfile ? session?.user?.name : viewedUserName}-${formattedDate}.jpeg`;
        download(dataUrl, fileName);
      })
      .catch((error) => {
        // TODO: 에러 처리
        JSON.stringify(error);
      });
  }, [pageRef, session, viewedUserName, isOwnProfile]);

  const handleDelete = (section: keyof UserFavorites, id: string) => {
    const keyToCompare = sectionKeyMap[section];

    setFavorites((prev) => ({
      ...prev,
      [section]: prev[section].filter((item) => {
        if (keyToCompare === "artistId" && isArtist(item)) {
          return item.artistId !== id;
        }
        if (keyToCompare === "trackId" && isTrack(item)) {
          return item.trackId !== id;
        }
        return true;
      }),
    }));
  };

  const handleAddItem = (
    section: keyof UserFavorites,
    item: UserFavoriteArtist | UserFavoriteTrack,
  ) => {
    if (isArtist(item)) {
      setFavorites((prev) => ({
        ...prev,
        [section]: [...prev[section], item],
      }));
    } else if (isTrack(item)) {
      const mappedItem: UserFavoriteTrack = {
        trackId: item.trackId,
        name: item.name,
        albumImageUrl: item.albumImageUrl,
        artists: item.artists,
        popularity: item.popularity,
      };
      setFavorites((prev) => ({
        ...prev,
        [section]: [...prev[section], mappedItem],
      }));
    }
  };

  useEffect(() => {
    setFavorites(userFavorites);
  }, [userFavorites]);

  return (
    <div className="max-w-3xl mx-auto text-white">
      <NextSeo
        title={`Track List Now - ${viewedUserName}`}
        description={`${viewedUserName}'s favorite artists and tracks on Track List Now`}
        openGraph={{
          type: "profile",
          url: `https://www.tracklistnow.com/profile/${userId}`,
          title: `Track List Now - ${viewedUserName}`,
          description: `${viewedUserName}'s favorite artists and tracks`,
          images: [
            {
              url: profileImage || "/default-profile-image.jpg",
              width: 800,
              height: 800,
              alt: `${viewedUserName}'s Profile Image`,
            },
          ],
        }}
        twitter={{
          handle: "@TrackListNow",
          site: "@TrackListNow",
          cardType: "summary_large_image",
        }}
      />
      <div ref={pageRef} className="p-6">
        {isOwnProfile ? (
          <div className="flex flex-col gap-4 text-center mb-4">
            {profileImage ? (
              <Image
                className="rounded-full mx-auto"
                src={profileImage}
                alt={viewedUserName}
                width={100}
                height={100}
              />
            ) : (
              <div className="w-24 h-24">{null}</div>
            )}

            <h1 className="text-3xl font-bold">{viewedUserName}</h1>
          </div>
        ) : (
          <div className="w-[150px] h-[150px]">{null}</div>
        )}

        {isOwnProfile && (
          <div className="flex justify-end mb-6">
            <button
              onClick={isEditing ? handleSaveChanges : toggleEditing}
              className="not-contain bg-sky-800 text-white px-4 py-2 rounded-lg"
              type="button"
            >
              {isEditing
                ? t("save", { ns: "profile" })
                : t("edit", { ns: "profile" })}
            </button>
          </div>
        )}

        <div>
          <FavoriteSection
            title={t("all_time_favorite_artists")}
            items={favorites.allTimeArtists}
            openModal={() => openModal("artist", "allTimeArtists")}
            type="artist"
            isEditing={isOwnProfile && isEditing}
            handleDelete={(id) => handleDelete("allTimeArtists", id)}
          />
          <FavoriteSection
            title={t("all_time_favorite_tracks")}
            items={favorites.allTimeTracks}
            openModal={() => openModal("track", "allTimeTracks")}
            type="track"
            isEditing={isOwnProfile && isEditing}
            handleDelete={(id) => handleDelete("allTimeTracks", id)}
          />
          <FavoriteSection
            title={t("current_favorite_artists")}
            items={favorites.currentArtists}
            openModal={() => openModal("artist", "currentArtists")}
            type="artist"
            isEditing={isOwnProfile && isEditing}
            handleDelete={(id) => handleDelete("currentArtists", id)}
          />
          <FavoriteSection
            title={t("current_favorite_tracks")}
            items={favorites.currentTracks}
            openModal={() => openModal("track", "currentTracks")}
            type="track"
            isEditing={isOwnProfile && isEditing}
            handleDelete={(id) => handleDelete("currentTracks", id)}
          />
        </div>

        {!isEditing && (
          <div className="flex justify-center mt-6">
            <button
              onClick={handleSaveAsImage}
              className="not-contain bg-sky-800 text-white px-4 py-2 rounded-lg"
              type="button"
            >
              {t("to_image", { ns: "profile" })}
            </button>
          </div>
        )}

        {isModalOpen && modalType && activeSection && (
          <SearchModal
            closeModal={closeModal}
            modalType={modalType}
            activeSection={activeSection}
            handleAddItem={(section, item) => {
              handleAddItem(section as keyof UserFavorites, item);
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
  const { userId } = context.params!;
  const parsedUserId = Number(userId);

  const session = await getServerSession(context.req, context.res, authOptions);

  try {
    const [userFavorites, userData] = await Promise.all([
      fetchUserFavorites(parsedUserId),
      fetchUserData(parsedUserId),
    ]);

    const { name: viewedUserName, profileImage } = userData;
    const isOwnProfile = String(session?.user?.id) === String(userId);

    return {
      props: {
        ...(await serverSideTranslations(locale, ["common", "profile"])),
        userFavorites,
        viewedUserName,
        profileImage,
        isOwnProfile,
        userId,
      },
    };
  } catch (error) {
    // eslint-disable-next-line no-console
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
        viewedUserName: "Unknown User",
        profileImage: null,
        isOwnProfile: false,
        userId: 0,
      },
    };
  }
};
