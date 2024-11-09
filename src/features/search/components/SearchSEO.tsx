import { NextSeo } from "next-seo";

interface SearchSEOProps {
  searchQuery?: string;
}

const SearchSEO = ({ searchQuery }: SearchSEOProps) => {
  const baseTitle = "Search Music - Track List Now";
  const title = searchQuery
    ? `Search results for "${searchQuery}" - Track List Now`
    : baseTitle;

  const baseDescription =
    "Search for your favorite artists, tracks, and albums on Track List Now.";
  const description = searchQuery
    ? `Find results for "${searchQuery}" - discover artists, tracks, and albums on Track List Now.`
    : baseDescription;

  return (
    <NextSeo
      title={title}
      description={description}
      openGraph={{
        type: "website",
        url: "https://www.tracklistnow.com/search",
        title,
        description,
        images: [
          {
            url: "/default-image.jpg",
            width: 800,
            height: 600,
            alt: "Track List Now Search",
          },
        ],
      }}
      twitter={{
        handle: "@TrackListNow",
        site: "@TrackListNow",
        cardType: "summary_large_image",
      }}
    />
  );
};

export default SearchSEO;
