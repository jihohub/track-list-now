import AlbumsTab from "@/features/artist/components/AlbumsTab";
import ArtistTabs from "@/features/artist/components/ArtistTabs";
import OverviewSection from "@/features/artist/components/OverviewSection";
import RelatedArtistsTab from "@/features/artist/components/RelatedArtistsTab";
import TopTracksTab from "@/features/artist/components/TopTracksTab";
import { ArtistPageData } from "@/types/artist";
import { useRouter } from "next/router";

interface ArtistSectionProps {
  data: ArtistPageData;
  artistId: string;
}

const ArtistSection = ({ data, artistId }: ArtistSectionProps) => {
  const router = useRouter();
  const { tab = "top_tracks" } = router.query;

  const handleTabChange = (newTab: string) => {
    const query = { ...router.query, tab: newTab };
    router.push(
      {
        pathname: router.pathname,
        query,
      },
      undefined,
      { shallow: true },
    );
  };

  const renderTabContent = () => {
    switch (tab) {
      case "albums":
        return <AlbumsTab artistId={artistId} />;
      case "related_artists":
        return <RelatedArtistsTab artistId={artistId} />;
      case "top_tracks":
      default:
        return <TopTracksTab tracks={data.topTracks.tracks} />;
    }
  };

  return (
    <div>
      <OverviewSection artist={data.artist} />
      <ArtistTabs currentTab={tab as string} onTabChange={handleTabChange} />
      <div className="mt-6">{renderTabContent()}</div>
    </div>
  );
};

export default ArtistSection;
