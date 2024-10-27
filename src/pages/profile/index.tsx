import ErrorComponent from "@/features/common/ErrorComponent";
import EditControls from "@/features/profile/EditControls";
import FavoriteSections from "@/features/profile/FavoriteSections";
import ProfileHeader from "@/features/profile/ProfileHeader";
import SearchModal from "@/features/profile/SearchModal";
import useProfileActions from "@/hooks/useProfileActions";
import useUserProfile from "@/hooks/useUserProfile";
import { fetchUserData, fetchUserFavorites } from "@/libs/utils/api";
import {
  UserFavoriteArtist,
  UserFavorites,
  UserFavoriteTrack,
} from "@/types/favorite";
import { dehydrate, QueryClient } from "@tanstack/react-query";
import { GetServerSideProps } from "next";
import { getSession, useSession } from "next-auth/react";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { NextSeo } from "next-seo";
import { useRef, useState } from "react";

interface ProfilePageProps {
  userId: number;
}

const ProfilePage = ({ userId }: ProfilePageProps) => {
  const { t } = useTranslation(["common", "profile"]);
  const { data: session } = useSession();

  const {
    userFavorites,
    userFavoritesError,
    isFavoritesLoading,
    userData,
    userDataError,
    isUserDataLoading,
    saveFavorites,
  } = useUserProfile(userId);

  const [isEditing, setIsEditing] = useState(false);
  const [editedFavorites, setEditedFavorites] = useState<UserFavorites | null>(
    null,
  );

  const {
    isModalOpen,
    modalType,
    activeSection,
    openModal,
    closeModal,
    handleDelete,
    handleAddItem,
  } = useProfileActions({
    editedFavorites,
    setEditedFavorites,
  });

  const pageRef = useRef<HTMLDivElement>(null);

  const handleToggleEditing = () => {
    if (!isEditing) {
      // 편집 모드로 전환될 때, 현재 favorites를 로컬 상태로 복사
      setEditedFavorites(userFavorites ? { ...userFavorites } : null);
    } else {
      // 편집 모드에서 나올 때, 로컬 상태 초기화
      setEditedFavorites(null);
    }
    setIsEditing((prev) => !prev);
  };

  // 편집 모드일 때는 editedFavorites를, 아닐 때는 userFavorites를 사용
  const displayFavorites =
    isEditing && editedFavorites ? editedFavorites : userFavorites;

  const handleSaveChanges = async () => {
    if (!session?.user?.id || !editedFavorites) {
      return;
    }
    try {
      await saveFavorites(editedFavorites);
      setIsEditing(false);
      setEditedFavorites(null);
    } catch (error: unknown) {
      JSON.stringify(error);
    }
  };

  const viewedUserName = userData?.name;
  const profileImageUrl = userData?.profileImage;

  if (userFavoritesError || userDataError) {
    return (
      <ErrorComponent
        message={`Error loading data: ${userFavoritesError?.message || userDataError?.message}`}
      />
    );
  }

  const isLoading = isFavoritesLoading || isUserDataLoading;

  const sections: {
    title: string;
    items: UserFavoriteArtist[] | UserFavoriteTrack[];
    type: "artist" | "track";
    openModal: () => void;
    handleDelete: (id: string) => void;
  }[] = [
    {
      title: t("all_time_favorite_artists"),
      items: displayFavorites?.allTimeArtists || [],
      type: "artist",
      openModal: () => openModal("artist", "allTimeArtists"),
      handleDelete: (id: string) => handleDelete("allTimeArtists", id),
    },
    {
      title: t("all_time_favorite_tracks"),
      items: displayFavorites?.allTimeTracks || [],
      type: "track",
      openModal: () => openModal("track", "allTimeTracks"),
      handleDelete: (id: string) => handleDelete("allTimeTracks", id),
    },
    {
      title: t("current_favorite_artists"),
      items: displayFavorites?.currentArtists || [],
      type: "artist",
      openModal: () => openModal("artist", "currentArtists"),
      handleDelete: (id: string) => handleDelete("currentArtists", id),
    },
    {
      title: t("current_favorite_tracks"),
      items: displayFavorites?.currentTracks || [],
      type: "track",
      openModal: () => openModal("track", "currentTracks"),
      handleDelete: (id: string) => handleDelete("currentTracks", id),
    },
  ];

  return (
    <div className="max-w-3xl mx-auto text-white">
      <NextSeo
        title={`${profileImageUrl} - Track List Now`}
        description={`${profileImageUrl}'s favorite artists and tracks on Track List Now`}
        openGraph={{
          type: "profile",
          url: `https://www.tracklistnow.com/profile/${userId}`,
          title: `${profileImageUrl} - Track List Now`,
          description: `${profileImageUrl}'s favorite artists and tracks`,
          images: [
            {
              url: profileImageUrl || "/default-profile-image.jpg",
              width: 800,
              height: 800,
              alt: `${profileImageUrl}'s Profile Image`,
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
        <ProfileHeader
          profileImageUrl={profileImageUrl}
          viewedUserName={viewedUserName}
          isLoading={isLoading}
        />

        <EditControls
          label={
            isEditing
              ? t("save", { ns: "profile" })
              : t("edit", { ns: "profile" })
          }
          isEditing={isEditing}
          toggleEditing={handleToggleEditing}
          handleSaveChanges={handleSaveChanges}
        />

        <FavoriteSections
          sections={sections}
          isEditing={isEditing}
          isLoading={isLoading}
        />

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
