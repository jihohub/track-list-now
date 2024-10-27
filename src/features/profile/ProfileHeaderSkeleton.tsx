const ProfileHeaderSkeleton = () => {
  return (
    <div className="animate-pulse">
      <div className="flex flex-col gap-4 text-center mb-8">
        <div className="w-24 h-24 bg-gray-500 rounded-full mx-auto" />
        <div className="h-6 bg-gray-500 rounded mt-2 w-1/2 mx-auto" />
      </div>
    </div>
  );
};

export default ProfileHeaderSkeleton;
