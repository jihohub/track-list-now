interface NoResultsMessageProps {
  message: string;
}

const NoResultsMessage = ({ message }: NoResultsMessageProps) => {
  return <p className="mt-4 text-sm text-white">{message}</p>;
};

export default NoResultsMessage;
