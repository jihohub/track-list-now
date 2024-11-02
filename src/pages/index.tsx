import rankingSectionsConstants, {
  RankingSectionConstant,
} from "@/constants/rankingSections";
import ErrorComponent from "@/features/common/ErrorComponent";
import RankingSection from "@/features/main/RankingSection";
import {
  ArtistWithRanking,
  FullRankingData,
  RankingSectionProps,
  TrackWithRanking,
} from "@/types/ranking";
import { dehydrate, QueryClient, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { GetServerSideProps } from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { NextSeo } from "next-seo";

const fetchFeaturedRanking = async (): Promise<FullRankingData> => {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    const response = await axios.get(`${baseUrl}/api/featured-ranking`);
    return response.data;
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : "알 수 없는 오류가 발생했습니다.";
    throw errorMessage;
  }
};

const MainPage = () => {
  const { t } = useTranslation("common");

  const { data: rankingData, error } = useQuery<FullRankingData, Error>({
    queryKey: ["featuredRanking"],
    queryFn: fetchFeaturedRanking,
    staleTime: 5 * 60 * 1000,
  });

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
