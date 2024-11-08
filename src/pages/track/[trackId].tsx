import ErrorComponent from "@/features/common/components/ErrorComponent";
import LoadingBar from "@/features/common/components/LoadingBar";
import TrackSection from "@/features/track/components/TrackSection";
import TrackSEO from "@/features/track/components/TrackSEO";
import useFetchTrackDetail, {
  fetchTrackDetail,
} from "@/features/track/queries/useFetchTrackDetail";
import ErrorProcessor from "@/libs/utils/errorProcessor";
import handlePageError from "@/libs/utils/handlePageError";
import { dehydrate, QueryClient } from "@tanstack/react-query";
import { GetServerSideProps } from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

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
    const errorMessage = handlePageError(error);
    return <ErrorComponent message={errorMessage} />;
  }

  if (!track) {
    return <div className="text-center text-gray-400">{t("no_data")}</div>;
  }

  return (
    <div className="max-w-4xl mobile:mx-6 tablet:mx-6 mx-auto p-6 mt-6 bg-zinc-800 rounded-lg shadow-md">
      <TrackSEO track={track} trackId={trackId} />
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
    ErrorProcessor.logToSentry(error);

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
