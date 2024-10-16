import ErrorComponent from "@/features/common/ErrorComponent";
import LoadingBar from "@/features/common/LoadingBar";
import TImage from "@/features/common/TImage";
import TItem from "@/features/common/TItem";
import { dehydrate, QueryClient, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { GetServerSideProps } from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { NextSeo } from "next-seo";
import Link from "next/link";

interface ArtistPageProps {
  artistId: string;
}

interface ArtistPageData {
  artist: {
    name: string;
    images: { url: string }[];
    genres: string[];
  };
  topTracks: {
    tracks: {
      id: string;
      name: string;
      album: { images: { url: string }[] };
      artists: { name: string }[];
    }[];
  };
  relatedArtists: {
    artists: {
      id: string;
      name: string;
      images: { url: string }[];
    }[];
  };
}

interface ArtistPageProps {
  artistId: string;
}

const fetchArtistData = async (artistId: string): Promise<ArtistPageData> => {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const response = await axios.get(`${baseUrl}/api/artist/${artistId}`);
  return response.data;
};

const ArtistPage = ({ artistId }: ArtistPageProps) => {
  const { t } = useTranslation(["common", "artist"]);

  const { data, error, isLoading } = useQuery({
    queryKey: ["artist", artistId],
    queryFn: () => fetchArtistData(artistId),
    staleTime: 5 * 60 * 1000,
  });

  if (isLoading) {
    return <LoadingBar />;
  }

  if (error) {
    return <ErrorComponent message={`Error loading data: ${error.message}`} />;
  }

  if (!data || !data.artist) {
    return <div className="text-center text-gray-400">{t("no_data")}</div>;
  }

  const { artist, topTracks, relatedArtists } = data;

  return (
    <div className="max-w-4xl mx-auto p-6 mt-8 bg-zinc-800 rounded-lg shadow-md">
      <NextSeo
        title={`Track List Now - ${artist.name}`}
        description={`Basic Information, Top tracks, Related artists of ${artist.name}`}
        openGraph={{
          type: "music.artist",
          url: `https://www.tracklistnow.com/artist/${artistId}`,
          title: `Track List Now - ${artist.name}`,
          description: `Discover more about ${artist.name} on Track List Now!`,
          images: [
            {
              url: artist.images[0]?.url || "/default-image.jpg",
              width: 800,
              height: 800,
              alt: `${artist.name} Profile Picture`,
            },
          ],
        }}
        twitter={{
          handle: "@TrackListNow",
          site: "@TrackListNow",
          cardType: "summary_large_image",
        }}
      />
      {/* 아티스트 기본 정보 */}
      <div className="flex flex-col items-center">
        <div className="relative w-[300px] h-[300px] rounded-full overflow-hidden">
          <TImage
            imageUrl={artist.images[0]?.url || "/default-image.jpg"}
            type="artist"
            alt={artist.name}
            size="w-[300px] h-[300px]"
            className="rounded-full overflow-hidden"
          />
        </div>
        <h1 className="text-4xl font-bold text-white mt-4">{artist.name}</h1>

        {/* Genres: 각 장르를 스타일링된 태그로 감싸기 */}
        <div className="flex flex-wrap justify-center mt-2 space-x-2">
          {artist.genres.length > 0 ? (
            artist.genres.map((genre) => (
              <span
                key={genre}
                className="bg-gray-700 text-gray-300 px-3 py-1 rounded-md text-sm mb-2"
              >
                {genre}
              </span>
            ))
          ) : (
            <span className="text-gray-400 text-sm">N/A</span>
          )}
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-2xl font-semibold text-white mb-4">
          {t("top_tracks", { ns: "artist" })}
        </h2>
        <ul className="space-y-4">
          {topTracks.tracks.map((track, index) => (
            <TItem
              key={track.id}
              index={index}
              item={{
                track: {
                  id: 0,
                  trackId: track.id,
                  name: track.name,
                  albumImageUrl: track.album.images[0].url,
                  artists: track.artists.map((a) => a.name).join(", "),
                  popularity: 0,
                },
              }}
              type="track"
            />
          ))}
        </ul>
      </div>

      <div className="mt-8">
        <h2 className="text-2xl font-semibold text-white mb-4">
          {t("related_artists", { ns: "artist" })}
        </h2>
        <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
          {relatedArtists.artists.map((relatedArtist) => (
            <li key={relatedArtist.id} className="flex flex-col items-center">
              <Link
                href={`/artist/${relatedArtist.id}`}
                className="flex flex-col items-center"
              >
                <div className="relative w-24 h-24">
                  <TImage
                    imageUrl={
                      relatedArtist.images[0]?.url || "/default-image.jpg"
                    }
                    type="artist"
                    alt={relatedArtist.name}
                    size="w-24 h-24"
                    className="rounded-full object-cover"
                  />
                </div>
                <span className="text-white mt-3 text-center font-medium">
                  {relatedArtist.name}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ArtistPage;

export const getServerSideProps: GetServerSideProps = async ({
  locale,
  params,
}) => {
  const queryClient = new QueryClient();
  const artistId = params?.artistId as string;

  try {
    await queryClient.prefetchQuery({
      queryKey: ["artist", artistId],
      queryFn: () => fetchArtistData(artistId),
      staleTime: 5 * 60 * 1000,
    });

    return {
      props: {
        ...(await serverSideTranslations(locale ?? "ko", ["common", "artist"])),
        dehydratedState: dehydrate(queryClient),
        artistId,
      },
    };
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Error in getServerSideProps:", error);

    return {
      props: {
        ...(await serverSideTranslations(locale ?? "ko", ["common", "artist"])),
        dehydratedState: dehydrate(queryClient),
        artistId,
      },
    };
  }
};
