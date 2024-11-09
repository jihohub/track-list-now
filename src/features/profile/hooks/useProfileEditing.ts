import errorLogger from "@/libs/utils/errorLogger";
import { AppError, ProfileError } from "@/types/error";
import { UserFavorites } from "@/types/favorite";
import { UseMutateFunction } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useState } from "react";

const useProfileEditing = (
  userId: number,
  userFavorites: UserFavorites | null | undefined,
  saveFavorites: UseMutateFunction<
    UserFavorites,
    Error,
    UserFavorites,
    unknown
  >,
) => {
  const { data: session } = useSession();
  const [isEditing, setIsEditing] = useState(false);
  const [editedFavorites, setEditedFavorites] = useState<UserFavorites | null>(
    null,
  );

  const handleError = (error: unknown, componentStack: string) => {
    if (error instanceof Error) {
      errorLogger(error, { componentStack });
    } else {
      errorLogger(
        new AppError(
          typeof error === "string" ? error : "An unknown error occurred",
          {
            severity: "error",
            componentStack,
            timestamp: Date.now(),
          },
        ),
        { componentStack },
      );
    }
  };

  const handleToggleEditing = () => {
    try {
      if (!session?.user?.id || session.user.id !== userId) {
        throw new ProfileError(
          "Unauthorized editing attempt",
          {
            severity: "warning",
            statusCode: 403,
            componentStack: "useProfileEditing.handleToggleEditing",
          },
          {
            userId,
            sessionUserId: session?.user?.id,
            action: "toggleEditing",
            timestamp: new Date().toISOString(),
          },
        );
      }

      if (!isEditing) {
        setEditedFavorites(userFavorites ? { ...userFavorites } : null);
      } else {
        setEditedFavorites(null);
      }
      setIsEditing((prev) => !prev);
    } catch (error) {
      handleError(error, "useProfileEditing.handleToggleEditing");
    }
  };

  const handleSaveChanges = async () => {
    try {
      if (!session?.user?.id || !editedFavorites) {
        throw new ProfileError(
          "Invalid save attempt",
          {
            severity: "error",
            statusCode: 400,
            componentStack: "useProfileEditing.handleSaveChanges",
          },
          {
            userId,
            hasSession: !!session?.user?.id,
            hasEditedFavorites: !!editedFavorites,
            action: "saveChanges",
            timestamp: new Date().toISOString(),
          },
        );
      }

      await saveFavorites(editedFavorites);
      setIsEditing(false);
      setEditedFavorites(null);
    } catch (error) {
      handleError(error, "useProfileEditing.handleSaveChanges");
    }
  };

  return {
    isEditing,
    editedFavorites,
    setEditedFavorites,
    handleToggleEditing,
    handleSaveChanges,
    displayFavorites:
      isEditing && editedFavorites ? editedFavorites : userFavorites,
  };
};

export default useProfileEditing;
