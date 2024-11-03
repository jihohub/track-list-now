import rankingSectionsConstants, {
  RankingSectionConstant,
} from "@/constants/rankingSections";
import ErrorComponent from "@/features/common/components/ErrorComponent";
import RankingSection from "@/features/main/components/RankingSection";
import useFetchFeaturedRanking, {
  fetchFeaturedRanking,
} from "@/features/main/queries/useFetchFeaturedRanking";
import {
  ArtistWithRanking,
  RankingSectionProps,
  TrackWithRanking,
} from "@/types/ranking";
import { dehydrate, QueryClient } from "@tanstack/react-query";
import { GetServerSideProps } from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { NextSeo } from "next-seo";

const MainPage = () => {
  const { t } = useTranslation("common");

  const { data: rankingData, error } = useFetchFeaturedRanking();

  if (error) {
    return <ErrorComponent message={`Error loading data: ${error.message}`} />;
  }

  const sections: RankingSectionProps[] = rankingSectionsConstants.map(
    (section: RankingSectionConstant) => {
      let data: ArtistWithRanking[] | TrackWithRanking[] = [];
      switch (section.category) {
        case "ALL_TIME_ARTIST":
          data = rankingData?.allTimeArtistsRanking || [];
          break;
        case "ALL_TIME_TRACK":
          data = rankingData?.allTimeTracksRanking || [];
          break;
        case "CURRENT_ARTIST":
          data = rankingData?.currentArtistsRanking || [];
          break;
        case "CURRENT_TRACK":
          data = rankingData?.currentTracksRanking || [];
          break;
        default:
          data = [];
      }

      return {
        title: t(section.titleKey),
        data,
        type: section.type,
        category: section.category,
      };
    },
  );

  return (
    <div className="max-w-6xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
      <NextSeo
        title="Track List Now"
        description="Explore the top-ranked artists and tracks, featuring all-time favorites and current trends on Track List Now."
        openGraph={{
          type: "website",
          url: "https://www.tracklistnow.com",
          title: "Track List Now",
          description:
            "Explore the top-ranked artists and tracks, featuring all-time favorites and current trends on Track List Now.",
          images: [
            {
              url: "/default-image.jpg",
              width: 800,
              height: 600,
              alt: "Track List Now",
            },
          ],
        }}
        twitter={{
          handle: "@TrackListNow",
          site: "@TrackListNow",
          cardType: "summary_large_image",
        }}
      />
      {sections.map((section) => (
        <RankingSection
          key={section.category}
          title={section.title}
          data={section.data}
          type={section.type}
          category={section.category}
        />
      ))}
    </div>
  );
};

export default MainPage;

export const getServerSideProps: GetServerSideProps = async ({ locale }) => {
  const queryClient = new QueryClient();

  try {
    await queryClient.prefetchQuery({
      queryKey: ["featuredRanking"],
      queryFn: fetchFeaturedRanking,
      staleTime: 5 * 60 * 1000,
    });

    return {
      props: {
        ...(await serverSideTranslations(locale ?? "ko", ["common", "main"])),
        dehydratedState: dehydrate(queryClient),
      },
    };
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Error in getServerSideProps:", error);

    return {
      props: {
        ...(await serverSideTranslations(locale ?? "ko", ["common", "main"])),
        dehydratedState: dehydrate(queryClient),
      },
    };
  }
};
