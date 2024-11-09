import LikedSection from "@/features/liked/components/LikedSection";
import { GetServerSideProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

const LikedPage = () => {
  return (
    <div className="max-w-4xl mx-auto p-6 mt-6 bg-zinc-800 rounded-lg shadow-md">
      <LikedSection />
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale ?? "ko", [
        "common",
        "liked",
        "error",
      ])),
    },
  };
};

export default LikedPage;
