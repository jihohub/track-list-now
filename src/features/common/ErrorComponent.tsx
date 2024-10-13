interface ErrorComponentProps {
  message: string;
}

const ErrorComponent = ({ message }: ErrorComponentProps) => (
  <div className="flex justify-center items-center h-screen">
    <p className="text-red-500 text-xl">{message}</p>
  </div>
);

export default ErrorComponent;
