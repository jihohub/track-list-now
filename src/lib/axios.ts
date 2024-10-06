import axios from "axios";
import { getCookie, setCookie } from "cookies-next";

const spotifyApi = axios.create({
  baseURL: "https://api.spotify.com/v1",
});

spotifyApi.interceptors.request.use(
  async (config) => {
    const accessToken = getCookie("access_token");
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

spotifyApi.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      try {
        const tokenResponse = await axios.post("/api/token");
        const newAccessToken = tokenResponse.data.access_token;

        setCookie("access_token", newAccessToken);

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        return spotifyApi(originalRequest);
      } catch (tokenError) {
        return Promise.reject(tokenError);
      }
    }

    return Promise.reject(error);
  },
);

export default spotifyApi;
