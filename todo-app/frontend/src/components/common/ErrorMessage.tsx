interface ErrorMessageProps {
  message: string;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message }) => {
  return <p className="text-error text-center text-md py-1">{message}</p>;
};

export default ErrorMessage;
