import ErrorComponent from "@/features/common/ErrorComponent";
import TrackSection from "@/features/track/TrackSection";
import { TrackDetail } from "@/types/track";
import { dehydrate, QueryClient, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { GetServerSideProps } from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { NextSeo } from "next-seo";

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

  const { data: track, error } = useQuery<TrackDetail, Error>({
    queryKey: ["track", trackId],
    queryFn: () => fetchTrackDetail(trackId),
    staleTime: 5 * 60 * 1000,
  });

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
      <TrackSection track={track} />
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
