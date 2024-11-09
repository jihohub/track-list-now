import * as Sentry from "@sentry/nextjs";

const SENTRY_CONFIG = {
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV,
  debug: process.env.NODE_ENV === "development",

  // 성능 모니터링 설정
  tracesSampleRate: process.env.NODE_ENV === "production" ? 0.2 : 1.0,

  // 세션 리플레이 설정
  replaysSessionSampleRate: 0.1, // 일반 세션의 10%
  replaysOnErrorSampleRate: 1.0, // 에러 발생 시 100%

  // 추가 설정
  enableTracing: true,
  normalizeDepth: 10,
  attachStacktrace: true,
  autoSessionTracking: true,
};

Sentry.init(SENTRY_CONFIG);
