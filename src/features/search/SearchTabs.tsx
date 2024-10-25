import { useTranslation } from "react-i18next";

interface TabsProps {
  currentType: string;
  setCurrentType: (type: string) => void;
}

const SearchTabs = ({ currentType, setCurrentType }: TabsProps) => {
  const { t } = useTranslation(["common", "search"]);
  const tabs = [
    { label: "all", value: "artist,track,album" },
    { label: "artist", value: "artist" },
    { label: "track", value: "track" },
    { label: "album", value: "album" },
  ];

  return (
    <div className="flex space-x-2 mt-4">
      {tabs.map((tab) => (
        <button
          key={tab.value}
          onClick={() => setCurrentType(tab.value)}
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
