// src/components/common/ErrorDisplay.tsx
import React from 'react';
import type { ApiError } from '@/types';
import Button from './Button'; // Use our common Button
import { useComponentLabels } from '@/hooks/useComponentLabels';

interface ErrorDisplayProps {
  error: ApiError | Error | null;
  title?: string;
  messageTemplate?: string;
  onRetry?: () => void;
  retryButtonText?: string;
  errorType?: 'generic' | 'network' | 'server' | 'unknown';
}

/**
 * Error display component with localized text support
 *
 * @param error - The error object to display
 * @param title - Optional custom title (overrides localized title)
 * @param messageTemplate - Optional custom message template (overrides localized template)
 * @param onRetry - Optional retry callback function
 * @param retryButtonText - Optional custom retry button text (overrides localized text)
 * @param errorType - Type of error, used to select appropriate localized text if no custom text is provided
 */
const ErrorDisplay: React.FC<ErrorDisplayProps> = ({
  error,
  title,
  messageTemplate,
  onRetry,
  retryButtonText,
  errorType = 'generic',
}) => {
  const { labels } = useComponentLabels();

  // Use provided values or fall back to localized labels
  const displayTitle = title || labels.error.title;
  const displayMessageTemplate = messageTemplate || labels.error.details;
  const displayRetryButtonText = retryButtonText || labels.error.retry;
  if (!error) return null;

  const errorMessage = error.message || labels.error.unknownError;
  const finalMessage = displayMessageTemplate.replace('{message}', errorMessage);
  const errorCode = (error as ApiError)?.errorCode;
  const statusCode = (error as ApiError)?.statusCode;

  return (
    <div className="error-container" role="alert">
      <h3>{displayTitle}</h3>
      <p className="error-text">{finalMessage}</p>
      {errorCode && <p className="error-code-text">Error Code: {errorCode}</p>}
      {statusCode && <p className="error-code-text">Status Code: {statusCode}</p>}
      {onRetry && (
        <Button onClick={onRetry} variant="secondary" style={{ marginTop: '10px' }}>
          {displayRetryButtonText}
        </Button>
      )}
    </div>
  );
};
export default ErrorDisplay;