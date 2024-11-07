import SearchSection from "@/features/search/components/SearchSection";
import { GetServerSideProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

const SearchPage = () => {
  return (
    <div className="min-h-screen p-6">
      <SearchSection />
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale ?? "ko", [
        "common",
        "search",
        "error",
      ])),
    },
  };
};

export default SearchPage;
