import AlbumSection from "@/features/album/components/AlbumSection";
import AlbumSEO from "@/features/album/components/AlbumSEO";
import useFetchAlbum from "@/features/album/queries/useFetchAlbum";
import ErrorComponent from "@/features/common/components/ErrorComponent";
import LoadingBar from "@/features/common/components/LoadingBar";
import handlePageError from "@/libs/utils/handlePageError";
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
    const errorMessage = handlePageError(error);
    return <ErrorComponent message={errorMessage} />;
  }

  if (!data) {
    return <div className="text-center text-gray-400">{t("no_data")}</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6 mt-6 bg-zinc-800 rounded-lg shadow-md">
      <AlbumSEO album={data} albumId={albumId} />
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
