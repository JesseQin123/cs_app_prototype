import React from 'react';
import DropdownSelect from './DropdownSelect';
import { Calendar } from 'lucide-react';

const DateRangeFilter = ({ 
  value = '30d', 
  onChange, 
  options = [
    { label: 'Last 30 Days', value: '30d' },
    { label: 'This Month', value: 'this_month' },
    { label: 'Last Month', value: 'last_month' },
    { label: 'Last 90 Days', value: '90d' }
  ]
}) => {
  return (
    <div className="w-[180px]">
      <DropdownSelect
        icon={Calendar}
        value={value}
        onChange={onChange}
        options={options}
        placeholder="Select Date Range"
        className="w-full"
      />
    </div>
  );
};

export default DateRangeFilter;
