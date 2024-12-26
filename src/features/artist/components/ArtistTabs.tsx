import { useTranslation } from "next-i18next";

interface ArtistTabsProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
}

const ArtistTabs = ({ currentTab, setCurrentTab }: ArtistTabsProps) => {
  const { t } = useTranslation(["artist"]);

  const tabs: { label: string; value: string }[] = [
    { label: "top_tracks", value: "top_tracks" },
    { label: "albums", value: "albums" },
    // { label: "related_artists", value: "related_artists" },
  ];

  return (
    <div className="flex space-x-2 mt-8">
      {tabs.map((tab) => (
        <button
          key={tab.value}
          onClick={() => setCurrentTab(tab.value)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            currentTab === tab.value
              ? "bg-persianBlue text-white"
              : "bg-gray-700 text-gray-300 hover:bg-gray-600"
          }`}
          type="button"
        >
          {t(tab.label)}
        </button>
      ))}
    </div>
  );
};

export default ArtistTabs;
