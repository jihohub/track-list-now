// /pages/artist/[artistId].tsx
import ErrorComponent from "@/features/common/ErrorComponent";
import LoadingBar from "@/features/common/LoadingBar";
import TItem from "@/features/common/TItem";
import { dehydrate, QueryClient, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { GetServerSideProps } from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Image from "next/image";
import Link from "next/link";

interface ArtistPageProps {
  artistId: string;
}

const fetchArtistData = async (artistId: string) => {
  const response = await axios.get(`/api/artist/${artistId}`);
  return response.data;
};

const ArtistPage = ({ artistId }: ArtistPageProps) => {
  const { t } = useTranslation("common");

  const { data, error, isLoading } = useQuery({
    queryKey: ["artist", artistId],
    queryFn: () => fetchArtistData(artistId),
    staleTime: 5 * 60 * 1000, // 5분
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
      {/* 아티스트 기본 정보 */}
      <div className="flex flex-col items-center">
        <div className="relative w-[300px] h-[300px] rounded-full overflow-hidden">
          <Image
            src={artist.images[0]?.url || "/default-image.jpg"}
            alt={artist.name}
            fill
            className="rounded-full object-cover"
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

      {/* 탑 트랙 */}
      <div className="mt-8">
        <h2 className="text-2xl font-semibold text-white mb-4">
          {t("top_tracks")}
        </h2>
        <ul className="space-y-4">
          {topTracks.tracks.map((track, index) => (
            <TItem
              key={track.id}
              index={index}
              item={{
                trackId: track.id,
                imageUrl: track.album.images[0]?.url || "/default-image.jpg",
                name: track.name,
                artists: track.artists.map((artist) => artist.name).join(", "), // 아티스트 이름이 필요 없으므로 빈 문자열
              }}
              type="track"
            />
          ))}
        </ul>
      </div>

      {/* 연관 아티스트 */}
      <div className="mt-8">
        <h2 className="text-2xl font-semibold text-white mb-4">
          {t("related_artists")}
        </h2>
        <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
          {relatedArtists.artists.map((relatedArtist) => (
            <li key={relatedArtist.id} className="flex flex-col items-center">
              <Link
                href={`/artist/${relatedArtist.id}`}
                className="flex flex-col items-center"
              >
                {/* 이미지 컨테이너를 정사각형으로 설정 */}
                <div className="relative w-24 h-24">
                  <Image
                    src={relatedArtist.images[0]?.url || "/default-image.jpg"}
                    alt={relatedArtist.name}
                    fill
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
    await queryClient.prefetchQuery(["artist", artistId], () =>
      fetchArtistData(artistId),
    );

    return {
      props: {
        ...(await serverSideTranslations(locale ?? "ko", ["common"])),
        dehydratedState: dehydrate(queryClient),
        artistId,
      },
    };
  } catch (error) {
    console.error("Error in getServerSideProps:", error);
    return {
      props: {
        ...(await serverSideTranslations(locale ?? "ko", ["common"])),
        dehydratedState: dehydrate(queryClient),
        artistId,
      },
    };
  }
};
