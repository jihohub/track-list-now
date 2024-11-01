import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";

interface TabsProps {
  currentType: string;
  setCurrentType: (type: string) => void;
}

const SearchTabs = ({ currentType, setCurrentType }: TabsProps) => {
  const { t } = useTranslation(["common", "search"]);
  const router = useRouter();

  const tabs = [
    { label: "all", value: "all" },
    { label: "artist", value: "artist" },
    { label: "track", value: "track" },
    { label: "album", value: "album" },
  ];

  const handleTabClick = (value: string) => {
    setCurrentType(value);
    // 현재 검색어를 유지하면서 type만 업데이트
    const query = { ...router.query, type: value };
    router.push(
      {
        pathname: router.pathname,
        query,
      },
      undefined,
      { shallow: true },
    );
  };

  return (
    <div className="flex space-x-2 mt-4">
      {tabs.map((tab) => (
        <button
          key={tab.value}
          onClick={() => handleTabClick(tab.value)}
          className={`px-3 py-1 rounded-full text-white text-sm mb-2" ${
            currentType === tab.value
              ? "bg-persianBlue"
              : "bg-gray-700 hover:bg-gray-600"
          }`}
          type="button"
        >
          {t(tab.label, { ns: "search" })}
        </button>
      ))}
    </div>
  );
};

export default SearchTabs;
