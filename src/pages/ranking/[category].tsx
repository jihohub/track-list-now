import ErrorComponent from "@/features/common/ErrorComponent";
import TItem from "@/features/common/TItem";
import { convertToCategory } from "@/libs/utils/categoryMapper";
import {
  isArtistWithRanking,
  isTrackWithRanking,
  RankingCategory,
  TItemData,
} from "@/types/ranking";
import { dehydrate, QueryClient, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { GetServerSideProps } from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { NextSeo } from "next-seo";

interface RankingPageProps {
  category: RankingCategory;
}

const fetchRankingData = async (category: string): Promise<TItemData[]> => {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const response = await axios.get(
    `${baseUrl}/api/ranking?category=${category}`,
  );
  return response.data;
};

const RankingPage = ({ category }: RankingPageProps) => {
  const { t } = useTranslation("common");

  const { data: rankingData, error } = useQuery<TItemData[], Error>({
    queryKey: ["ranking", category],
    queryFn: () => fetchRankingData(category),
    staleTime: 5 * 60 * 1000,
  });

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

  if (error) {
    return <ErrorComponent message={`Error loading data: ${error.message}`} />;
  }

  if (!rankingData || rankingData.length === 0) {
    return <div className="text-center text-gray-400">{t("no_data")}</div>;
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
    <div className="max-w-5xl mx-auto p-6 mt-8">
      <NextSeo
        title={`Track List Now - ${pageTitle}`}
        description={pageDescription}
        openGraph={{
          type: "website",
          url: `https://www.tracklistnow.com/ranking/${category.toLowerCase()}`,
          title: `Track List Now - ${pageTitle}`,
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
      <h1 className="text-3xl font-bold text-white mb-6">{t(title)}</h1>
      {sectionData.length === 0 ? (
        <p className="text-gray-400 text-center mt-4">{t("no_data")}</p>
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
        ...(await serverSideTranslations(locale ?? "ko", ["common"])),
        dehydratedState: dehydrate(queryClient),
        category: categoryURL,
      },
    };
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Error in getServerSideProps:", error);

    return {
      props: {
        ...(await serverSideTranslations(locale ?? "ko", ["common"])),
        dehydratedState: dehydrate(queryClient),
        category: categoryURL,
      },
    };
  }
};
