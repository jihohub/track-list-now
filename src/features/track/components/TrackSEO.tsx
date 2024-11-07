import { TrackDetail } from "@/types/track";
import { NextSeo } from "next-seo";

interface TrackSEOProps {
  track: TrackDetail;
  trackId: string;
}

const TrackSEO = ({ track, trackId }: TrackSEOProps) => {
  const trackTitle = track.name;
  const artistNames = track.artists.map((artist) => artist.name).join(", ");

  return (
    <NextSeo
      title={`${trackTitle} - Track List Now`}
      description={`Listen to ${trackTitle} by ${artistNames}. Find information about the album, release date, and duration.`}
      openGraph={{
        type: "music.song",
        url: `https://www.tracklistnow.com/track/${trackId}`,
        title: `${trackTitle} - Track List Now`,
        description: `Listen to ${trackTitle} by ${artistNames}. Find information about the album, release date, and duration.`,
        images: [
          {
            url: track.album.images[0]?.url || "/default-image.jpg",
            width: 800,
            height: 800,
            alt: `${trackTitle} Album Cover`,
          },
        ],
      }}
      twitter={{
        handle: "@TrackListNow",
        site: "@TrackListNow",
        cardType: "summary_large_image",
      }}
    />
  );
};

export default TrackSEO;
