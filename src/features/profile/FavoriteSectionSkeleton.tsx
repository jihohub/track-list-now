const FavoriteSectionSkeleton = () => {
  return (
    <div className="bg-zinc-800 p-6 rounded-lg shadow-md animate-pulse mb-8">
      <div className="h-6 bg-gray-500 rounded mb-4 w-1/3" />
      <div className="grid grid-cols-3 gap-4">
        {Array.from({ length: 3 }).map((_, index) => (
          // eslint-disable-next-line react/no-array-index-key
          <div key={index} className="flex flex-col items-center">
            <div
              className={`w-24 h-24 bg-gray-500 ${index % 2 === 0 ? "rounded-full" : "rounded-lg"}`}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default FavoriteSectionSkeleton;
