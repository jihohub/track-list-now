import ErrorComponent from "@/features/common/ErrorComponent";
import LoadingBar from "@/features/common/LoadingBar";
import { TrackDetail } from "@/types/types";
import { dehydrate, QueryClient, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { GetServerSideProps } from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { NextSeo } from "next-seo";
import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";

interface TrackPageProps {
  trackId: string;
}

const fetchTrackDetail = async (trackId: string): Promise<TrackDetail> => {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const response = await axios.get(`${baseUrl}/api/track/${trackId}`);
  return response.data;
};

const TrackPage = ({ trackId }: TrackPageProps) => {
  const { t } = useTranslation(["common", "track"]);
  const audioRef = useRef<HTMLAudioElement>(null);

  const {
    data: track,
    error,
    isLoading,
  } = useQuery<TrackDetail, Error>({
    queryKey: ["track", trackId],
    queryFn: () => fetchTrackDetail(trackId),
    staleTime: 5 * 60 * 1000,
  });

  if (isLoading) {
    return <LoadingBar />;
  }

  if (error) {
    return <ErrorComponent message={`Error loading data: ${error.message}`} />;
  }

  if (!track) {
    return <div className="text-center text-gray-400">{t("no_data")}</div>;
  }

  const trackTitle = track.name;
  const artistNames = track.artists.map((artist) => artist.name).join(", ");

  return (
    <div className="max-w-4xl mx-auto p-6 mt-8 bg-zinc-800 rounded-lg shadow-md">
      <NextSeo
        title={`Track List Now - ${trackTitle}`}
        description={`Listen to ${trackTitle} by ${artistNames}. Find information about the album, release date, and duration.`}
        openGraph={{
          type: "music.song",
          url: `https://www.tracklistnow.com/track/${trackId}`,
          title: `Track List Now - ${trackTitle}`,
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
      <div className="flex flex-col items-center">
        <Image
          src={track.album.images[0]?.url || "/default-image.jpg"}
          alt={track.name}
          width={300}
          height={300}
          className="rounded-md"
        />
        <h1 className="text-4xl font-bold text-white mt-4">{track.name}</h1>
        <div className="w-80">
          <p className="text-gray-400 mt-2">
            {t("artists", { ns: "track" })}:{" "}
            {track.artists.map((artist, index) => (
              <span key={artist.id} className="inline-flex items-center">
                <Link href={`/artist/${artist.id}`}>
                  <span className="text-green-500 hover:underline">
                    {artist.name}
                  </span>
                </Link>
                {index < track.artists.length - 1 && (
                  <span className="ml-1 mr-2">,</span>
                )}
              </span>
            ))}
          </p>
          <p className="text-gray-400 mt-1">
            {t("album", { ns: "track" })}: {track.album.name}
          </p>
          <p className="text-gray-400 mt-1">
            {t("release_date", { ns: "track" })}: {track.album.release_date}
          </p>
          <p className="text-gray-400 mt-1">
            {t("duration", { ns: "track" })}:{" "}
            {Math.floor(track.duration_ms / 60000)}:
            {`0${Math.floor((track.duration_ms % 60000) / 1000)}`.slice(-2)}
          </p>
        </div>
        {track.preview_url && (
          /* eslint-disable jsx-a11y/media-has-caption */
          <audio controls className="mt-4 w-80" ref={audioRef}>
            <source src={track.preview_url} type="audio/mpeg" />
            Your browser does not support the audio element.
          </audio>
        )}
      </div>
    </div>
  );
};

export default TrackPage;

export const getServerSideProps: GetServerSideProps = async ({
  locale,
  params,
}) => {
  const queryClient = new QueryClient();
  const trackId = params?.trackId as string;

  try {
    await queryClient.prefetchQuery({
      queryKey: ["track", trackId],
      queryFn: () => fetchTrackDetail(trackId),
      staleTime: 5 * 60 * 1000,
    });

    return {
      props: {
        ...(await serverSideTranslations(locale ?? "ko", ["common", "track"])),
        dehydratedState: dehydrate(queryClient),
        trackId,
      },
    };
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Error in getServerSideProps:", error);

    return {
      props: {
        ...(await serverSideTranslations(locale ?? "ko", ["common", "track"])),
        dehydratedState: dehydrate(queryClient),
        trackId,
      },
    };
  }
};
