// /components/ErrorFallback.tsx
import { useTranslation } from "next-i18next";
import { FallbackProps } from "react-error-boundary";

const ErrorFallback = ({ error, resetErrorBoundary }: FallbackProps) => {
  const { t } = useTranslation("error");

  return (
    <div
      role="alert"
      className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-4"
    >
      <h2 className="text-4xl font-bold mb-4">{t("something_went_wrong")}</h2>
      <p className="mb-4">{error.message}</p>
      <button
        onClick={resetErrorBoundary}
        className="bg-sky-800 text-white px-4 py-2 rounded-lg"
      >
        {t("try_again")}
      </button>
    </div>
  );
};

export default ErrorFallback;
