import { GetServerSideProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

export const getServerSideProps: GetServerSideProps = async ({ locale }) => {
  const defaultLocale = "ko";
  const currentLocale = locale || defaultLocale;
  const isDefaultLocale = currentLocale === defaultLocale;

  const destination = isDefaultLocale
    ? "/ranking/all-time-artist"
    : `/${currentLocale}/ranking/all-time-artist`;

  return {
    props: {
      ...(await serverSideTranslations(currentLocale ?? "ko", [
        "common",
        "ranking",
      ])),
    },
    redirect: {
      destination,
      permanent: false,
    },
  };
};

const RankingRedirectPage = () => null;

export default RankingRedirectPage;
