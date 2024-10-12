// /libs/axios/axiosInstance.ts
import axios from "axios";
import { getCookie, setCookie } from "cookies-next";

const axiosInstance = axios.create({
  baseURL: "https://api.spotify.com/v1",
});

// 요청 인터셉터
axiosInstance.interceptors.request.use(
  async (config) => {
    const accessToken = getCookie("access_token");
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
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
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      try {
        const tokenResponse = await axios.post("/api/token"); // 클라이언트 사이드에서는 상대 경로 사용 가능
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
