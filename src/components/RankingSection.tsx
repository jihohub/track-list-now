import React from "react";

interface RankingSectionProps {
  title: string;
  data: any[];
  type: "artist" | "track";
}

const RankingSection: React.FC<RankingSectionProps> = ({
  title,
  data,
  type,
}) => {
  const renderList = (data: any[], type: "artist" | "track") => (
    <ul>
      {data.map((item, index) => (
        <li key={index} className="mb-4">
          <div className="flex items-center">
            {/* 아티스트 또는 앨범 이미지 */}
            <img
              className={`w-16 h-16 mr-4 ${
                type === "artist" ? "rounded-full" : "rounded-lg"
              }`}
              src={
                type === "artist"
                  ? item.images[0].url
                  : item.album.images[0].url
              }
              alt={item.name}
            />
            <div>
              <h3 className="text-lg text-white font-semibold">{item.name}</h3>
              {/* 아티스트 팔로워 수 또는 트랙의 아티스트 이름 */}
              <p className="text-sm text-gray-300">
                {type === "artist"
                  ? `${item.followers.total.toLocaleString()} followers`
                  : item.artists.map((artist: any) => artist.name).join(", ")}
              </p>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );

  return (
    <div className="bg-zinc-800 p-6 rounded-lg shadow-md">
      <h2 className="text-2xl text-white font-bold mb-4">{title}</h2>
      {renderList(data, type)}
      <button className="text-blue-300 mt-4">See More</button>
    </div>
  );
};

export default RankingSection;
