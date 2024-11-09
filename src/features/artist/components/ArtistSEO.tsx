import { ArtistPageData } from "@/types/artist";
import { NextSeo } from "next-seo";

interface ArtistSEOProps {
  data: ArtistPageData;
  artistId: string;
}

const ArtistSEO = ({ data, artistId }: ArtistSEOProps) => (
  <NextSeo
    title={`${data.artist.name} - Track List Now`}
    description={`Basic Information, Top tracks, Related artists of ${data.artist.name}`}
    openGraph={{
      type: "music.artist",
      url: `https://www.tracklistnow.com/artist/${artistId}`,
      title: `${data.artist.name} - Track List Now`,
      description: `Discover more about ${data.artist.name} on Track List Now!`,
      images: [
        {
          url: data.artist.images[0]?.url || "/default-image.jpg",
          width: 800,
          height: 800,
          alt: `${data.artist.name} Profile Picture`,
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

export default ArtistSEO;
