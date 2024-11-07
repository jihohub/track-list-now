import LikedSection from "@/features/liked/components/LikedSection";
import { GetServerSideProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

const LikedPage = () => {
  return (
    <div className="min-h-screen p-6">
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
