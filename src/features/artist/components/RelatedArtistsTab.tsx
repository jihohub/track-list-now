import useRelatedArtists from "@/features/artist/queries/useRelatedArtists";
import LoadingBar from "@/features/common/components/LoadingBar";
import TImage from "@/features/common/components/TImage";
import { useTranslation } from "next-i18next";
import Link from "next/link";

interface RelatedArtistsTabProps {
  artistId: string;
}

const RelatedArtistsTab = ({ artistId }: RelatedArtistsTabProps) => {
  const { t } = useTranslation(["artist"]);
  const { data, isLoading, isError } = useRelatedArtists({
    artistId,
    enabled: true,
  });

  if (isLoading) return <LoadingBar />;
  if (isError)
    return <div className="text-red-500">{t("error.loading_related")}</div>;
  if (!data?.artists.length)
    return <div className="text-gray-400">{t("no_related")}</div>;

  return (
    <div>
      <h2 className="text-2xl font-semibold text-white mb-4">
        {t("related_artists")}
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {data.artists.map((artist) => (
          <Link key={artist.id} href={`/artist/${artist.id}`}>
            <div className="p-4 hover:bg-zinc-800 rounded-lg transition-colors">
              <div className="relative w-full aspect-square mb-3">
                <TImage
                  imageUrl={artist.images[0]?.url}
                  alt={artist.name}
                  type="artist"
                  size="w-full h-full"
                  className="rounded-full"
                />
              </div>
              <h3 className="font-medium text-white text-center truncate">
                {artist.name}
              </h3>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default RelatedArtistsTab;
