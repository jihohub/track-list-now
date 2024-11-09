import { NextSeo } from "next-seo";

interface LikedSEOProps {
  userName?: string;
  userProfileImage?: string | null;
}

const LikedSEO = ({ userName = "User", userProfileImage }: LikedSEOProps) => (
  <NextSeo
    title={`${userName}'s Liked Collection - Track List Now`}
    description={`${userName}'s Liked Collection - Track List Now`}
    openGraph={{
      type: "music.playlist",
      url: "https://www.tracklistnow.com/liked",
      title: `${userName}'s Liked Collection - Track List Now`,
      description: `${userName}'s Liked Collection - Track List Now`,
      images: [
        {
          url: userProfileImage || "/default-liked-collection-image.jpg",
          width: 800,
          height: 800,
          alt: `${userName}'s Liked Collection`,
        },
      ],
    }}
    twitter={{
      handle: "@TrackListNow",
      site: "@TrackListNow",
      cardType: "summary_large_image",
    }}
    additionalMetaTags={[
      {
        name: "music:creator",
        content: userName,
      },
    ]}
  />
);

export default LikedSEO;
