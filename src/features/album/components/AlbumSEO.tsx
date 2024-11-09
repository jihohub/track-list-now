import { SimplifiedAlbum } from "@/types/album";
import { NextSeo } from "next-seo";

interface AlbumSEOProps {
  album: SimplifiedAlbum;
  albumId: string;
}

const AlbumSEO = ({ album, albumId }: AlbumSEOProps) => (
  <NextSeo
    title={`${album.name} - Track List Now`}
    description={`Listen to ${album.name} by ${album.artists.map((artist) => artist.name).join(", ")}. Released on ${album.releaseDate}`}
    openGraph={{
      type: "music.album",
      url: `https://www.tracklistnow.com/album/${albumId}`,
      title: `${album.name} - Track List Now`,
      description: `Album by ${album.artists.map((artist) => artist.name).join(", ")}. Features ${album.totalTracks} tracks.`,
      images: [
        {
          url: album.images[0]?.url || "/default-image.jpg",
          width: 800,
          height: 800,
          alt: `${album.name} Album Cover`,
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

export default AlbumSEO;
