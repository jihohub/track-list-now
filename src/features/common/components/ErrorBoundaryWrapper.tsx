import ErrorFallback from "@/features/common/components/ErrorFallback";
import { ReactNode } from "react";
import { ErrorBoundary } from "react-error-boundary";

interface ErrorBoundaryWrapperProps {
  children: ReactNode;
}

const ErrorBoundaryWrapper = ({ children }: ErrorBoundaryWrapperProps) => (
  <ErrorBoundary
    FallbackComponent={ErrorFallback}
    onReset={() => {
      // TODO: 리셋 시 동작
      window.location.reload();
    }}
    // onError={(error, info) => {
    //   // TODO: 추후 Sentry 연결 가능
    // }}
  >
    {children}
  </ErrorBoundary>
);

export default ErrorBoundaryWrapper;
