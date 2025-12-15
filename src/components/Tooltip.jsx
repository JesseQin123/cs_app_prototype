import React from 'react';
import * as TooltipPrimitive from '@radix-ui/react-tooltip';

const Tooltip = ({ content, children, className = '', maxWidth = 'max-w-xs' }) => {
  return (
    <TooltipPrimitive.Provider delayDuration={100}>
      <TooltipPrimitive.Root>
        <TooltipPrimitive.Trigger asChild>
          <div className={`inline-flex items-center cursor-help ${className}`}>
             {children}
          </div>
        </TooltipPrimitive.Trigger>
        <TooltipPrimitive.Portal>
          <TooltipPrimitive.Content
            className={`
                z-50 overflow-hidden rounded-md bg-gray-900 px-3 py-2 text-xs text-white shadow-md 
                animate-in fade-in zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out data-[state=closed]:zoom-out-95 
                data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 
                data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2
                ${maxWidth} text-center leading-relaxed
            `}
            sideOffset={5}
          >
            {content}
            <TooltipPrimitive.Arrow className="fill-gray-900" />
          </TooltipPrimitive.Content>
        </TooltipPrimitive.Portal>
      </TooltipPrimitive.Root>
    </TooltipPrimitive.Provider>
  );
};

export default Tooltip;
