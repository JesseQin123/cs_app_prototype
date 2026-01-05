import React from 'react';
import { WifiOff, RefreshCw, CheckCircle2 } from 'lucide-react';

export function ServiceStatus({ status, onRetry }) {
  if (status === 'online') {
    return null; // Don't show anything when online
  }

  if (status === 'offline') {
    return (
      <div className="flex items-center justify-between p-4 bg-amber-50 border border-amber-200 rounded-xl">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-amber-100 rounded-lg">
            <WifiOff className="w-5 h-5 text-amber-600" />
          </div>
          <div>
            <h4 className="text-sm font-medium text-amber-800">
              Search service unavailable
            </h4>
            <p className="text-xs text-amber-600 mt-0.5">
              Make sure Vespa search service is running
            </p>
          </div>
        </div>
        <button
          onClick={onRetry}
          className="flex items-center gap-2 px-3 py-1.5 bg-amber-100 text-amber-700
                     text-sm rounded-lg hover:bg-amber-200 transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          Retry
        </button>
      </div>
    );
  }

  // Unknown status - checking
  return (
    <div className="flex items-center gap-3 p-4 bg-gray-50 border border-gray-200 rounded-xl">
      <RefreshCw className="w-5 h-5 text-gray-400 animate-spin" />
      <span className="text-sm text-gray-600">Checking search service...</span>
    </div>
  );
}

// Compact inline status indicator
export function ServiceStatusBadge({ status }) {
  if (status === 'online') {
    return (
      <div className="flex items-center gap-1.5 text-xs text-green-600">
        <CheckCircle2 className="w-3.5 h-3.5" />
        <span>Connected</span>
      </div>
    );
  }

  if (status === 'offline') {
    return (
      <div className="flex items-center gap-1.5 text-xs text-amber-600">
        <WifiOff className="w-3.5 h-3.5" />
        <span>Offline</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1.5 text-xs text-gray-400">
      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
      <span>Checking...</span>
    </div>
  );
}

export default ServiceStatus;
