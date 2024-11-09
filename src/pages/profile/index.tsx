import ErrorComponent from "@/features/common/components/ErrorComponent";
import ProfileSection from "@/features/profile/components/ProfileSection";
import ProfileSEO from "@/features/profile/components/ProfileSEO";
import useProfileActions from "@/features/profile/hooks/useProfileActions";
import useProfileEditing from "@/features/profile/hooks/useProfileEditing";
import useProfileSections from "@/features/profile/hooks/useProfileSections";
import useUserProfile, {
  fetchUserData,
  fetchUserFavorites,
} from "@/features/profile/queries/useUserProfile";
import errorLogger from "@/libs/utils/errorLogger";
import handlePageError from "@/libs/utils/handlePageError";
import { ProfileError } from "@/types/error";
import { dehydrate, QueryClient } from "@tanstack/react-query";
import { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useRef } from "react";

interface ProfilePageProps {
  userId: number;
}

const ProfilePage = ({ userId }: ProfilePageProps) => {
  const pageRef = useRef<HTMLDivElement>(null);

  const {
    userFavorites,
    userFavoritesError,
    isFavoritesLoading,
    userData,
    userDataError,
    isUserDataLoading,
    saveFavorites,
  } = useUserProfile(userId);

  const {
    isEditing,
    editedFavorites,
    setEditedFavorites,
    handleToggleEditing,
    handleSaveChanges,
    displayFavorites,
  } = useProfileEditing(userId, userFavorites, saveFavorites);

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

  const sections = useProfileSections(
    displayFavorites,
    openModal,
    handleDelete,
  );

  if (userFavoritesError || userDataError) {
    const errorMessage = handlePageError(userFavoritesError || userDataError);
    return <ErrorComponent message={errorMessage} />;
  }

  const isLoading = isFavoritesLoading || isUserDataLoading;

  const viewedUserName = userData?.name;
  const profileImageUrl = userData?.profileImage;

  return (
    <div className="max-w-4xl mx-auto p-6 mt-6 bg-zinc-800 rounded-lg shadow-md">
      <ProfileSEO
        viewedUserName={viewedUserName}
        profileImageUrl={profileImageUrl}
        userId={userId}
      />
      <ProfileSection
        viewedUserName={userData?.name}
        profileImageUrl={userData?.profileImage}
        isLoading={isLoading}
        isEditing={isEditing}
        editedFavorites={editedFavorites}
        sections={sections}
        pageRef={pageRef}
        isModalOpen={isModalOpen}
        modalType={modalType}
        activeSection={activeSection}
        handleToggleEditing={handleToggleEditing}
        handleSaveChanges={handleSaveChanges}
        closeModal={closeModal}
        handleAddItem={handleAddItem}
      />
    </div>
  );
};

export default ProfilePage;

export const getServerSideProps: GetServerSideProps = async (context) => {
  try {
    const session = await getSession(context);
    const locale = context.locale ?? "ko";

    if (!session) {
      throw new ProfileError(
        "Unauthenticated access attempt",
        {
          severity: "warning",
          statusCode: 401,
          componentStack: "getServerSideProps",
        },
        {
          action: "getServerSideProps",
          path: context.resolvedUrl,
        },
      );
    }

    if (!session.user?.id) {
      throw new ProfileError(
        "Session exists but no user ID found",
        {
          severity: "error",
          statusCode: 500,
          componentStack: "getServerSideProps",
        },
        {
          action: "getServerSideProps",
          sessionData: session,
        },
      );
    }

    const userId = Number(session.user.id);
    const queryClient = new QueryClient();

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
        ...(await serverSideTranslations(locale, [
          "common",
          "profile",
          "error",
        ])),
        dehydratedState: dehydrate(queryClient),
        userId,
      },
    };
  } catch (error) {
    if (error instanceof ProfileError) {
      errorLogger(error, { componentStack: "getServerSideProps" });

      if (error.getStatusCode() === 401) {
        return {
          redirect: {
            destination: "/api/auth/signin",
            permanent: false,
          },
        };
      }
    } else {
      errorLogger(
        new ProfileError(
          "Server-side rendering failed",
          {
            severity: "error",
            statusCode: 500,
            componentStack: "getServerSideProps",
          },
          {
            originalError:
              error instanceof Error ? error.message : "Unknown error",
            action: "getServerSideProps",
          },
        ),
      );
    }

    return {
      redirect: {
        destination: "/error",
        permanent: false,
      },
    };
  }
};
