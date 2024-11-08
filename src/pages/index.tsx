import ErrorComponent from "@/features/common/components/ErrorComponent";
import MainPageSEO from "@/features/main/components/MainPageSEO";
import RankingSection from "@/features/main/components/RankingSection";
import useMainPageSections from "@/features/main/hooks/useMainPageSections";
import useFetchFeaturedRanking, {
  fetchFeaturedRanking,
} from "@/features/main/queries/useFetchFeaturedRanking";
import ErrorProcessor from "@/libs/utils/errorProcessor";
import handlePageError from "@/libs/utils/handlePageError";
import { dehydrate, QueryClient } from "@tanstack/react-query";
import { GetServerSideProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

const MainPage = () => {
  const { data: rankingData, error } = useFetchFeaturedRanking();

  if (error) {
    const errorMessage = handlePageError(error);
    return <ErrorComponent message={errorMessage} />;
  }

  const sections = useMainPageSections(rankingData);

  return (
    <div className="max-w-6xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
      <MainPageSEO />
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
        ...(await serverSideTranslations(locale ?? "ko", [
          "common",
          "main",
          "error",
        ])),
        dehydratedState: dehydrate(queryClient),
      },
    };
  } catch (error) {
    ErrorProcessor.logToSentry(error);

    return {
      props: {
        ...(await serverSideTranslations(locale ?? "ko", [
          "common",
          "main",
          "error",
        ])),
        dehydratedState: dehydrate(queryClient),
      },
    };
  }
};
