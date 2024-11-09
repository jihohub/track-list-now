import { useTranslation } from "next-i18next";

interface ErrorFallbackProps {
  error: Error;
  componentStack?: string;
  resetErrorBoundary: () => void;
}

const ErrorFallback = ({
  error,
  componentStack,
  resetErrorBoundary,
}: ErrorFallbackProps) => {
  const { t } = useTranslation("error");

  return (
    <div
      role="alert"
      className="max-w-4xl mobile:mx-6 tablet:mx-6 mx-auto p-6 h-[500px] bg-zinc-800 rounded-lg shadow-md"
    >
      <div className="flex flex-col gap-20 w-full">
        <h2 className="text-3xl text-white font-bold text-center">
          {t("something_went_wrong")}
        </h2>

        <div className="flex justify-center items-center rounded-lg p-4 space-y-2 h-40">
          <p className="text-red-500 font-medium">{error.message}</p>

          {/* 개발 환경에서만 스택 정보 표시 */}
          {process.env.NODE_ENV === "development" && componentStack && (
            <details className="mt-2">
              <summary className="cursor-pointer text-gray-400 hover:text-gray-300">
                {t("show_stack_trace")}
              </summary>
              <pre className="mt-2 p-2 bg-gray-700 rounded text-xs text-gray-300 overflow-x-auto">
                {componentStack}
              </pre>
            </details>
          )}
        </div>

        <div className="flex flex-col items-center space-y-2">
          <button
            onClick={resetErrorBoundary}
            className="bg-persianBlue text-white px-6 py-2 rounded-lg hover:bg-neonBlue transition-colors"
            type="button"
          >
            {t("try_again")}
          </button>

          <p className="text-sm text-gray-400">
            {t("error_persistence_message")}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ErrorFallback;
