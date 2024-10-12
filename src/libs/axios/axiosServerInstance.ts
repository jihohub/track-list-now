// /libs/axios/axiosServerInstance.ts
import axios, { AxiosRequestConfig } from "axios";
import { getCookie } from "cookies-next";
import { NextApiRequest, NextApiResponse } from "next";

interface CustomAxiosRequestConfig extends AxiosRequestConfig {
  _retry?: boolean;
}

const getServerAxiosInstance = (req: NextApiRequest, res: NextApiResponse) => {
  const protocol = req.headers["x-forwarded-proto"] || "http";
  const { host } = req.headers;
  const baseUrl = `${protocol}://${host}`;

  const serverAxiosInstance = axios.create({
    baseURL: "https://api.spotify.com/v1",
  });

  // 요청 인터셉터
  serverAxiosInstance.interceptors.request.use(
    async (config) => {
      const accessToken = getCookie("access_token", { req, res });
      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }
      return config;
    },
    (error) => Promise.reject(error),
  );

  // 응답 인터셉터
  serverAxiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest: CustomAxiosRequestConfig = error.config;

      if (
        error.response &&
        error.response.status === 401 &&
        !originalRequest._retry
      ) {
        originalRequest._retry = true;

        try {
          // 절대 URL 사용
          const tokenUrl = `${baseUrl}/api/token`;

          const tokenResponse = await axios.post(tokenUrl);
          const newAccessToken = tokenResponse.data.access_token;

          // 쿠키에 새 토큰 설정 (이미 /api/token 에서 설정됨)

          // Authorization 헤더 수동 설정
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

          return serverAxiosInstance(originalRequest);
        } catch (tokenError) {
          return Promise.reject(tokenError);
        }
      }

      return Promise.reject(error);
    },
  );

  return serverAxiosInstance;
};

export default getServerAxiosInstance;
