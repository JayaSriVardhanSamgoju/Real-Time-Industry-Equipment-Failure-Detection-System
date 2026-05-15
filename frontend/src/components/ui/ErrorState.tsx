import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { COPY } from '@/config/copy';

interface Props {
  message?: string;
  onRetry?: () => void;
}

export const ErrorState: React.FC<Props> = ({
  message = COPY.errors.connectionFailed,
  onRetry,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <div className="w-12 h-12 rounded-full bg-red/10 flex items-center justify-center mb-3">
        <AlertTriangle className="w-6 h-6 text-red" />
      </div>
      <p className="text-text-secondary text-sm font-body mb-4">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="flex items-center gap-2 px-4 py-2 rounded-card bg-bg-elevated border border-bg-border text-text-secondary text-sm hover:border-cyan hover:text-cyan transition-all"
        >
          <RefreshCw className="w-4 h-4" />
          Retry
        </button>
      )}
    </div>
  );
};
