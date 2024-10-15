import axios, { AxiosHeaders } from "axios";
import { getCookie, setCookie } from "cookies-next";

const axiosInstance = axios.create({
  baseURL: "https://api.spotify.com/v1",
});

// 요청 인터셉터
axiosInstance.interceptors.request.use(
  async (config) => {
    const accessToken = getCookie("spotify_access_token");

    if (accessToken) {
      const headers = AxiosHeaders.from(config.headers);
      headers.set("Authorization", `Bearer ${accessToken}`);
      /* eslint-disable no-param-reassign */
      config.headers = headers;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

// 응답 인터셉터
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest.retry
    ) {
      originalRequest.retry = true;

      try {
        const tokenResponse = await axios.post("/api/token");
        const newAccessToken = tokenResponse.data.access_token;

        setCookie("access_token", newAccessToken);

        const headers = AxiosHeaders.from(originalRequest.headers);
        headers.set("Authorization", `Bearer ${newAccessToken}`);
        originalRequest.headers = headers;

        return axiosInstance(originalRequest);
      } catch (tokenError) {
        return Promise.reject(tokenError);
      }
    }

    return Promise.reject(error);
  },
);

export default axiosInstance;
