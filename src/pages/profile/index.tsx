import FavoriteSection from "@/components/FavoriteSection";
import SearchModal from "@/components/SearchModal";
import { useFavoritesStore } from "@/store/favoritesStore"; // zustand 스토어
import { useSession } from "next-auth/react";
import { useState } from "react";

const ProfilePage = () => {
  const { data: session } = useSession();
  const allTimeArtists = useFavoritesStore((state) => state.allTimeArtists);
  const allTimeTracks = useFavoritesStore((state) => state.allTimeTracks);
  const currentArtists = useFavoritesStore((state) => state.currentArtists);
  const currentTracks = useFavoritesStore((state) => state.currentTracks);

  const addAllTimeArtist = useFavoritesStore((state) => state.addAllTimeArtist);
  const addAllTimeTrack = useFavoritesStore((state) => state.addAllTimeTrack);
  const addCurrentArtist = useFavoritesStore((state) => state.addCurrentArtist);
  const addCurrentTrack = useFavoritesStore((state) => state.addCurrentTrack);

  const removeAllTimeArtist = useFavoritesStore(
    (state) => state.removeAllTimeArtist
  );
  const removeAllTimeTrack = useFavoritesStore(
    (state) => state.removeAllTimeTrack
  );
  const removeCurrentArtist = useFavoritesStore(
    (state) => state.removeCurrentArtist
  );
  const removeCurrentTrack = useFavoritesStore(
    (state) => state.removeCurrentTrack
  );

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState(""); // artist or track
  const [activeSection, setActiveSection] = useState(""); // 현재 섹션
  const [isEditing, setIsEditing] = useState(false); // 수정 모드 상태

  const openModal = (type: string, section: string) => {
    setModalType(type);
    setActiveSection(section);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalType("");
    setActiveSection("");
  };

  const toggleEditing = () => {
    setIsEditing((prev) => !prev);
  };

  // handleAddItem 함수 정의
  const handleAddItem = (section: string, item: any) => {
    if (section === "allTimeArtists") {
      addAllTimeArtist(item);
    } else if (section === "allTimeTracks") {
      addAllTimeTrack(item);
    } else if (section === "currentArtists") {
      addCurrentArtist(item);
    } else if (section === "currentTracks") {
      addCurrentTrack(item);
    }
  };

  // 페이지를 이미지로 저장하는 함수 (추후 구현)
  const handleSaveImage = () => {
    // 이미지 저장 로직을 여기에 추가
    console.log("이미지로 저장!");
  };

  return (
    <div className="max-w-4xl mx-auto p-6 text-white">
      {session && (
        <div className="text-center mb-8">
          <img
            className="w-24 h-24 rounded-full mx-auto"
            src={session.user?.image || ""}
            alt={session.user?.name || ""}
          />
          <h1 className="text-3xl font-bold">{session.user?.name}</h1>
          <p className="text-gray-400">{session.user?.email}</p>
        </div>
      )}

      {/* 버튼 섹션 */}
      <div className="mb-6 flex flex-col items-center">
        <button
          onClick={handleSaveImage}
          className="bg-green-500 text-white px-4 py-2 rounded-lg mb-4"
        >
          현재 페이지를 이미지로 저장 🖼
        </button>

        <button
          onClick={toggleEditing}
          className="bg-blue-800 text-white px-4 py-2 rounded-lg"
        >
          {isEditing ? "저장" : "수정"}
        </button>
      </div>

      {/* Favorite Sections */}
      <FavoriteSection
        title="평생 최애 아티스트 (All-Time Favorite Artists)"
        items={allTimeArtists}
        openModal={() => openModal("artist", "allTimeArtists")}
        type="artist"
        isEditing={isEditing}
        handleDelete={removeAllTimeArtist}
      />
      <FavoriteSection
        title="평생 최애 곡 (All-Time Favorite Tracks)"
        items={allTimeTracks}
        openModal={() => openModal("track", "allTimeTracks")}
        type="track"
        isEditing={isEditing}
        handleDelete={removeAllTimeTrack}
      />
      <FavoriteSection
        title="요즘 최애 아티스트 (Current Favorite Artists)"
        items={currentArtists}
        openModal={() => openModal("artist", "currentArtists")}
        type="artist"
        isEditing={isEditing}
        handleDelete={removeCurrentArtist}
      />
      <FavoriteSection
        title="요즘 최애 곡 (Current Favorite Tracks)"
        items={currentTracks}
        openModal={() => openModal("track", "currentTracks")}
        type="track"
        isEditing={isEditing}
        handleDelete={removeCurrentTrack}
      />

      {/* Search Modal */}
      {isModalOpen && (
        <SearchModal
          closeModal={closeModal}
          modalType={modalType}
          activeSection={activeSection}
          handleAddItem={handleAddItem} // handleAddItem 함수 전달
        />
      )}
    </div>
  );
};

export default ProfilePage;
