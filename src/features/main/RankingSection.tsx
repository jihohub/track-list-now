import { RankingSectionProps } from "@/types/types";
import { useTranslation } from "next-i18next";
import Link from "next/link";
import TItem from "../common/TItem";

const RankingSection = ({
  title,
  data,
  type,
  category,
}: RankingSectionProps) => {
  const { t } = useTranslation(["common", "main"]);

  return (
    <div className="bg-zinc-800 p-6 rounded-lg shadow-md flex flex-col h-full min-h-[376px]">
      <div className="flex-grow">
        <h2 className="text-2xl text-white font-bold mb-4">{title}</h2>
        <ul>
          {data.length === 0 ? (
            <li className="flex justify-center items-center h-[280px]">
              <p className="text-gray-400 text-center">{t("no_data")}</p>
            </li>
          ) : (
            data.map((item, index) => (
              <TItem
                key={item.id}
                index={index}
                item={item}
                type={type}
                isFeatured
              />
            ))
          )}
        </ul>
      </div>
      {data.length > 0 && (
        <Link href={`/ranking/${category}`}>
          <button className="text-blue-300 mt-4 self-end" type="button">
            {t("see_more", { ns: "main" })}
          </button>
        </Link>
      )}
    </div>
  );
};

export default RankingSection;
