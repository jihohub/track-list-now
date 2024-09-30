// import { postRefreshToken } from "@/pages/api/token";
import axios from "axios";
import { getCookie } from "cookies-next";

const spotify = axios.create({
  baseURL: "https://api.spotify.com/v1", // 기본 API URL 설정
});

// Axios Request Interceptor
spotify.interceptors.request.use(
  async (config) => {
    const accessToken = getCookie("access_token"); // 쿠키에서 access_token을 가져옴
    if (accessToken) {
      // Access Token이 있으면 Authorization 헤더에 추가
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default spotify;
