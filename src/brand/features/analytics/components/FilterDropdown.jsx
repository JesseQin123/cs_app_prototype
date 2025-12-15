import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const FilterDropdown = ({ label, value, options, onChange, icon: Icon }) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className="relative group z-20">
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className={`flex items-center gap-2 px-3 py-1.5 border rounded-lg text-sm font-medium transition whitespace-nowrap ${
                    isOpen ? 'bg-gray-100 border-gray-300 text-black' : 'bg-white border-gray-200 text-gray-700 hover:shadow-xs'
                }`}
            >
                {Icon && <Icon size={14} className="text-gray-400"/>} 
                {label ? `${label}: ${value}` : value} 
                <ChevronDown size={14} className={`text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}/>
            </button>
            {isOpen && (
                <>
                    <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)}></div>
                    <div className="absolute top-full left-0 mt-1 w-48 bg-white rounded-lg shadow-xl border border-gray-100 py-1 z-30 animate-in fade-in zoom-in-95">
                        {options.map(opt => (
                            <button
                                key={opt}
                                onClick={() => { onChange(opt); setIsOpen(false); }}
                                className={`w-full text-left px-4 py-2 hover:bg-gray-50 text-sm ${value === opt ? 'font-bold text-black bg-gray-50' : 'text-gray-600'}`}
                            >
                                {opt}
                            </button>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};

export default FilterDropdown;
