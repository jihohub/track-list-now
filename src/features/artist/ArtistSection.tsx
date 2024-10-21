import TImage from "@/features/common/TImage";
import { ArtistPageData } from "@/types/artist";
import { useTranslation } from "next-i18next";
import Link from "next/link";
import TopTrackItem from "./TopTrackItem";

interface ArtistSectionProps {
  data: ArtistPageData;
}

const ArtistSection = ({ data }: ArtistSectionProps) => {
  const { t } = useTranslation(["common", "artist"]);

  const { artist, topTracks, relatedArtists } = data;

  return (
    <div className="max-w-4xl mx-auto p-6 mt-8 bg-zinc-800 rounded-lg shadow-md">
      {/* 아티스트 기본 정보 */}
      <div className="flex flex-col items-center">
        <div className="relative w-[300px] h-[300px] rounded-full overflow-hidden">
          <TImage
            imageUrl={artist.images[0]?.url || "/default-image.jpg"}
            type="artist"
            alt={artist.name}
            size="w-[300px] h-[300px]"
            className="rounded-full overflow-hidden"
          />
        </div>
        <h1 className="text-4xl font-bold text-white mt-4">{artist.name}</h1>

        {/* Genres: 각 장르를 스타일링된 태그로 감싸기 */}
        <div className="flex flex-wrap justify-center mt-2 space-x-2">
          {artist.genres.length > 0 ? (
            artist.genres.map((genre) => (
              <span
                key={genre}
                className="bg-gray-700 text-gray-300 px-3 py-1 rounded-md text-sm mb-2"
              >
                {genre}
              </span>
            ))
          ) : (
            <span className="text-gray-400 text-sm">N/A</span>
          )}
        </div>
      </div>

      {/* 탑 트랙 섹션 */}
      <div className="mt-8">
        <h2 className="text-2xl font-semibold text-white mb-4">
          {t("top_tracks", { ns: "artist" })}
        </h2>
        <ul className="space-y-4">
          {topTracks.tracks.map((track, index) => (
            <TopTrackItem key={track.id} index={index} track={track} />
          ))}
        </ul>
      </div>

      {/* 연관 아티스트 섹션 */}
      <div className="mt-8">
        <h2 className="text-2xl font-semibold text-white mb-4">
          {t("related_artists", { ns: "artist" })}
        </h2>
        <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
          {relatedArtists.artists.map((relatedArtist) => (
            <li key={relatedArtist.id} className="flex flex-col items-center">
              <Link
                href={`/artist/${relatedArtist.id}`}
                className="flex flex-col items-center"
              >
                <div className="relative w-24 h-24">
                  <TImage
                    imageUrl={
                      relatedArtist.images[0]?.url || "/default-image.jpg"
                    }
                    type="artist"
                    alt={relatedArtist.name}
                    size="w-24 h-24"
                    className="rounded-full object-cover"
                  />
                </div>
                <span className="text-white mt-3 text-center font-medium">
                  {relatedArtist.name}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ArtistSection;
