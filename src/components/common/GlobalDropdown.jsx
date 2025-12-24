import React, { useRef, useState, useLayoutEffect, useEffect } from 'react';
import { createPortal } from 'react-dom';

const GlobalDropdown = ({ 
  children, 
  anchorEl, 
  isOpen, 
  onClose,
  width = 192, // w-48 = 12rem = 192px
  className = ""
}) => {
  const menuRef = useRef(null);
  // Initial state: hidden (to measure), top/left 0
  const [style, setStyle] = useState({ top: 0, left: 0, opacity: 0 });

  useLayoutEffect(() => {
    if (isOpen && anchorEl && menuRef.current) {
      const buttonRect = anchorEl.getBoundingClientRect();
      const menuRect = menuRef.current.getBoundingClientRect();
      
      const GAP = 4;
      const VIEWPORT_PADDING = 10;
      
      // --- Horizontal Positioning (Align Right Edge) ---
      let left = buttonRect.right + window.scrollX - width;
      
      // Safety Check: Left Edge
      if (left < VIEWPORT_PADDING) {
          left = buttonRect.left + window.scrollX; // Align Left if Right goes off-screen
      }
      
      // Safety Check: Right Edge (Absolute fallback)
      if (left + width > window.innerWidth - VIEWPORT_PADDING) {
          left = window.innerWidth - width - VIEWPORT_PADDING;
      }

      // --- Vertical Positioning (Smart Flip) ---
      // Default: Top-Down
      let top = buttonRect.bottom + window.scrollY + GAP;
      
      const spaceBelow = window.innerHeight - buttonRect.bottom;
      const spaceAbove = buttonRect.top;
      const menuHeight = menuRect.height;
      
      // Flip logic: If not enough space below AND enough space above
      if (spaceBelow < menuHeight + VIEWPORT_PADDING && spaceAbove > menuHeight + VIEWPORT_PADDING) {
          top = buttonRect.top + window.scrollY - menuHeight - GAP;
      }

      setStyle({ top, left, opacity: 1 });
    } else if (!isOpen) {
      // Reset to hidden state when closed, so next open triggers a fresh measurement flow
      setStyle(prev => ({ ...prev, opacity: 0 }));
    }
  }, [isOpen, anchorEl, width]);

  // Click outside & Scroll Handling
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event) => {
      // Don't close if clicking trigger button (let parent handle toggle)
      if (anchorEl && anchorEl.contains(event.target)) {
          return;
      }
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        onClose();
      }
    };

    const handleResizeOrScroll = () => {
        onClose();
    };

    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('resize', handleResizeOrScroll);
    window.addEventListener('scroll', handleResizeOrScroll, true); // Capture phase capturing all scrolls

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('resize', handleResizeOrScroll);
      window.removeEventListener('scroll', handleResizeOrScroll, true);
    };
  }, [isOpen, onClose, anchorEl]);

  if (!isOpen) return null;

  return createPortal(
    <div 
      ref={menuRef}
      className={`fixed z-50 bg-white rounded-lg shadow-xl border border-gray-100 py-1 text-left ${className}`}
      style={{ 
        top: style.top, 
        left: style.left, 
        width: width,
        opacity: style.opacity,
        // Removed 'transition' to make positioning instant and crisp
      }}
      onClick={(e) => e.stopPropagation()} 
    >
      {children}
    </div>,
    document.body
  );
};

export default GlobalDropdown;
