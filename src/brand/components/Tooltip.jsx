import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';

const Tooltip = ({ content, children, className = '' }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const triggerRef = useRef(null);

  useEffect(() => {
    if (isVisible && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      setCoords({
        top: rect.top - 10, // 10px offset above
        left: rect.left + rect.width / 2
      });
    }
  }, [isVisible]);

  return (
    <div 
      ref={triggerRef}
      className={`relative inline-flex items-center ${className}`}
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      {isVisible && createPortal(
        <div 
            className="fixed px-2 py-1 bg-gray-900 text-white text-xs rounded-sm shadow-lg whitespace-nowrap z-9999 animate-in fade-in zoom-in-95 pointer-events-none"
            style={{ 
                top: coords.top, 
                left: coords.left,
                transform: 'translate(-50%, -100%)' 
            }}
        >
          {content}
          {/* Arrow */}
          <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-px border-4 border-transparent border-t-gray-900"></div>
        </div>,
        document.body
      )}
    </div>
  );
};

export default Tooltip;
