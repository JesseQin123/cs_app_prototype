import React from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { X } from 'lucide-react';

/**
 * Global Unified Dialog Component
 * 
 * Features:
 * - Centered layout with backdrop blur
 * - Premium animation (fade + zoom)
 * - Standardized header and footer slots
 * - "Luxe" aesthetic (clean borders, shadows)
 */
const Dialog = ({ 
    isOpen, 
    onOpenChange, 
    title, 
    description,
    children, 
    footer,
    maxWidth = 'max-w-md',
    showCloseButton = true,
    contentClassName = ""
}) => {
    return (
        <DialogPrimitive.Root open={isOpen} onOpenChange={onOpenChange}>
            <DialogPrimitive.Portal>
                {/* Backdrop */}
                <DialogPrimitive.Overlay className="fixed inset-0 bg-black/40 backdrop-blur-sm z-9999 animate-in fade-in duration-200" />
                
                {/* Content */}
                <DialogPrimitive.Content 
                    className={`
                        fixed left-1/2 top-1/2
                        w-full ${maxWidth} 
                        bg-white rounded-xl shadow-2xl border border-gray-100 
                        z-10000 overflow-hidden 
                        animate-dialog-enter
                        focus:outline-none
                        ${contentClassName}
                    `}
                >
                    {/* Header (Optional - Only renders if title provided) */}
                    {title && (
                        <div className="px-6 py-5 border-b border-gray-50 flex items-center justify-between bg-white relative">
                            <div>
                                <DialogPrimitive.Title className="text-lg font-bold text-gray-900 tracking-tight">{title}</DialogPrimitive.Title>
                                {description && <DialogPrimitive.Description className="text-sm text-gray-500 mt-1">{description}</DialogPrimitive.Description>}
                            </div>
                            {showCloseButton && (
                                <DialogPrimitive.Close className="text-gray-400 hover:text-gray-900 transition-colors p-1 rounded-full hover:bg-gray-100">
                                    <X size={20} />
                                </DialogPrimitive.Close>
                            )}
                        </div>
                    )}
                    
                    {/* Floating Close Button (If no title but close is wanted) */}
                    {!title && showCloseButton && (
                         <div className="absolute top-4 right-4 z-10">
                            <DialogPrimitive.Close className="text-gray-400 hover:text-gray-900 transition-colors p-1 rounded-full hover:bg-gray-100">
                                <X size={20} />
                            </DialogPrimitive.Close>
                        </div>
                    )}

                    {/* Body */}
                    <div className={title ? "p-6" : "p-0"}>
                        {children}
                    </div>

                    {/* Footer (Optional) */}
                    {footer && (
                        <div className="px-6 py-4 bg-gray-50/50 border-t border-gray-100 flex items-center justify-end gap-3">
                            {footer}
                        </div>
                    )}
                </DialogPrimitive.Content>
            </DialogPrimitive.Portal>
        </DialogPrimitive.Root>
    );
};

export default Dialog;
