import React, { useState, useRef, useEffect, useLayoutEffect } from 'react';
import { createPortal } from 'react-dom';

const Popover = ({ 
  trigger, 
  content, 
  position = 'bottom',
  className = '',
  offset = 8,
  isOpen: managedIsOpen, 
  onOpenChange,
  stopPropagation = true
}) => {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const isControlled = managedIsOpen !== undefined;
  const isOpen = isControlled ? managedIsOpen : internalIsOpen;
  const setIsOpen = React.useCallback((val) => {
    if (onOpenChange) onOpenChange(val);
    if (!isControlled) setInternalIsOpen(val);
  }, [onOpenChange, isControlled]);
  
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const triggerRef = useRef(null);
  const contentRef = useRef(null);

    const [effectivePosition, setEffectivePosition] = useState(position);

    const calculatePosition = React.useCallback(() => {
    if (!triggerRef.current || !isOpen) return;

    const triggerRect = triggerRef.current.getBoundingClientRect();
    const contentRect = contentRef.current?.getBoundingClientRect() || { height: 0, width: 0 };
    
    const scrollX = window.scrollX;
    const scrollY = window.scrollY;
    const viewportHeight = window.innerHeight;
    const viewportWidth = window.innerWidth;

    let newPos = position;
    
    // Smart Flip Logic for Bottom -> Top
    if (position === 'bottom') {
        const spaceBelow = viewportHeight - triggerRect.bottom;
        // If it doesn't fit below (with some buffer) and fits better above
        if (contentRect.height > 0 && spaceBelow < contentRect.height + offset && triggerRect.top > contentRect.height + offset) {
            newPos = 'top';
        }
    }
    // Smart Flip Logic for Top -> Bottom
    else if (position === 'top') {
        if (triggerRect.top < contentRect.height + offset && (viewportHeight - triggerRect.bottom) > contentRect.height + offset) {
            newPos = 'bottom';
        }
    }

    setEffectivePosition(prev => prev !== newPos ? newPos : prev);

    let top = 0;
    let left = 0;

    if (newPos === 'bottom') {
        top = triggerRect.bottom + scrollY + offset;
        left = triggerRect.left + scrollX + (triggerRect.width / 2);
    } else if (newPos === 'top') {
        top = triggerRect.top + scrollY - offset;
        left = triggerRect.left + scrollX + (triggerRect.width / 2);
    }
    
    // Horizontal Safety
    // Note: Since we translate-x-1/2, center is at 'left'. 
    // Right Edge = left + width/2. Left Edge = left - width/2.
    if (contentRect.width > 0) {
        const checkRight = left + (contentRect.width / 2);
        const checkLeft = left - (contentRect.width / 2);
        
        if (checkRight > viewportWidth - 20) {
            left -= (checkRight - (viewportWidth - 20)); // Shift left
        } else if (checkLeft < 20) {
            left += (20 - checkLeft); // Shift right
        }
    }

    setCoords(prev => (prev.top !== top || prev.left !== left) ? { top, left } : prev);
  }, [isOpen, position, offset]);

  useLayoutEffect(() => {
    calculatePosition();
    // Re-calculate on position flip or content size change requires a dependency
    // But content height change is hard to listen to without ResizeObserver. 
    // For now, let's assume content is static size after render.
    window.addEventListener('resize', calculatePosition);
    window.addEventListener('scroll', calculatePosition, true); 
    
    return () => {
        window.removeEventListener('resize', calculatePosition);
        window.removeEventListener('scroll', calculatePosition, true);
    };
  }, [calculatePosition, isOpen]); 

  // Use ResizeObserver for content size changes if contentRef exists
  useEffect(() => {
     if (!contentRef.current || !isOpen) return;
     
     const resizeObserver = new ResizeObserver(() => {
         calculatePosition();
     });
     resizeObserver.observe(contentRef.current);
     
     return () => resizeObserver.disconnect();
  }, [isOpen, calculatePosition]);

  useEffect(() => {
    const handleClickOutside = (event) => {
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
  }, [isOpen, setIsOpen]);

  const toggle = (e) => {
      if (stopPropagation) e.stopPropagation();
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
            className={`transform -translate-x-1/2 ${effectivePosition === 'top' ? '-translate-y-full' : ''}`}
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
