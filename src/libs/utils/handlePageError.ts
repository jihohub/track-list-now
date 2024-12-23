import ErrorProcessor from "@/libs/utils/errorProcessor";
import { AppError } from "@/types/error";

const handlePageError = (error: unknown) => {
  if (error instanceof AppError) {
    ErrorProcessor.logToSentry(error);
    return error.message;
  }

  const processedError = ErrorProcessor.processError(error);
  ErrorProcessor.logToSentry(processedError);
  return processedError.message;
};

export default handlePageError;
