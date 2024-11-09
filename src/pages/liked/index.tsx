import LikedSection from "@/features/liked/components/LikedSection";
import LikedSEO from "@/features/liked/components/LikedSEO";
import { GetServerSideProps } from "next";
import { useSession } from "next-auth/react";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

const LikedPage = () => {
  const { data: session } = useSession();

  return (
    <div className="max-w-4xl mx-auto p-6 mt-6 bg-zinc-800 rounded-lg shadow-md">
      <LikedSEO
        userName={session?.user?.name}
        userProfileImage={session?.user?.image}
      />
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
