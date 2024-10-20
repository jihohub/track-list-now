import ErrorComponent from "@/features/common/ErrorComponent";
import RankingSection from "@/features/main/RankingSection";
import { dehydrate, QueryClient, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { GetServerSideProps } from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { NextSeo } from "next-seo";

import { FullRankingData, RankingSectionProps } from "@/types/ranking";

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

  const allTimeArtists = rankingData?.allTimeArtistsRanking || [];
  const allTimeTracks = rankingData?.allTimeTracksRanking || [];
  const currentArtists = rankingData?.currentArtistsRanking || [];
  const currentTracks = rankingData?.currentTracksRanking || [];

  if (error) {
    return <ErrorComponent message={`Error loading data: ${error.message}`} />;
  }

  const sections: RankingSectionProps[] = [
    {
      title: t("all_time_favorite_artists"),
      data: allTimeArtists,
      type: "artist",
      category: "ALL_TIME_ARTIST",
    },
    {
      title: t("all_time_favorite_tracks"),
      data: allTimeTracks,
      type: "track",
      category: "ALL_TIME_TRACK",
    },
    {
      title: t("current_favorite_artists"),
      data: currentArtists,
      type: "artist",
      category: "CURRENT_ARTIST",
    },
    {
      title: t("current_favorite_tracks"),
      data: currentTracks,
      type: "track",
      category: "CURRENT_TRACK",
    },
  ];

  return (
    <div className="max-w-5xl mx-auto p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
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
