import AlbumSection from "@/features/album/components/AlbumSection";
import useFetchAlbum from "@/features/album/queries/useFetchAlbum";
import ErrorComponent from "@/features/common/components/ErrorComponent";
import LoadingBar from "@/features/common/components/LoadingBar";
import { GetServerSideProps } from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

interface AlbumPageProps {
  albumId: string;
}

const AlbumPage = ({ albumId }: AlbumPageProps) => {
  const { t } = useTranslation(["common", "album", "error"]);

  const { data, error, isLoading } = useFetchAlbum(albumId);

  if (isLoading) {
    return <LoadingBar />;
  }

  if (error) {
    return <ErrorComponent message={error.message} />;
  }

  if (!data) {
    return <div className="text-center text-gray-400">{t("no_data")}</div>;
  }

  return (
    <div className="max-w-4xl mobile:mx-6 tablet:mx-6 mx-auto p-6 mt-6 bg-zinc-800 rounded-lg shadow-md">
      <AlbumSection album={data} />
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { albumId } = context.params as { albumId: string };

  return {
    props: {
      ...(await serverSideTranslations(context.locale || "ko", [
        "common",
        "album",
        "error",
      ])),
      albumId,
    },
  };
};

export default AlbumPage;
