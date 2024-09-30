import RankingSection from "@/components/RankingSection"; // 컴포넌트 경로에 맞게 조정
import spotify from "@/lib/axios";
import { useEffect, useState } from "react";

const MainPage = () => {
  const [allTimeArtists, setAllTimeArtists] = useState([]);
  const [allTimeTracks, setAllTimeTracks] = useState([]);
  const [currentArtists, setCurrentArtists] = useState([]);
  const [currentTracks, setCurrentTracks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchFavoriteData = async () => {
    try {
      const allTimeArtistsResponse = await spotify.get(
        "/artists?ids=2CIMQHirSU0MQqyYHq0eOx,57dN52uHvrHOxijzpIgu3E,1vCWHaC5f2uS3yhpwWbIA6"
      );
      const allTimeTracksResponse = await spotify.get(
        "/tracks?ids=7ouMYWpwJ422jRcDASZB7P,4VqPOruhp5EdPBeR92t6lQ,2takcwOaAZWiXQijPHIx7B"
      );
      const currentArtistsResponse = await spotify.get(
        "/artists?ids=2CIMQHirSU0MQqyYHq0eOx,57dN52uHvrHOxijzpIgu3E,1vCWHaC5f2uS3yhpwWbIA6"
      );
      const currentTracksResponse = await spotify.get(
        "/tracks?ids=7ouMYWpwJ422jRcDASZB7P,4VqPOruhp5EdPBeR92t6lQ,2takcwOaAZWiXQijPHIx7B"
      );

      setAllTimeArtists(allTimeArtistsResponse.data.artists);
      setAllTimeTracks(allTimeTracksResponse.data.tracks);
      setCurrentArtists(currentArtistsResponse.data.artists);
      setCurrentTracks(currentTracksResponse.data.tracks);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFavoriteData();
  }, []);

  if (isLoading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="max-w-5xl mx-auto p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
      <RankingSection
        title="All-Time Favorite Artists"
        data={allTimeArtists}
        type="artist"
      />
      <RankingSection
        title="All-Time Favorite Tracks"
        data={allTimeTracks}
        type="track"
      />
      <RankingSection
        title="Current Favorite Artists"
        data={currentArtists}
        type="artist"
      />
      <RankingSection
        title="Current Favorite Tracks"
        data={currentTracks}
        type="track"
      />
    </div>
  );
};

export default MainPage;
