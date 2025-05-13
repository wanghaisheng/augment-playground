// src/components/common/ErrorDisplay.tsx
import React from 'react';
import type { ApiError } from '@/types';
import Button from './Button'; // Use our common Button

interface ErrorDisplayProps {
  error: ApiError | Error | null;
  title?: string;
  messageTemplate?: string;
  onRetry?: () => void;
  retryButtonText?: string;
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({
  error,
  title = "Error", // Fallback title
  messageTemplate = "Details: {message}",
  onRetry,
  retryButtonText = "Try Again",
}) => {
  if (!error) return null;

  const errorMessage = error.message || "An unknown error occurred.";
  const finalMessage = messageTemplate.replace('{message}', errorMessage);
  const errorCode = (error as ApiError)?.errorCode;
  const statusCode = (error as ApiError)?.statusCode;

  return (
    <div className="error-container" role="alert">
      <h3>{title}</h3>
      <p className="error-text">{finalMessage}</p>
      {errorCode && <p className="error-code-text">Error Code: {errorCode}</p>}
      {statusCode && <p className="error-code-text">Status Code: {statusCode}</p>}
      {onRetry && (
        <Button onClick={onRetry} variant="secondary" style={{ marginTop: '10px' }}>
          {retryButtonText}
        </Button>
      )}
    </div>
  );
};
export default ErrorDisplay; 