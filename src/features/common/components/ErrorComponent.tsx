import { useTranslation } from "next-i18next";

interface ErrorComponentProps {
  message: string;
}

const ErrorComponent = ({ message }: ErrorComponentProps) => {
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
          <p className="text-red-500 font-medium">{message}</p>
        </div>
      </div>
    </div>
  );
};

export default ErrorComponent;
