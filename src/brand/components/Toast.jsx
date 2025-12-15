import React, { useEffect, useState, useCallback } from 'react';
import { CheckCircle2, XCircle, AlertCircle, Info, X } from 'lucide-react';

const Toast = ({ id, message, type = 'info', duration = 3000, onClose }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);

  const handleClose = useCallback(() => {
    setIsVisible(false);
    setIsRemoving(true);
    // Wait for exit animation to finish before actual removal
    setTimeout(() => {
      onClose(id);
    }, 300);
  }, [id, onClose]);

  useEffect(() => {
    // Trigger entrance animation
    requestAnimationFrame(() => setIsVisible(true));

    // Auto dismiss
    const timer = setTimeout(() => {
      handleClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, handleClose]);

  const icons = {
    success: <CheckCircle2 size={20} className="text-green-500" />,
    error: <XCircle size={20} className="text-red-500" />,
    warning: <AlertCircle size={20} className="text-amber-500" />,
    info: <Info size={20} className="text-blue-500" />
  };

  const styles = {
    success: 'bg-white border-green-100 ring-1 ring-green-50',
    error: 'bg-white border-red-100 ring-1 ring-red-50',
    warning: 'bg-white border-amber-100 ring-1 ring-amber-50',
    info: 'bg-white border-blue-100 ring-1 ring-blue-50'
  };

  return (
    <div 
      className={`
        pointer-events-auto w-full max-w-sm overflow-hidden rounded-lg shadow-lg border transition-all duration-300 ease-out transform
        ${styles[type] || styles.info}
        ${isVisible ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-2 opacity-0 scale-95'}
        ${isRemoving ? 'translate-y-2 opacity-0 scale-95' : ''}
      `}
      role="alert"
    >
      <div className="p-4">
        <div className="flex items-start">
          <div className="shrink-0">
            {icons[type] || icons.info}
          </div>
          <div className="ml-3 w-0 flex-1 pt-0.5">
            <p className="text-sm font-medium text-gray-900">
              {message}
            </p>
          </div>
          <div className="ml-4 flex shrink-0">
            <button
              type="button"
              className="inline-flex rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-hidden focus:ring-2 focus:ring-black focus:ring-offset-2"
              onClick={handleClose}
            >
              <span className="sr-only">Close</span>
              <X className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Toast;
