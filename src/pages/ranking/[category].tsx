import ErrorComponent from "@/features/common/components/ErrorComponent";
import TItem from "@/features/common/components/TItem";
import RankingCategoryTabs from "@/features/ranking/components/RankingCategoryTabs";
import useFetchRanking, {
  fetchRankingData,
} from "@/features/ranking/queries/useFetchRanking";
import useGlobalLoading from "@/hooks/useGlobalLoading";
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
  const { t } = useTranslation(["common", "ranking"]);
  const router = useRouter();
  const isLoading = useGlobalLoading();

  const { data: rankingData = [], error } = useFetchRanking(category);

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
    <div className="bg-zinc-800 p-6 rounded-lg shadow-lg max-w-4xl w-full mx-auto">
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

      <h1 className="text-3xl font-bold text-white mb-6">{t(title)}</h1>
      {!isLoading && sectionData.length === 0 ? (
        <div className="flex justify-center items-center h-[500px]">
          <p className="text-gray-400 text-center mt-4">{t("no_data")}</p>
        </div>
      ) : (
        <ul className="space-y-4">
          {sectionData.map((item, index) => {
            if (sectionType === "artist" && isArtistWithRanking(item)) {
              return (
                <TItem
                  key={item.artist.artistId}
                  index={index}
                  item={item}
                  type="artist"
                />
              );
            }
            if (sectionType === "track" && !isArtistWithRanking(item)) {
              return (
                <TItem
                  key={item.track.trackId}
                  index={index}
                  item={item}
                  type="track"
                />
              );
            }
            return null;
          })}
        </ul>
      )}
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
    await queryClient.prefetchQuery({
      queryKey: ["ranking", category],
      queryFn: () => fetchRankingData(categoryURL),
      staleTime: 5 * 60 * 1000,
    });

    return {
      props: {
        ...(await serverSideTranslations(locale ?? "ko", [
          "common",
          "ranking",
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
        ])),
        dehydratedState: dehydrate(queryClient),
        category: categoryURL,
      },
    };
  }
};
