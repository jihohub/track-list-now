import AlbumsTab from "@/features/artist/components/AlbumsTab";
import ArtistTabs from "@/features/artist/components/ArtistTabs";
import OverviewSection from "@/features/artist/components/OverviewSection";
import TopTracksTab from "@/features/artist/components/TopTracksTab";
import useArtistTabs from "@/features/artist/hooks/useArtistTabs";
import { ArtistPageData } from "@/types/artist";

interface ArtistSectionProps {
  data: ArtistPageData;
  artistId: string;
}

const ArtistSection = ({ data, artistId }: ArtistSectionProps) => {
  const { currentTab, setCurrentTab } = useArtistTabs();

  const renderTabContent = () => {
    switch (currentTab) {
      case "albums":
        return <AlbumsTab artistId={artistId} />;
      // case "related_artists":
      //   return <RelatedArtistsTab artistId={artistId} />;
      case "top_tracks":
      default:
        return <TopTracksTab tracks={data.topTracks.tracks} />;
    }
  };

  return (
    <div>
      <OverviewSection artist={data.artist} />
      <ArtistTabs currentTab={currentTab} setCurrentTab={setCurrentTab} />
      <div className="mt-6">{renderTabContent()}</div>
    </div>
  );
};

export default ArtistSection;
