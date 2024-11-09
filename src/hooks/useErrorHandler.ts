import { AppError } from "@/types/error";
import * as Sentry from "@sentry/nextjs";
import { UseQueryResult } from "@tanstack/react-query";
import { useMemo } from "react";

export const useErrorHandler = <T>(query: UseQueryResult<T, Error>) => {
  const error = useMemo(() => {
    if (!query.error) return null;

    const appError =
      query.error instanceof AppError
        ? query.error
        : new AppError(query.error.message, {
            severity: "error",
            errorCode: "QUERY_ERROR",
          });

    Sentry.captureException(appError);
    return appError;
  }, [query.error]);

  return {
    ...query,
    error,
  };
};

export default useErrorHandler;
