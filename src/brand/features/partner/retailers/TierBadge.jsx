import React from 'react';

const TierBadge = ({ tier, size = 'sm' }) => {
  // Mock Tier Data Mapping (should ideally come from a context or prop)
  const tierColors = {
    'Platinum': 'bg-purple-500',
    'Gold': 'bg-amber-500',
    'Silver': 'bg-gray-400',
    'Default Tier': 'bg-slate-200'
  };

  const colorClass = tierColors[tier] || 'bg-gray-200';
  
  const sizeClasses = {
    xs: 'text-[10px] px-1.5 py-0.5',
    sm: 'text-xs px-2 py-0.5',
    md: 'text-xs px-2.5 py-1' // Changed to text-xs as requested
  };

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full font-medium border border-gray-100 bg-white text-gray-700 shadow-xs whitespace-nowrap ${sizeClasses[size]}`}>
      <span className={`w-2 h-2 rounded-full ${colorClass}`}></span>
      {tier}
    </span>
  );
};

export default TierBadge;
