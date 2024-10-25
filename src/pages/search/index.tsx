import SearchSection from "@/features/search/SearchSection";
import { GetServerSideProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

const SearchPage = () => {
  return (
    <div className="min-h-screen p-4">
      <SearchSection />
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale ?? "ko", ["common", "search"])),
    },
  };
};

export default SearchPage;
