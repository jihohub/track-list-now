import ErrorComponent from "@/features/common/components/ErrorComponent";
import LoadingBar from "@/features/common/components/LoadingBar";
import TrackSection from "@/features/track/components/TrackSection";
import useFetchTrackDetail, {
  fetchTrackDetail,
} from "@/features/track/queries/useFetchTrackDetail";
import { dehydrate, QueryClient } from "@tanstack/react-query";
import { GetServerSideProps } from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { NextSeo } from "next-seo";

interface TrackPageProps {
  trackId: string;
}

const TrackPage = ({ trackId }: TrackPageProps) => {
  const { t } = useTranslation(["common", "track", "error"]);

  const { data: track, error, isLoading } = useFetchTrackDetail(trackId);

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
    <div className="max-w-4xl mobile:mx-6 tablet:mx-6 mx-auto p-6 mt-6 bg-zinc-800 rounded-lg shadow-md">
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
        ...(await serverSideTranslations(locale ?? "ko", [
          "common",
          "track",
          "error",
        ])),
        dehydratedState: dehydrate(queryClient),
        trackId,
      },
    };
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Error in getServerSideProps:", error);

    return {
      props: {
        ...(await serverSideTranslations(locale ?? "ko", [
          "common",
          "track",
          "error",
        ])),
        dehydratedState: dehydrate(queryClient),
        trackId,
      },
    };
  }
};
