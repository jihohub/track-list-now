import { NextSeo } from "next-seo";

interface ProfileSEOProps {
  viewedUserName?: string;
  profileImageUrl?: string | null;
  userId: number;
}

const ProfileSEO = ({
  viewedUserName,
  profileImageUrl,
  userId,
}: ProfileSEOProps) => (
  <NextSeo
    title={`${viewedUserName} - Track List Now`}
    description={`${viewedUserName}'s favorite artists and tracks on Track List Now`}
    openGraph={{
      type: "profile",
      url: `https://www.tracklistnow.com/profile/${userId}`,
      title: `${viewedUserName} - Track List Now`,
      description: `${viewedUserName}'s favorite artists and tracks`,
      images: [
        {
          url: profileImageUrl || "/default-profile-image.jpg",
          width: 800,
          height: 800,
          alt: `${profileImageUrl}'s Profile Image`,
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

export default ProfileSEO;
