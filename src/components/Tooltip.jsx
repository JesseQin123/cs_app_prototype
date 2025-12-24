import React from 'react';
import * as TooltipPrimitive from '@radix-ui/react-tooltip';

const Tooltip = ({ content, children, className = '', maxWidth = 'max-w-xs', variant = 'dark', ...props }) => {
  const variantClasses = variant === 'light' 
    ? 'bg-white text-gray-900 shadow-xl border border-gray-100 p-0' 
    : 'bg-gray-900 text-white shadow-md px-3 py-2 text-center leading-relaxed';

  return (
    <TooltipPrimitive.Provider delayDuration={100}>
      <TooltipPrimitive.Root>
        <TooltipPrimitive.Trigger asChild>
          <div className={`inline-flex items-center cursor-help ${className}`} {...props}>
             {children}
          </div>
        </TooltipPrimitive.Trigger>
        <TooltipPrimitive.Portal>
          <TooltipPrimitive.Content
            className={`
                z-50 overflow-hidden rounded-md text-xs
                animate-in fade-in zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out data-[state=closed]:zoom-out-95 
                data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 
                data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2
                ${maxWidth} ${variantClasses}
            `}
            sideOffset={5}
          >
            {content}
            <TooltipPrimitive.Arrow className={variant === 'light' ? "fill-white" : "fill-gray-900"} />
          </TooltipPrimitive.Content>
        </TooltipPrimitive.Portal>
      </TooltipPrimitive.Root>
    </TooltipPrimitive.Provider>
  );
};

export default Tooltip;
