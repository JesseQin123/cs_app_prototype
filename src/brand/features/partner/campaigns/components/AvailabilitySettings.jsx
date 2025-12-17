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
    <div className="flex flex-col gap-3">
        
        {/* Option 1: Set Expiration Date */}
        <div 
            onClick={() => handleTypeChange('expiration')}
            className={`p-5 rounded-xl border transition-all cursor-pointer ${availabilityType === 'expiration' ? 'bg-gray-50 border-black ring-1 ring-black' : 'bg-white border-gray-200 hover:border-gray-300 hover:bg-gray-50'} group`}
        >
            <div className="flex items-start gap-4">
                 <div className={`mt-0.5 w-4 h-4 rounded-full border flex items-center justify-center shrink-0 transition-colors ${availabilityType === 'expiration' ? 'border-black' : 'border-gray-300 group-hover:border-gray-400'}`}>
                     {availabilityType === 'expiration' && <div className="w-2 h-2 bg-black rounded-full"></div>}
                </div>
                <div className="flex-1">
                    <div className="flex flex-col">
                        <span className={`font-medium text-sm text-gray-900`}>Set Expiration</span>
                        <span className="text-xs text-gray-500 mt-1">Campaign automatically ends on the selected date.</span>
                    </div>

                    {/* Embedded Date Picker */}
                    {availabilityType === 'expiration' && (
                        <div className="mt-4 animate-in fade-in slide-in-from-top-1 duration-200" onClick={(e) => e.stopPropagation()}>
                            <div className="max-w-xs relative bg-white rounded-lg">
                                <CustomDatePicker 
                                    value={endDate === 'Permanent' ? '' : endDate}
                                    onChange={(date) => onUpdate('endDate', date)}
                                    minDate={new Date().toISOString()} 
                                    placeholder="Select expiration date"
                                />
                            </div>
                            <div className="flex gap-2 items-start text-gray-500 mt-2.5">
                                <Clock size={13} className="mt-0.5 shrink-0" />
                                <p className="text-[11px] leading-relaxed">
                                    Ends strictly at <strong className="text-gray-900">11:59 PM (EST)</strong>. Retailer access will cease immediately.
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>

        {/* Option 2: Always Available */}
        <div 
            onClick={() => handleTypeChange('permanent')}
            className={`p-5 rounded-xl border transition-all cursor-pointer ${availabilityType === 'permanent' ? 'bg-gray-50 border-black ring-1 ring-black' : 'bg-white border-gray-200 hover:border-gray-300 hover:bg-gray-50'} group`}
        >
            <div className="flex items-start gap-4">
                <div className={`mt-0.5 w-4 h-4 rounded-full border flex items-center justify-center shrink-0 transition-colors ${availabilityType === 'permanent' ? 'border-black' : 'border-gray-300 group-hover:border-gray-400'}`}>
                     {availabilityType === 'permanent' && <div className="w-2 h-2 bg-black rounded-full"></div>}
                </div>
                <div className="flex flex-col">
                    <span className={`font-medium text-sm text-gray-900`}>Always Available</span>
                    <span className="text-xs text-gray-500 mt-1">Campaign content remains accessible indefinitely until you manually end this campaign.</span>
                </div>
            </div>
        </div>
    </div>
  );
};

export default AvailabilitySettings;
