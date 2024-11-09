import SearchSection from "@/features/search/components/SearchSection";
import { GetServerSideProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

const SearchPage = () => {
  return (
    <div className="max-w-4xl mx-auto p-6 mt-6 bg-zinc-800 rounded-lg shadow-md">
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
