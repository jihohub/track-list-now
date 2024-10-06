// /pages/api/dummy.ts
import prisma from "@/lib/prisma";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const artists = [
      { id: "6XyY86QOPPrYVGvF9ch6wz", name: "Linkin Park" },
      { id: "7dGJo4pcD2V6oG8kP0tJRR", name: "Eminem" },
      { id: "60d24wfXkVzDSfLS6hyCjZ", name: "Martin Garrix" },
      { id: "5he5w2lnU9x7JFhnwcekXX", name: "DJ Snake" },
      { id: "3TVXtAsR1Inumwj472S9r4", name: "Drake" },
      { id: "6eUKZXaKkcviH0Ku9w2n3V", name: "Ed Sheeran" },
      { id: "1uNFoZAHBGtllmzznpCI3s", name: "Justin Bieber" },
      { id: "1dfeR4HaWDbWqFHLkxsg1d", name: "Queen" },
      { id: "1Xyo4u8uXC1ZmMpatF05PJ", name: "The Weeknd" },
      { id: "3Nrfpe0tUJi4K4DXYWgMUX", name: "BTS" },
      { id: "4gzpq5DPGxSnKTe4SA8HAU", name: "Coldplay" },
      { id: "6M2wZ9GZgrQXHCFfjv46we", name: "Dua Lipa" },
      { id: "3jOstUTkEu2JkjvRdBA5Gu", name: "Weezer" },
      { id: "6LuN9FCkKOj5PcnpouEgny", name: "Billie Eilish" },
      { id: "66CXWjxzNUsdJxJ2JdwvnR", name: "Ariana Grande" },
      { id: "53XhwfbYqKCa1cC15pYq2q", name: "Imagine Dragons" },
      { id: "0LcJLqbBmaGUft1e9Mm8HV", name: "ABBA" },
      { id: "2YZyLoL8N0Wb9xBt1NhZWg", name: "Kendrick Lamar" },
      { id: "246dkjvS1zLTtiykXe5h60", name: "Post Malone" },
      { id: "7Ey4PD4MYsKc5I2dolUwbH", name: "Aerosmith" },
      { id: "7dGJo4pcD2V6oG8kP0tJRR", name: "Eminem" },
      { id: "2tIP7SsRs7vjIcLrU85W8J", name: "Lil Nas X" },
      { id: "1HY2Jd0NmPuamShAr6KMms", name: "Lady Gaga" },
      { id: "0du5cEVh5yTK9QJze8zA0C", name: "Bruno Mars" },
      { id: "6XpaIBNiVzIetEPCWDvAFP", name: "Whitney Houston" },
      { id: "7gOdHgIoIKoe4i9Tta6qdD", name: "Glass Animals" },
      { id: "4tZwfgrHOc3mvqYlEYSvVi", name: "Tom Petty" },
      { id: "7oPftvlwr6VrsViSDV7fJY", name: "Green Day" },
      { id: "4AK6F7OLvEQ5QYCBNiQWHq", name: "One Direction" },
      { id: "6deZN1bslXzeGvOLaLMOIF", name: "Nicki Minaj" },
      { id: "5pKCCKE2ajJHZ9KAiaK11H", name: "Rihanna" },
      { id: "6tbLPxj1uQ6vsRQZI2YFCT", name: "Miley Cyrus" },
      { id: "2wY79sveU1sp5g7SokKOiI", name: "Sam Smith" },
      { id: "21451j1KhjAiaYKflxBjr1", name: "Wiz Khalifa" },
      { id: "3PhoLpVuITZKcymswpck5b", name: "Elton John" },
      { id: "5NGO30tJxFlKixkPSgXcFE", name: "Childish Gambino" },
      { id: "5Pwc4xIPtQLFEnJriah9YJ", name: "OneRepublic" },
      { id: "2wOqMjp9TyABvtHdOSOTUS", name: "Tame Impala" },
      { id: "7n2wHs1TKAczGzO7Dd2rGr", name: "Shawn Mendes" },
      { id: "6qgnBH6iDM91ipVXv28OMu", name: "blackbear" },
      { id: "5K4W6rqBFWDnAN6FQUkS6x", name: "Kanye West" },
      { id: "2qxJFvFYMEDqd7ui6kSAcq", name: "Daft Punk" },
      {
        id: "6FBDaR13swtiWwGhX1WQsP",
        name: "Rage Against The Machine",
      },
      { id: "738wLrAtLtCtFOLvQBXOXp", name: "Bebe Rexha" },
      { id: "1nJvji2KIlWSseXRSlNYsC", name: "Björk" },
      { id: "0kbYTNQb4Pb1rPbbaF0pT4", name: "Lana Del Rey" },
      { id: "0TnOYISbd1XYRBk9myaseg", name: "Pitbull" },
      { id: "1Xyo4u8uXC1ZmMpatF05PJ", name: "The Weeknd" },
    ];

    const tracks = [
      { id: "7ouMYWpwJ422jRcDASZB7P", name: "In the End" },
      { id: "3bH4HzoZZFq8UpZmI2AMgV", name: "Shape of You" },
      { id: "0yLdNVWF3Srea0uzk55zFn", name: "Animals" },
      { id: "3eR23VReFzcdmS7TYCrhCe", name: "Old Town Road" },
      { id: "0VjIjW4GlUZAMYd2vXMi3b", name: "Blinding Lights" },
      { id: "7qiZfU4dY1lWllzX7mPBI3", name: "Shape of You" },
      { id: "1rfofaqEpACxVEHIZBJe6W", name: "Uptown Funk" },
      { id: "5O2P9iiztwhomNh8xkR9lJ", name: "Havana" },
      { id: "4uLU6hMCjMI75M1A2tKUQC", name: "Bohemian Rhapsody" },
      { id: "7BKLCZ1jbUBVqRi2FVlTVw", name: "Closer" },
      { id: "2Fxmhks0bxGSBdJ92vM42m", name: "bad guy" },
      { id: "6habFhsOp2NvshLv26DqMb", name: "Rockstar" },
      {
        id: "6I9VzXrHxO9rA9A5euc8Ak",
        name: "Can't Stop the Feeling!",
      },
      { id: "1Cv1YLb4q0RzL6pybtaMLo", name: "Sorry" },
      { id: "3DYVWvPh3kGwPasp7yjahc", name: "Stay With Me" },
      { id: "3QGsuHI8jO1Rx4JWLUh9jd", name: "Senorita" },
      { id: "3w3y8KPTfNeOKPiqUTakBh", name: "Hello" },
      { id: "5fVZC9GiM4e8vu99W0Xf6J", name: "Billie Jean" },
      { id: "2VxeLyX666F8uXCJ0dZF8B", name: "Perfect" },
      { id: "69uxyAqqPIsUyTO8txoP2M", name: "Royals" },
      { id: "2dpaYNEQHiRxtZbfNsse99", name: "Levitating" },
      { id: "3jjujdWJ72nww5eGnfs2E7", name: "Sunflower" },
      { id: "6MWtB6iiXyIwun0YzU6DFP", name: "Savage Love" },
      { id: "2nLtzopw4rPReszdYBJU6h", name: "drivers license" },
      { id: "6oJ6le65B3SEqPwMRNXWjY", name: "Sweet but Psycho" },
      { id: "6RRNNciQGZEXnqk8SQ9yv5", name: "Blow" },
      { id: "5GorFaKkP2mLREQvhSblIg", name: "Say So" },
      { id: "3Dv1eDb0MEgF93GpLXlucZ", name: "Memories" },
      { id: "2Fxmhks0bxGSBdJ92vM42m", name: "Dance Monkey" },
      { id: "3Kkjo3cT83cw09VJyrLNwX", name: "Circles" },
      { id: "1mXVgsBdtIVeCLJnSnmtdV", name: "Lucid Dreams" },
      { id: "2XU0oxnq2qxCpomAAuJY8K", name: "Break My Heart" },
      { id: "4VUwkH455At9kENOfzTqmF", name: "New Rules" },
      { id: "6u7jPi22kF8CTQ3rb9DHE7", name: "Cold Water" },
      { id: "1zi7xx7UVEFkmKfv06H8x0", name: "Mi Gente" },
      { id: "7qiZfU4dY1lWllzX7mPBI3", name: "Happier" },
      { id: "7qEHsqek33rTcFNT9PFqLf", name: "Shape of You" },
      { id: "0bYg9bo50gSsH3LtXe2SQn", name: "Mood" },
      { id: "1Eolhana7nKHYpcYpdVcT5", name: "Youngblood" },
      { id: "5JEx7HbmvHQQswJCsoo9rA", name: "Piece of Your Heart" },
      { id: "1rqqCSm0Qe4I9rUvWncaom", name: "Adore You" },
      { id: "5jAIouBES8LWMiriuNq170", name: "Rockstar" },
      { id: "3V8UKqhEK5zBkBb6d6ub8i", name: "bad habits" },
      { id: "0e7ipj03S05BNilyu5bRzt", name: "Savage Love" },
      { id: "6I9VzXrHxO9rA9A5euc8Ak", name: "Don't Start Now" },
      { id: "3PfIrDoz19wz7qK7tYeu62", name: "Blame It on Me" },
      { id: "6UelLqGlWMcVH1E5c4H7lY", name: "Save Your Tears" },
    ];

    const updateArtistRanking = async (artistId, type) => {
      const existingEntry = await prisma[type].findFirst({
        where: { artistId },
      });

      if (existingEntry) {
        await prisma[type].update({
          where: { id: existingEntry.id },
          data: { count: { increment: 1 } },
        });
      } else {
        await prisma[type].create({
          data: { artistId, count: 1, followers: 0 },
        });
      }
    };

    const updateTrackRanking = async (trackId, type) => {
      const existingEntry = await prisma[type].findFirst({
        where: { trackId },
      });

      if (existingEntry) {
        await prisma[type].update({
          where: { id: existingEntry.id },
          data: { count: { increment: 1 } },
        });
      } else {
        await prisma[type].create({
          data: { trackId, count: 1, popularity: 0 },
        });
      }
    };

    for (const artist of artists) {
      await prisma.userFavorites.create({
        data: {
          userId: 1,
          artistId: artist.id,
          favoriteType: "atfArtists",
        },
      });

      await updateArtistRanking(artist.id, "allTimeFavoriteArtistsRanking");
    }

    for (const track of tracks) {
      await prisma.userFavorites.create({
        data: {
          userId: 1,
          trackId: track.id,
          favoriteType: "atfTracks",
        },
      });

      await updateTrackRanking(track.id, "allTimeFavoriteTracksRanking");
    }

    for (const artist of artists) {
      await prisma.userFavorites.create({
        data: {
          userId: 1,
          artistId: artist.id,
          favoriteType: "cfArtists",
        },
      });

      await updateArtistRanking(artist.id, "currentFavoriteArtistsRanking");
    }

    for (const track of tracks) {
      await prisma.userFavorites.create({
        data: {
          userId: 1,
          trackId: track.id,
          favoriteType: "cfTracks",
        },
      });

      await updateTrackRanking(track.id, "currentFavoriteTracksRanking");
    }

    res.status(200).json({
      message: "Dummy data inserted and rankings updated successfully.",
    });
  } catch (error) {
    console.error("Error inserting dummy data:", error);
    res.status(500).json({ error: "Error inserting dummy data." });
  }
}
