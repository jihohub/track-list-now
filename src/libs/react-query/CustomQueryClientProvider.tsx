import * as Sentry from "@sentry/nextjs";
import {
  DefaultError,
  Mutation,
  MutationCache,
  Query,
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";

type ErrorHandler = (error: Error) => void;

const handleError: ErrorHandler = (error) => {
  if (error instanceof Error) {
    if (error.name === "NetworkError") {
      Sentry.captureException(error, {
        tags: { errorType: "networkError" },
      });
    } else if (error instanceof TypeError) {
      Sentry.captureException(error, {
        tags: { errorType: "typeError" },
      });
    } else {
      Sentry.captureException(error, {
        tags: { errorType: "queryError" },
      });
    }
  }
};

const queryCache = new QueryCache({
  onError: (error: DefaultError, query: Query<unknown, unknown, unknown>) => {
    Sentry.withScope((scope) => {
      scope.setTag("errorType", "queryError");
      scope.setExtra("queryKey", query.queryKey);
      handleError(error);
    });
  },
});

const mutationCache = new MutationCache({
  onError: (
    error: DefaultError,
    variables: unknown,
    context: unknown,
    mutation: Mutation<unknown, unknown, unknown>,
  ) => {
    Sentry.withScope((scope) => {
      scope.setTag("errorType", "mutationError");
      if (mutation.options.mutationKey) {
        scope.setExtra("mutationKey", mutation.options.mutationKey);
      }
      scope.setExtra("variables", variables);
      scope.setExtra("context", context);
      handleError(error);
    });
  },
});

const queryClient = new QueryClient({
  queryCache,
  mutationCache,
  defaultOptions: {
    queries: {
      retry: (failureCount, error) => {
        if (error instanceof Error) {
          // 네트워크 에러일 경우에만 재시도
          return error.name === "NetworkError" && failureCount < 3;
        }
        return false;
      },
      staleTime: 5 * 60 * 1000,
    },
    mutations: {},
  },
});

interface CustomQueryClientProviderProps {
  children: React.ReactNode;
}

const CustomQueryClientProvider = ({
  children,
}: CustomQueryClientProviderProps) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

export default CustomQueryClientProvider;
