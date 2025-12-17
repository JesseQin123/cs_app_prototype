import React, { useState } from 'react';
import { Clock } from 'lucide-react';
import CustomDatePicker from '@/components/common/CustomDatePicker';

const AvailabilitySettings = ({ endDate, onUpdate }) => {
  // Determine initial type based on `endDate`
  // If endDate is 'Permanent', we are in 'permanent' mode.
  // Otherwise (including null/empty for new campaigns), we are in 'expiration' mode.
  const getInitialType = () => {
    if (endDate === 'Permanent') return 'permanent';
    return 'expiration';
  };

  const [availabilityType, setAvailabilityType] = useState(getInitialType());

  // Handle Type Switching
  const handleTypeChange = (newType) => {
    setAvailabilityType(newType);
    if (newType === 'permanent') {
      onUpdate('endDate', 'Permanent');
    } else {
      // Set default expiration to 1 month from today if moving to expiration
      // If there was already a date, keep it (unless it was 'Permanent' which is cleared)
      if (endDate !== 'Permanent' && endDate) {
         // keep existing
      } else {
          const nextMonth = new Date();
          nextMonth.setMonth(nextMonth.getMonth() + 1);
          const defaultDate = nextMonth.toISOString().split('T')[0];
          onUpdate('endDate', defaultDate);
      }
    }
  };

  return (
    <div className="space-y-4">
        
        {/* Availability Type Selector */}
        <div className="grid grid-cols-2 gap-4">
            <div 
                onClick={() => handleTypeChange('expiration')}
                className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all ${availabilityType === 'expiration' ? 'bg-gray-50 border-black ring-1 ring-black' : 'bg-white border-gray-200 hover:bg-gray-50 hover:border-gray-300'} group`}
            >
                 <div className={`w-4 h-4 rounded-full border flex items-center justify-center transition-colors ${availabilityType === 'expiration' ? 'border-black' : 'border-gray-300 group-hover:border-gray-400'}`}>
                     {availabilityType === 'expiration' && <div className="w-2 h-2 bg-black rounded-full"></div>}
                </div>
                <span className={`font-medium text-sm ${availabilityType === 'expiration' ? 'text-gray-900' : 'text-gray-900'}`}>Set expiration date</span>
            </div>

            <div 
                onClick={() => handleTypeChange('permanent')}
                className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all ${availabilityType === 'permanent' ? 'bg-gray-50 border-black ring-1 ring-black' : 'bg-white border-gray-200 hover:bg-gray-50 hover:border-gray-300'} group`}
            >
                <div className={`w-4 h-4 rounded-full border flex items-center justify-center transition-colors ${availabilityType === 'permanent' ? 'border-black' : 'border-gray-300 group-hover:border-gray-400'}`}>
                     {availabilityType === 'permanent' && <div className="w-2 h-2 bg-black rounded-full"></div>}
                </div>
                <span className={`font-medium text-sm ${availabilityType === 'permanent' ? 'text-gray-900' : 'text-gray-900'}`}>Always available</span>
            </div>
        </div>

        {/* Date Picker (Conditional) */}
        {availabilityType === 'expiration' && (
            <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                <div className="w-full mb-2">
                     <CustomDatePicker 
                        value={endDate === 'Permanent' ? '' : endDate}
                        onChange={(date) => onUpdate('endDate', date)}
                        minDate={new Date().toISOString()} 
                        placeholder="Select expiration date"
                     />
                </div>
                
                {/* Helper Text */}
                <div className="flex gap-2.5 items-start text-gray-500 mt-2">
                    <Clock size={14} className="mt-0.5 shrink-0" />
                    <p className="text-xs leading-relaxed">
                        Ends at <strong className="text-gray-900">11:59 PM</strong> based on your timezone settings (EST). Retailers in other regions will lose access at this exact moment.
                    </p>
                </div>
            </div>
        )}
    </div>
  );
};

export default AvailabilitySettings;
