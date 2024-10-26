import ErrorComponent from "@/features/common/ErrorComponent";
import FavoriteSection from "@/features/profile/FavoriteSection";
import SearchModal from "@/features/profile/SearchModal";
import {
  isArtistSection,
  isTrackSection,
  SectionToItemType,
  UserFavoriteArtist,
  UserFavorites,
  UserFavoriteTrack,
} from "@/types/favorite";
import {
  dehydrate,
  QueryClient,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import axios from "axios";
import { saveAs } from "file-saver";
import * as htmlToImage from "html-to-image";
import { GetServerSideProps } from "next";
import { getSession, useSession } from "next-auth/react";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { NextSeo } from "next-seo";
import Image from "next/image";
import { useCallback, useRef, useState } from "react";

interface ProfilePageProps {
  userId: number;
}

const fetchUserFavorites = async (userId: number): Promise<UserFavorites> => {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const response = await axios.get(
    `${baseUrl}/api/user-favorites?userId=${userId}`,
  );
  const { allTimeArtists, allTimeTracks, currentArtists, currentTracks } =
    response.data;

  return {
    allTimeArtists: allTimeArtists ?? [],
    allTimeTracks: allTimeTracks ?? [],
    currentArtists: currentArtists ?? [],
    currentTracks: currentTracks ?? [],
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

const ProfilePage = ({ userId }: ProfilePageProps) => {
  const { t } = useTranslation(["common", "profile"]);
  const { data: session } = useSession();
  const queryClient = useQueryClient();
  const isOwnProfile = userId === Number(session?.user.id);

  const { data: userFavorites, error: userFavoritesError } = useQuery<
    UserFavorites,
    Error
  >({
    queryKey: ["userFavorites", userId],
    queryFn: () => fetchUserFavorites(userId),
    staleTime: 5 * 60 * 1000,
  });

  const { data: userData, error: userDataError } = useQuery<
    { name: string; profileImage: string | null },
    Error
  >({
    queryKey: ["userData", userId],
    queryFn: () => fetchUserData(userId),
    staleTime: 5 * 60 * 1000,
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editedFavorites, setEditedFavorites] = useState<UserFavorites | null>(
    null,
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<"artist" | "track" | undefined>(
    undefined,
  );
  const [activeSection, setActiveSection] = useState<
    keyof UserFavorites | undefined
  >(undefined);

  const pageRef = useRef<HTMLDivElement>(null);

  const mutation = useMutation<UserFavorites, Error, UserFavorites, unknown>({
    mutationFn: async (newFavorites: UserFavorites) => {
      const response = await axios.patch<UserFavorites>("/api/user-favorites", {
        userId: session?.user?.id,
        allTimeArtists: newFavorites.allTimeArtists,
        allTimeTracks: newFavorites.allTimeTracks,
        currentArtists: newFavorites.currentArtists,
        currentTracks: newFavorites.currentTracks,
      });
      return response.data;
    },
    onSuccess: () => {
      // 관련 쿼리 무효화 및 상태 업데이트
      queryClient.invalidateQueries({ queryKey: ["userFavorites", userId] });
      setIsEditing(false);
      setEditedFavorites(null);
    },
    onError: (error: unknown) => {
      // TODO: 에러 처리
      JSON.stringify(error);
    },
  });

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
    if (!isEditing) {
      // 편집 모드로 전환될 때, 현재 favorites를 로컬 상태로 복사
      setEditedFavorites(userFavorites ? { ...userFavorites } : null);
    } else {
      // 편집 모드에서 나올 때, 로컬 상태 초기화
      setEditedFavorites(null);
    }
    setIsEditing((prev) => !prev);
  };

  const handleSaveChanges = () => {
    if (!isOwnProfile || !session?.user?.id || !editedFavorites) {
      return;
    }
    mutation.mutate(editedFavorites);
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
        const fileName = `${isOwnProfile && session?.user?.name}-${formattedDate}.jpeg`;
        saveAs(dataUrl, fileName);
      })
      .catch((error: unknown) => {
        // TODO: 에러 처리
        JSON.stringify(error);
      });
  }, [pageRef, session, isOwnProfile]);

  const handleDelete = <S extends keyof UserFavorites>(
    section: S,
    id: string,
  ) => {
    if (!editedFavorites) return;

    const updatedFavorites: UserFavorites = { ...editedFavorites };

    if (isArtistSection(section)) {
      updatedFavorites[section] = (
        updatedFavorites[section] as UserFavoriteArtist[]
      ).filter((item) => item.artistId !== id);
    } else if (isTrackSection(section)) {
      updatedFavorites[section] = (
        updatedFavorites[section] as UserFavoriteTrack[]
      ).filter((item) => item.trackId !== id);
    }

    setEditedFavorites(updatedFavorites);
  };

  const handleAddItem = <S extends keyof UserFavorites>(
    section: S,
    item: SectionToItemType<S>,
  ) => {
    if (!editedFavorites) return;

    const updatedFavorites: UserFavorites = { ...editedFavorites };

    if (isArtistSection(section)) {
      updatedFavorites[section] = [
        ...(updatedFavorites[section] as UserFavoriteArtist[]),
        item as UserFavoriteArtist,
      ];
    } else if (isTrackSection(section)) {
      updatedFavorites[section] = [
        ...(updatedFavorites[section] as UserFavoriteTrack[]),
        item as UserFavoriteTrack,
      ];
    }

    setEditedFavorites(updatedFavorites);
  };

  const viewedUserName = userData?.name || "Unknown User";
  const profileImageUrl = userData?.profileImage || null;

  // 편집 모드일 때는 editedFavorites를, 아닐 때는 userFavorites를 사용
  const displayFavorites =
    isEditing && editedFavorites ? editedFavorites : userFavorites;

  if (userFavoritesError || userDataError) {
    return (
      <ErrorComponent
        message={`Error loading data: ${userFavoritesError?.message || userDataError?.message}`}
      />
    );
  }

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
              url: profileImageUrl || "/default-profile-image.jpg",
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
            {profileImageUrl ? (
              <Image
                className="rounded-full mx-auto"
                src={profileImageUrl}
                alt={`${viewedUserName}'s Profile Image`}
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
              className="not-contain bg-persianBlue text-white px-4 py-2 rounded-lg"
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
            items={displayFavorites?.allTimeArtists || []}
            openModal={() => openModal("artist", "allTimeArtists")}
            type="artist"
            isEditing={isOwnProfile && isEditing}
            handleDelete={(id) => handleDelete("allTimeArtists", id)}
          />
          <FavoriteSection
            title={t("all_time_favorite_tracks")}
            items={displayFavorites?.allTimeTracks || []}
            openModal={() => openModal("track", "allTimeTracks")}
            type="track"
            isEditing={isOwnProfile && isEditing}
            handleDelete={(id) => handleDelete("allTimeTracks", id)}
          />
          <FavoriteSection
            title={t("current_favorite_artists")}
            items={displayFavorites?.currentArtists || []}
            openModal={() => openModal("artist", "currentArtists")}
            type="artist"
            isEditing={isOwnProfile && isEditing}
            handleDelete={(id) => handleDelete("currentArtists", id)}
          />
          <FavoriteSection
            title={t("current_favorite_tracks")}
            items={displayFavorites?.currentTracks || []}
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
              className="not-contain bg-persianBlue text-white px-4 py-2 rounded-lg"
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
  const session = await getSession(context);

  if (!session) {
    return {
      redirect: {
        destination: "/api/auth/signin",
        permanent: false,
      },
    };
  }

  const locale = context.locale ?? "ko";
  const userId = Number(session.user.id);

  const queryClient = new QueryClient();

  try {
    await Promise.all([
      queryClient.prefetchQuery({
        queryKey: ["userFavorites", userId],
        queryFn: () => fetchUserFavorites(userId),
        staleTime: 5 * 60 * 1000,
      }),
      queryClient.prefetchQuery({
        queryKey: ["userData", userId],
        queryFn: () => fetchUserData(userId),
        staleTime: 5 * 60 * 1000,
      }),
    ]);

    return {
      props: {
        ...(await serverSideTranslations(locale, ["common", "profile"])),
        dehydratedState: dehydrate(queryClient),
        userId,
      },
    };
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("서버 사이드 데이터 페칭 실패:", error);

    return {
      props: {
        ...(await serverSideTranslations(locale, ["common", "profile"])),
        dehydratedState: dehydrate(queryClient),
        userId: 0,
      },
    };
  }
};
