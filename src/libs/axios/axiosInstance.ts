import axios from "axios";
import { getCookie, setCookie } from "cookies-next";

const axiosInstance = axios.create({
  baseURL: "https://api.spotify.com/v1",
});

// 요청 인터셉터
axiosInstance.interceptors.request.use(
  async (config) => {
    const accessToken = getCookie("access_token");

    const newConfig = { ...config };
    if (accessToken) {
      newConfig.headers = {
        ...newConfig.headers,
        Authorization: `Bearer ${accessToken}`,
      };
    }

    return newConfig;
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

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        return axiosInstance(originalRequest);
      } catch (tokenError) {
        return Promise.reject(tokenError);
      }
    }

    return Promise.reject(error);
  },
);

export default axiosInstance;
