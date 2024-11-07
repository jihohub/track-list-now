import ErrorComponent from "@/features/common/components/ErrorComponent";
import RankingCategoryTabs from "@/features/ranking/components/RankingCategoryTabs";
import RankingSection from "@/features/ranking/components/RankingSection";
import useFetchRanking, {
  fetchRankingData,
  RankingResponse,
} from "@/features/ranking/queries/useFetchRanking";
import { convertToCategory } from "@/libs/utils/categoryMapper";
import {
  isArtistWithRanking,
  isTrackWithRanking,
  RankingCategory,
  TItemData,
} from "@/types/ranking";
import { dehydrate, QueryClient } from "@tanstack/react-query";
import { GetServerSideProps } from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { NextSeo } from "next-seo";
import { useRouter } from "next/router";

interface RankingPageProps {
  category: RankingCategory;
}

const RankingPage = ({ category }: RankingPageProps) => {
  const { t } = useTranslation(["common", "ranking", "error"]);
  const router = useRouter();

  const { data, fetchNextPage, hasNextPage, isLoading, error } =
    useFetchRanking(category);

  const title = (() => {
    switch (category) {
      case "ALL_TIME_ARTIST":
        return "all_time_favorite_artists";
      case "ALL_TIME_TRACK":
        return "all_time_favorite_tracks";
      case "CURRENT_ARTIST":
        return "current_favorite_artists";
      case "CURRENT_TRACK":
        return "current_favorite_tracks";
      default:
        return "Ranking";
    }
  })();

  const handleCategoryChange = (newCategory: string) => {
    router.push(`/ranking/${newCategory.toLowerCase()}`);
  };

  if (error) {
    return <ErrorComponent message={`Error loading data: ${error.message}`} />;
  }

  const rankingData = data?.pages.flatMap((page) => page.items) ?? [];

  let sectionType: "artist" | "track" = "artist";
  let sectionData: TItemData[] = [];

  switch (category) {
    case "ALL_TIME_ARTIST":
    case "CURRENT_ARTIST":
      sectionType = "artist";
      sectionData = rankingData.filter(isArtistWithRanking);
      break;
    case "ALL_TIME_TRACK":
    case "CURRENT_TRACK":
      sectionType = "track";
      sectionData = rankingData.filter(isTrackWithRanking);
      break;
    default:
      sectionType = "artist";
      sectionData = rankingData;
      break;
  }

  const pageTitle = t(title);
  const pageDescription = `Top ${sectionType === "artist" ? "Artists" : "Tracks"} ranking for ${pageTitle.replace("_", " ")} on Track List Now`;

  return (
    <div className="max-w-4xl mobile:mx-6 tablet:mx-6 mx-auto p-6 mt-6 bg-zinc-800 rounded-lg shadow-lg">
      <NextSeo
        title={`${pageTitle} - Track List Now`}
        description={pageDescription}
        openGraph={{
          type: "website",
          url: `https://www.tracklistnow.com/ranking/${category.toLowerCase()}`,
          title: `${pageTitle} - Track List Now`,
          description: pageDescription,
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

      <RankingCategoryTabs
        category={category}
        onCategoryChange={handleCategoryChange}
      />

      <h1 className="text-xl font-bold text-white mb-6">{t(title)}</h1>

      <RankingSection
        sectionType={sectionType}
        sectionData={sectionData}
        isLoading={isLoading}
        error={error || null}
        fetchMore={fetchNextPage}
        hasMore={!!hasNextPage}
      />
    </div>
  );
};

export default RankingPage;

export const getServerSideProps: GetServerSideProps = async ({
  locale,
  params,
}) => {
  const queryClient = new QueryClient();
  const category = params?.category as string;

  const categoryURL = convertToCategory(category);

  if (!categoryURL) {
    return {
      notFound: true,
    };
  }

  try {
    await queryClient.prefetchInfiniteQuery({
      queryKey: ["ranking", categoryURL],
      queryFn: ({ pageParam = 0 }) => fetchRankingData(pageParam, categoryURL),
      initialPageParam: 0,
      getNextPageParam: (lastPage: RankingResponse) =>
        lastPage.next ? lastPage.offset + lastPage.limit : undefined,
      staleTime: 5 * 60 * 1000,
    });

    return {
      props: {
        ...(await serverSideTranslations(locale ?? "ko", [
          "common",
          "ranking",
          "error",
        ])),
        dehydratedState: dehydrate(queryClient),
        category: categoryURL,
      },
    };
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Error in getServerSideProps:", error);

    return {
      props: {
        ...(await serverSideTranslations(locale ?? "ko", [
          "common",
          "ranking",
          "error",
        ])),
        dehydratedState: dehydrate(queryClient),
        category: categoryURL,
      },
    };
  }
};
