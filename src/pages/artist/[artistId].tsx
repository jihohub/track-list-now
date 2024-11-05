import ArtistSection from "@/features/artist/components/ArtistSection";
import useFetchArtist, {
  fetchArtistData,
} from "@/features/artist/queries/useFetchArtist";
import ErrorComponent from "@/features/common/components/ErrorComponent";
import LoadingBar from "@/features/common/components/LoadingBar";
import { dehydrate, QueryClient } from "@tanstack/react-query";
import { GetServerSideProps } from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { NextSeo } from "next-seo";

interface ArtistPageProps {
  artistId: string;
}

const ArtistPage = ({ artistId }: ArtistPageProps) => {
  const { t } = useTranslation(["common", "artist"]);

  const { data, error, isLoading } = useFetchArtist(artistId);

  if (isLoading) {
    return <LoadingBar />;
  }

  if (error) {
    return <ErrorComponent message={`Error loading data: ${error.message}`} />;
  }

  if (!data || !data.artist) {
    return <div className="text-center text-gray-400">{t("no_data")}</div>;
  }

  return (
    <div className="max-w-4xl mobile:mx-6 tablet:mx-6 mx-auto p-6 mt-6 bg-zinc-800 rounded-lg shadow-md">
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
      <ArtistSection data={data} />
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
