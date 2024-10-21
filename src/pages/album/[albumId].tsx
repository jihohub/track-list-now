import AlbumSection from "@/features/album/AlbumSection";
import ErrorComponent from "@/features/common/ErrorComponent";
import LoadingBar from "@/features/common/LoadingBar";
import { AlbumResponseData, SimplifiedAlbum } from "@/types/album";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { GetServerSideProps } from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

interface AlbumPageProps {
  albumId: string;
}

const fetchAlbum = async (albumId: string): Promise<SimplifiedAlbum> => {
  const response = await axios.get<AlbumResponseData>(`/api/album/${albumId}`);
  return response.data as SimplifiedAlbum;
};

const AlbumPage = ({ albumId }: AlbumPageProps) => {
  const { t } = useTranslation(["common", "album"]);

  const { data, isLoading, error } = useQuery<SimplifiedAlbum, Error>({
    queryKey: ["album", albumId],
    queryFn: () => fetchAlbum(albumId),
  });

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
    <div className="max-w-4xl mx-auto p-6 mt-8 bg-zinc-800 rounded-lg shadow-md">
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
      ])),
      albumId,
    },
  };
};

export default AlbumPage;
