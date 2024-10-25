import { GetServerSideProps } from "next";

export const getServerSideProps: GetServerSideProps = async () => {
  return {
    redirect: {
      destination: "/ranking/all-time-artist",
      permanent: false,
    },
  };
};

const RankingRedirectPage = () => null;

export default RankingRedirectPage;
