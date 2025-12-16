import React, { useState, useRef, useEffect } from 'react';
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
  triggerLabel = null // Optional override for trigger text (e.g. for "Add Filter" style)
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

  return (
    <div className={`relative min-w-[120px] ${className}`} ref={dropdownRef}>
      {/* Trigger Button */}
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className={`
            w-full flex items-center justify-between px-3 py-2 
            bg-white border rounded-lg cursor-pointer transition-all duration-200
            ${isOpen ? 'border-[#C5A065] ring-2 ring-[#C5A065]/10 shadow-xs' : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'}
        `}
      >
        <div className="flex items-center gap-2 truncate pr-2">
            {Icon && <Icon size={14} className="text-gray-400 shrink-0" />}
            <span className={`text-sm font-medium truncate ${isModified ? 'text-gray-900' : 'text-gray-600'}`}>
                {/* Support generic label mode for "Pill" UX */}
                {triggerLabel ? (
                    <div className="flex items-center gap-1.5">
                       {triggerLabel}
                       {isModified && <div className="w-1.5 h-1.5 rounded-full bg-[#C5A065]" />}
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
        <div className="absolute z-50 w-full min-w-[200px] mt-1 bg-white border border-gray-100 rounded-lg shadow-xl animate-in fade-in slide-in-from-top-1 duration-100 max-h-60 overflow-hidden flex flex-col">
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
                                onClick={() => handleSelect(optValue)}
                                className={`
                                    px-3 py-2 text-sm cursor-pointer flex items-center justify-between
                                    transition-colors duration-150
                                    ${active ? 'bg-[#C5A065]/5 text-[#C5A065] font-medium' : 'text-gray-700 hover:bg-gray-50'}
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
      )}
    </div>
  );
};

export default DropdownSelect;
