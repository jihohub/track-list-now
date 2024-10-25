interface SearchInputProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  handleSearch: () => void;
  handleKeyPress: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  placeholder: string;
  searchButtonLabel: string;
}

const SearchInput = ({
  searchQuery,
  setSearchQuery,
  handleSearch,
  handleKeyPress,
  placeholder,
  searchButtonLabel,
}: SearchInputProps) => {
  return (
    <div className="space-y-4">
      <div className="relative">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder={placeholder}
          className="border p-2 pr-16 w-full rounded-lg bg-gray-700 text-white focus:outline-none"
        />
        <button
          onClick={handleSearch}
          className="absolute right-0 top-0 h-full bg-persianBlue text-white px-4 rounded-r-lg hover:bg-blue-700 transition"
          type="button"
        >
          {searchButtonLabel}
        </button>
      </div>
    </div>
  );
};

export default SearchInput;
