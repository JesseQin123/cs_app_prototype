import React, { useState, useRef, useEffect } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';

const DAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const CustomDatePicker = ({ value, onChange, placeholder = "Select date", minDate }) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);
  
  // Parse initial date or default to today for view
  const initialDate = value ? new Date(value) : new Date();
  
  // View State (Month/Year currently being viewed)
  const [viewDate, setViewDate] = useState(initialDate); // Tracks the month visible in calendar
  
  // Selected State
  const selectedDate = value ? new Date(value) : null;

  // Handle click outside to close
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Calendar Logic
  const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

  const handlePrevMonth = () => {
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1));
  };

  const handleDateClick = (day) => {
    // Construct new date in local time to avoid timezone shifts
    // Format: YYYY-MM-DD string
    const month = (viewDate.getMonth() + 1).toString().padStart(2, '0');
    const d = day.toString().padStart(2, '0');
    const dateStr = `${viewDate.getFullYear()}-${month}-${d}`;
    
    onChange(dateStr);
    setIsOpen(false);
  };

  const renderCalendarDays = () => {
    const daysInMonth = getDaysInMonth(viewDate.getFullYear(), viewDate.getMonth());
    const firstDay = getFirstDayOfMonth(viewDate.getFullYear(), viewDate.getMonth());
    const days = [];

    // Empty slots for previous month
    for (let i = 0; i < firstDay; i++) {
        days.push(<div key={`empty-${i}`} className="h-9 w-9" />);
    }

    // Days
    for (let day = 1; day <= daysInMonth; day++) {
        const dateToCheck = new Date(viewDate.getFullYear(), viewDate.getMonth(), day);
        // const dateStr = dateToCheck.toISOString().split('T')[0]; // Removed unused variable
        
        // Check if selected
        const isSelected = selectedDate && 
            dateToCheck.getDate() === selectedDate.getDate() && 
            dateToCheck.getMonth() === selectedDate.getMonth() && 
            dateToCheck.getFullYear() === selectedDate.getFullYear();
        
        // Check if today
        const isToday = new Date().toDateString() === dateToCheck.toDateString();

        // Check minDate
        let isDisabled = false;
        if (minDate) {
            const min = new Date(minDate);
            // Reset times for accurate comparison
            min.setHours(0,0,0,0);
            dateToCheck.setHours(0,0,0,0);
            if (dateToCheck < min) isDisabled = true;
        }

        days.push(
            <button
                key={day}
                onClick={() => !isDisabled && handleDateClick(day)}
                disabled={isDisabled}
                className={`
                    h-9 w-9 rounded-full flex items-center justify-center text-sm font-medium transition-all
                    ${isSelected ? 'bg-black text-white shadow-md scale-105' : 'hover:bg-gray-100 text-gray-700'}
                    ${isToday && !isSelected ? 'text-black font-bold ring-1 ring-gray-200 bg-gray-50' : ''}
                    ${isDisabled ? 'opacity-30 cursor-not-allowed hover:bg-transparent' : ''}
                `}
            >
                {day}
            </button>
        );
    }
    return days;
  };

  // Format display value: MM/DD/YYYY
  const displayValue = value ? new Date(value).toLocaleDateString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
  }) : '';

  return (
    <div className="relative w-full" ref={containerRef}>
        {/* Trigger Input */}
        <div 
            onClick={() => setIsOpen(!isOpen)}
            className={`
                flex items-center gap-3 px-4 py-3 bg-white border rounded-xl cursor-pointer transition-all select-none
                ${isOpen ? 'border-black ring-1 ring-black shadow-sm' : 'border-gray-200 hover:border-gray-300'}
            `}
        >
            <CalendarIcon size={18} className="text-gray-500" />
            <span className={`block flex-1 ${!value ? 'text-gray-400' : 'text-gray-900 font-medium'}`}>
                {displayValue || placeholder}
            </span>
        </div>

        {/* Calendar Popover */}
        {isOpen && (
            <div className="absolute top-full left-0 mt-2 z-50 p-4 bg-white rounded-xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.15)] border border-gray-100 w-[320px] animate-in fade-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="flex items-center justify-between mb-4 px-1">
                    <button onClick={handlePrevMonth} className="p-1 hover:bg-gray-100 rounded-full transition text-gray-500"><ChevronLeft size={20}/></button>
                    <span className="text-sm font-bold text-gray-900">
                        {MONTHS[viewDate.getMonth()]} {viewDate.getFullYear()}
                    </span>
                    <button onClick={handleNextMonth} className="p-1 hover:bg-gray-100 rounded-full transition text-gray-500"><ChevronRight size={20}/></button>
                </div>

                {/* Days Header */}
                <div className="grid grid-cols-7 mb-2">
                    {DAYS.map(day => (
                        <div key={day} className="text-center text-xs font-medium text-gray-400 py-1">
                            {day}
                        </div>
                    ))}
                </div>

                {/* Calendar Grid */}
                <div className="grid grid-cols-7 gap-y-1">
                    {renderCalendarDays()}
                </div>
            </div>
        )}
    </div>
  );
};

export default CustomDatePicker;
