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
    <div className="relative w-full">
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        onKeyDown={handleKeyPress}
        placeholder={placeholder}
        className="border border-vividSkyBlue p-2 pr-16 w-full rounded-lg bg-gray-800 text-white"
      />
      <button
        onClick={handleSearch}
        className="absolute right-0 top-0 h-full bg-blue-600 text-white px-4 rounded-r-lg"
        type="button"
      >
        {searchButtonLabel}
      </button>
    </div>
  );
};

export default SearchInput;
