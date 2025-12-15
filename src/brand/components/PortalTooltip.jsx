import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';

const PortalTooltip = ({ content, children }) => {
    const [isVisible, setIsVisible] = useState(false);
    const [position, setPosition] = useState({ top: 0, left: 0 });
    const triggerRef = useRef(null);

    const updatePosition = () => {
        if (triggerRef.current) {
            const rect = triggerRef.current.getBoundingClientRect();
            // Default to top center
            setPosition({
                top: rect.top - 8, // 8px Offset above
                left: rect.left + rect.width / 2
            });
        }
    };

    const handleMouseEnter = () => {
        updatePosition();
        setIsVisible(true);
    };

    const handleMouseLeave = () => {
        setIsVisible(false);
    };

    // Update position on scroll or resize when visible
    useEffect(() => {
        if (isVisible) {
            window.addEventListener('scroll', updatePosition, true);
            window.addEventListener('resize', updatePosition);
            return () => {
                window.removeEventListener('scroll', updatePosition, true);
                window.removeEventListener('resize', updatePosition);
            };
        }
    }, [isVisible]);

    return (
        <div 
            className="relative inline-block"
            ref={triggerRef}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            {children}
            {isVisible && createPortal(
                <div 
                    className="fixed z-9999 pointer-events-none animate-in fade-in zoom-in-95 duration-150"
                    style={{ 
                        top: position.top, 
                        left: position.left,
                        transform: 'translate(-50%, -100%)' 
                    }}
                >
                    <div className="bg-gray-900 text-white text-[10px] font-bold px-2 py-1 rounded-sm shadow-lg whitespace-nowrap relative">
                        {content}
                        {/* Little Arrow */}
                        <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
                    </div>
                </div>,
                document.body
            )}
        </div>
    );
};

export default PortalTooltip;
