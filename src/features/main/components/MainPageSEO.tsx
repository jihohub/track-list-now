import { NextSeo } from "next-seo";

const MainPageSEO = () => (
  <NextSeo
    title="Track List Now"
    description="Explore the top-ranked artists and tracks, featuring all-time favorites and current trends on Track List Now."
    openGraph={{
      type: "website",
      url: "https://www.tracklistnow.com",
      title: "Track List Now",
      description:
        "Explore the top-ranked artists and tracks, featuring all-time favorites and current trends on Track List Now.",
      images: [
        {
          url: "/default-image.jpg",
          width: 800,
          height: 600,
          alt: "Track List Now",
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

export default MainPageSEO;
