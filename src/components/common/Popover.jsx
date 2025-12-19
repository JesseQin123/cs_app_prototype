import React, { useState, useRef, useEffect, useLayoutEffect } from 'react';
import { createPortal } from 'react-dom';

const Popover = ({ 
  trigger, 
  content, 
  position = 'bottom',
  className = '',
  offset = 8,
  isOpen: managedIsOpen, 
  onOpenChange
}) => {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const isControlled = managedIsOpen !== undefined;
  const isOpen = isControlled ? managedIsOpen : internalIsOpen;
  const setIsOpen = (val) => {
    if (onOpenChange) onOpenChange(val);
    if (!isControlled) setInternalIsOpen(val);
  };
  
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const triggerRef = useRef(null);
  const contentRef = useRef(null);

  const calculatePosition = () => {
    if (!triggerRef.current || !isOpen) return;

    const triggerRect = triggerRef.current.getBoundingClientRect();
    const scrollX = window.scrollX;
    const scrollY = window.scrollY;

    let top = 0;
    let left = 0;

    // Simple positioning logic (MVP) - can be expanded
    if (position === 'bottom') {
        top = triggerRect.bottom + scrollY + offset;
        left = triggerRect.left + scrollX + (triggerRect.width / 2); // Center align initially
    } else if (position === 'top') {
        top = triggerRect.top + scrollY - offset;
        left = triggerRect.left + scrollX + (triggerRect.width / 2);
    }

    // Centering adjustment handled in CSS transform or here. 
    // Let's do CSS translate-x-1/2 for centering.
    
    setCoords({ top, left });
  };

  useLayoutEffect(() => {
    calculatePosition();
    window.addEventListener('resize', calculatePosition);
    window.addEventListener('scroll', calculatePosition, true); // true for capturing scroll in parents
    
    return () => {
        window.removeEventListener('resize', calculatePosition);
        window.removeEventListener('scroll', calculatePosition, true);
    };
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      // If click is on trigger or inside content, ignore
      if (
        triggerRef.current?.contains(event.target) || 
        contentRef.current?.contains(event.target)
      ) {
        return;
      }
      setIsOpen(false);
    };

    if (isOpen) {
        document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const toggle = (e) => {
      e.stopPropagation();
      setIsOpen(!isOpen);
  };

  return (
    <>
      {/* Trigger Wrapper */}
      <div 
        ref={triggerRef} 
        onClick={toggle} 
        className="inline-block"
      >
        {trigger}
      </div>

      {/* Portal Content */}
      {isOpen && createPortal(
        <div
            ref={contentRef}
            style={{ 
                top: coords.top, 
                left: coords.left,
                position: 'absolute',
                zIndex: 9999 
            }}
            className={`transform -translate-x-1/2 ${position === 'top' ? '-translate-y-full' : ''}`}
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
        >
            <div className={`bg-white rounded-xl shadow-xl border border-gray-100 animate-in fade-in zoom-in-95 duration-200 overflow-hidden ${className}`}>
                {content}
            </div>
        </div>,
        document.body
      )}
    </>
  );
};

export default Popover;
