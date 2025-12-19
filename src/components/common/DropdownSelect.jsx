import React, { useState, useRef, useEffect, useLayoutEffect } from 'react';
import { createPortal } from 'react-dom';
import { ChevronDown, X, Check, Search } from 'lucide-react';

const DropdownSelect = ({ 
  label, 
  value, 
  onChange, 
  options, 
  placeholder = "Select...", 
  icon: Icon,
  className = "",
  searchable = false, // Added prop
  triggerLabel = null, // Optional override for trigger text (e.g. for "Add Filter" style)
  usePortal = false // New prop to enable portal rendering
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef(null);

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
        setSearchTerm(''); // Reset search on close
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (optionValue) => {
    onChange(optionValue);
    setIsOpen(false);
    setSearchTerm('');
  };

  const clearSelection = (e) => {
    e.stopPropagation();
    if (options.length > 0) {
        onChange(options[0].value || options[0]); 
    }
  };
  
  // Determine display text. Options can be strings or objects {label, value}
  const getLabel = (val) => {
      const option = options.find(o => (o.value || o) === val);
      if (!option) return val;
      return option.label || option.value || option;
  };

  const isSelected = (optionVal) => {
      return (optionVal.value || optionVal) === value;
  };

  // Check if current value is NOT the first option (default), to show clear button or highlight
  const isModified = value !== (options[0]?.value || options[0]);

  // Filter options based on search
  const filteredOptions = options.filter(option => {
      if (!searchTerm) return true;
      const label = (option.label || option.value || option).toString().toLowerCase();
      return label.includes(searchTerm.toLowerCase());
  });

  // Positioning state for Portal mode
  const [coords, setCoords] = useState({ top: 0, left: 0, width: 0 });

  const updatePosition = () => {
        if (dropdownRef.current) {
            const rect = dropdownRef.current.getBoundingClientRect();
            setCoords({
                top: rect.bottom + window.scrollY + 4,
                left: rect.left + window.scrollX,
                width: rect.width
            });
        }
  };

  const handleToggle = () => {
      // e.stopPropagation(); // Optional, but usually good for dropdown triggers
      if (!isOpen) {
          if (usePortal) {
               updatePosition();
          }
          setIsOpen(true);
      } else {
          setIsOpen(false);
      }
  };

  // Keep updates live on scroll/resize
  useLayoutEffect(() => {
    if (usePortal && isOpen) {
        window.addEventListener('scroll', updatePosition, true);
        window.addEventListener('resize', updatePosition);
        return () => {
            window.removeEventListener('scroll', updatePosition, true);
            window.removeEventListener('resize', updatePosition);
        };
    }
  }, [isOpen, usePortal]);


  const menuContent = (
      <div 
        className={`
            bg-white border border-gray-100 rounded-lg shadow-xl animate-in fade-in duration-100 flex flex-col
            ${usePortal ? 'fixed z-[9999] max-h-60' : 'absolute z-50 w-full min-w-[200px] mt-1 max-h-60'}
        `}
        style={usePortal ? {
             top: coords.top,
             left: coords.left,
             width: coords.width,
             minWidth: 'max-content'
        } : {}}
        onMouseDown={(e) => usePortal && e.stopPropagation()} // Prevent parent popovers from closing
      >
             {/* Search Input */}
            {searchable && (
                <div className="p-2 border-b border-gray-50 flex items-center gap-2 sticky top-0 bg-white z-10">
                    <Search size={14} className="text-gray-400" />
                    <input 
                        type="text"
                        placeholder="Search..."
                        className="w-full text-xs outline-hidden placeholder:text-gray-300 text-gray-700 font-medium"
                        onClick={(e) => e.stopPropagation()}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        value={searchTerm}
                        autoFocus
                    />
                </div>
            )}
            
            <div className="py-1 overflow-y-auto">
                {filteredOptions.length > 0 ? (
                    filteredOptions.map((option, idx) => {
                        const optValue = option.value || option;
                        const optLabel = option.label || option.value || option;
                        const active = isSelected(optValue);
                        
                        return (
                            <div 
                                key={idx}
                                onClick={(e) => { e.stopPropagation(); handleSelect(optValue); }}
                                className={`
                                    px-3 py-2 text-sm cursor-pointer flex items-center justify-between
                                    transition-colors duration-150
                                    ${active ? 'bg-gray-50 text-black font-medium' : 'text-gray-700 hover:bg-gray-50'}
                                `}
                            >
                                <span className="truncate">{optLabel}</span>
                                {active && <Check size={14} className="shrink-0 ml-2" />}
                            </div>
                        );
                    })
                ) : (
                    <div className="px-3 py-2 text-xs text-gray-400 italic text-center">No matches found</div>
                )}
            </div>
      </div>
  );

  return (
    <div className={`relative min-w-[120px] ${className}`} ref={dropdownRef}>
      {/* Trigger Button */}
      <div 
        onClick={handleToggle}
        className={`
            w-full flex items-center justify-between px-3 py-2 
            bg-white border rounded-lg cursor-pointer transition-all duration-200
            ${isOpen ? 'border-black ring-1 ring-black shadow-xs' : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'}
        `}
      >
        <div className="flex items-center gap-2 truncate pr-2">
            {Icon && <Icon size={14} className="text-gray-400 shrink-0" />}
            <span className={`text-sm font-medium truncate ${isModified ? 'text-gray-900' : 'text-gray-600'}`}>
                {/* Support generic label mode for "Pill" UX */}
                {triggerLabel ? (
                    <div className="flex items-center gap-1.5">
                       {triggerLabel}
                       {isModified && <div className="w-1.5 h-1.5 rounded-full bg-black" />}
                    </div>
                ) : (
                    (label ? label + ': ' : '') + getLabel(value) || placeholder
                )}
            </span>
        </div>

        <div className="flex items-center gap-1 shrink-0">
            {/* Only show Clear 'X' if NOT using triggerLabel (Pill mode handles clearing externally) */}
            {isModified && !triggerLabel && (
                <div 
                    role="button" 
                    onClick={clearSelection}
                    className="p-0.5 rounded-full hover:bg-gray-200 text-gray-400 hover:text-gray-600 transition-colors mr-1"
                >
                    <X size={12} />
                </div>
            )}
            <ChevronDown size={14} className={`text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
        </div>
      </div>

      {/* Dropdown Menu */}
      {isOpen && (
          usePortal ? (
            createPortal(
                <>
                    <div className="fixed inset-0 z-[9998] bg-transparent" onClick={() => setIsOpen(false)} onMouseDown={(e) => e.stopPropagation()} />
                    {menuContent}
                </>, 
                document.body
            )
          ) : (
             menuContent
          )
      )}
    </div>
  );
};

export default DropdownSelect;
