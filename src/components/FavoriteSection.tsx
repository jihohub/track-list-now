import AddIcon from "@/assets/icons/add.svg";
import ArtistIcon from "@/assets/icons/artist.svg";
import TrackIcon from "@/assets/icons/track.svg";

const FavoriteSection = ({
  title,
  items = [],
  openModal,
  type,
  isEditing,
  handleDelete,
}: {
  title: string;
  items: any[];
  openModal: () => void;
  type: string;
  isEditing: boolean;
  handleDelete: (id: string) => void;
}) => (
  // <div className="mb-8">
  <div className="mb-8 bg-zinc-800 p-6 rounded-lg shadow-md">
    <h2 className="text-2xl font-bold mb-4 text-white">{title}</h2>
    <div className="grid grid-cols-3 gap-4">
      {/* 항목이 있을 경우 해당 항목 출력 */}
      {items.map((item, index) => (
        <div key={index} className="relative flex flex-col items-center">
          {item && (
            <div className="relative flex flex-col items-center">
              {/* 아티스트일 경우 동그란 이미지 */}
              {type === "artist" && item.images && item.images.length > 0 && (
                <div className="relative w-24 h-24">
                  <img
                    src={item.images[0].url}
                    alt={item.name}
                    className="w-24 h-24 rounded-full opacity-80" // 불투명도 조정
                  />
                  {isEditing && (
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white text-3xl rounded-full"
                    >
                      &times;
                    </button>
                  )}
                </div>
              )}

              {/* 트랙일 경우 모서리가 둥근 사각형 이미지 */}
              {type === "track" &&
                item.album &&
                item.album.images.length > 0 && (
                  <div className="relative w-24 h-24">
                    <img
                      src={item.album.images[0].url}
                      alt={item.name}
                      className="w-24 h-24 rounded-lg opacity-80" // 불투명도 조정
                    />
                    {isEditing && (
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white text-3xl rounded-lg"
                      >
                        &times;
                      </button>
                    )}
                  </div>
                )}

              {/* 이름과 추가 정보 */}
              <p className="text-white text-sm text-center mt-1 w-24 truncate">
                {item.name}
              </p>
              {type === "artist" && item.followers && (
                <p className="text-gray-400 text-sm text-center mt-1 w-24">
                  {item.followers.total.toLocaleString()} followers
                </p>
              )}
              {type === "track" && item.artists && (
                <p className="text-gray-400 text-sm text-center mt-1 w-24 truncate">
                  {item.artists.map((artist) => artist.name).join(", ")}
                </p>
              )}
            </div>
          )}
        </div>
      ))}

      {/* 추가할 빈 슬롯을 3개까지 보여줌. */}
      {items.length < 3 &&
        Array(3 - items.length)
          .fill(null)
          .map((_, idx) => (
            <div
              key={`add-button-${idx}`}
              className="flex flex-col items-center"
            >
              <button
                onClick={isEditing ? openModal : undefined} // 수정 상태에서만 클릭 가능
                className={`flex items-center justify-center w-24 h-24 ${
                  type === "track" ? "rounded-lg" : "rounded-full"
                }`}
                style={{
                  backgroundColor: "black", // 검은색 배경
                  cursor: isEditing ? "pointer" : "default", // 수정 상태가 아니면 클릭 불가
                }}
                disabled={!isEditing} // 수정 상태가 아니면 클릭 불가
              >
                {isEditing ? (
                  <AddIcon className="w-8 h-8 text-white" /> // 수정 상태일 때 "+" 아이콘
                ) : type === "artist" ? (
                  <ArtistIcon className="w-8 h-8 text-gray-500" /> // 가수 아이콘
                ) : (
                  <TrackIcon className="w-8 h-8 text-gray-500" /> // 노래 아이콘
                )}
              </button>
            </div>
          ))}
    </div>
  </div>
);

export default FavoriteSection;
