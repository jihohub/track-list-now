import ErrorComponent from "@/features/common/components/ErrorComponent";
import RankingCategoryTabs from "@/features/ranking/components/RankingCategoryTabs";
import RankingSection from "@/features/ranking/components/RankingSection";
import RankingSEO from "@/features/ranking/components/RankingSEO";
import useRanking from "@/features/ranking/hooks/useRanking";
import {
  fetchRankingData,
  RankingResponse,
} from "@/features/ranking/queries/useFetchRanking";
import { convertToCategory } from "@/libs/utils/categoryMapper";
import ErrorProcessor from "@/libs/utils/errorProcessor";
import handlePageError from "@/libs/utils/handlePageError";
import { RankingCategory } from "@/types/ranking";
import { dehydrate, QueryClient } from "@tanstack/react-query";
import { GetServerSideProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

interface RankingPageProps {
  category: RankingCategory;
}

const RankingPage = ({ category }: RankingPageProps) => {
  const {
    pageTitle,
    pageDescription,
    sectionType,
    sectionData,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    handleCategoryChange,
  } = useRanking(category);

  if (error) {
    const errorMessage = handlePageError(error);
    return <ErrorComponent message={errorMessage} />;
  }

  return (
    <div className="max-w-4xl mobile:mx-6 tablet:mx-6 mx-auto p-6 mt-6 bg-zinc-800 rounded-lg shadow-lg">
      <RankingSEO
        pageTitle={pageTitle}
        pageDescription={pageDescription}
        category={category}
      />

      <RankingCategoryTabs
        category={category}
        onCategoryChange={handleCategoryChange}
      />

      <h1 className="text-xl font-bold text-white mb-6">{pageTitle}</h1>

      <RankingSection
        sectionType={sectionType}
        sectionData={sectionData}
        isLoading={isLoading}
        error={error}
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
    ErrorProcessor.logToSentry(error);

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
