import axios, { AxiosHeaders } from "axios";
import { getCookie, setCookie } from "cookies-next";
import { NextApiRequest, NextApiResponse } from "next";

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

      if (accessToken && typeof accessToken === "string") {
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
  serverAxiosInstance.interceptors.response.use(
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
          const tokenUrl = `${baseUrl}/api/token`;

          const tokenResponse = await axios.post(tokenUrl);
          const newAccessToken = tokenResponse.data.access_token;

          setCookie("access_token", newAccessToken, {
            req,
            res,
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            path: "/",
          });

          if (newAccessToken && typeof newAccessToken === "string") {
            const headers = AxiosHeaders.from(originalRequest.headers);
            headers.set("Authorization", `Bearer ${newAccessToken}`);
            originalRequest.headers = headers;
          }

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
