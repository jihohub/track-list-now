import ProfileHeaderSkeleton from "@/features/profile/components/ProfileHeaderSkeleton";
import Image from "next/image";

interface ProfileHeaderProps {
  viewedUserName?: string;
  profileImageUrl?: string | null;
  isLoading: boolean;
}

const ProfileHeader = ({
  viewedUserName,
  profileImageUrl,
  isLoading,
}: ProfileHeaderProps) => {
  if (isLoading) {
    return <ProfileHeaderSkeleton />;
  }

  return (
    <div className="flex flex-col gap-4 text-center mb-4">
      {profileImageUrl ? (
        <Image
          className="rounded-full mx-auto"
          src={profileImageUrl}
          alt={`${viewedUserName}'s Profile Image`}
          width={100}
          height={100}
          priority
        />
      ) : (
        <div className="w-24 h-24 mx-auto bg-gray-500 rounded-full" />
      )}

      {viewedUserName && (
        <h1 className="text-3xl text-white font-bold">{viewedUserName}</h1>
      )}
    </div>
  );
};

export default ProfileHeader;
