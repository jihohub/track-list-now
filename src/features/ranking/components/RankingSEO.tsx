import { RankingCategory } from "@/types/ranking";
import { NextSeo } from "next-seo";

interface RankingSEOProps {
  pageTitle: string;
  pageDescription: string;
  category: RankingCategory;
}

const RankingSEO = ({
  pageTitle,
  pageDescription,
  category,
}: RankingSEOProps) => (
  <NextSeo
    title={`${pageTitle} - Track List Now`}
    description={pageDescription}
    openGraph={{
      type: "website",
      url: `https://www.tracklistnow.com/ranking/${category.toLowerCase()}`,
      title: `${pageTitle} - Track List Now`,
      description: pageDescription,
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

export default RankingSEO;
