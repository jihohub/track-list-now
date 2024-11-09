const SPOTIFY_CONSTANTS = {
  TOKEN_ENDPOINT: "https://accounts.spotify.com/api/token",
  COOKIE_NAMES: {
    ACCESS_TOKEN: "spotify_access_token",
    TOKEN_EXPIRY: "spotify_token_expiry",
  },
  ERROR_MESSAGES: {
    TOKEN_FETCH_FAILED: "Failed to fetch Spotify access token",
    UNEXPECTED_ERROR: "An unexpected error occurred",
    MISSING_CREDENTIALS: "Missing Spotify credentials",
  },
  PATHS: {
    API: "/api/",
    SPOTIFY_API: "/api/spotify",
  },
} as const;

export default SPOTIFY_CONSTANTS;
