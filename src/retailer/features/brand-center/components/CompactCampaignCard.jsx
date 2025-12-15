import React from 'react';
import { Clock, AlertTriangle } from 'lucide-react';

const CompactCampaignCard = ({ campaign, brand }) => {
  // Calculate days remaining
  const end = new Date(campaign.endDate);
  const now = new Date('2025-11-26'); // Simulated Now
  const diffTime = end - now;
  const diffHours = Math.ceil(diffTime / (1000 * 60 * 60));
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  let timeLeftString = '';
  if (diffHours <= 48) {
      timeLeftString = `${diffHours}h left`;
  } else {
      timeLeftString = `${diffDays} days left`;
  }

  return (
    <div className="flex items-center gap-4 bg-white border border-red-100 rounded-lg p-3 shadow-xs hover:shadow-md transition-all cursor-pointer group min-w-[280px] h-24">
       {/* Cover Image */}
       <div className={`w-16 h-16 rounded-md ${campaign.cover} shrink-0 relative overflow-hidden`}>
          {/* Brand Logo Overlay */}
          <div className={`absolute bottom-0 right-0 w-6 h-6 rounded-tl-lg ${brand?.logo || 'bg-black'} flex items-center justify-center text-white text-[8px] font-bold`}>
             {brand?.name?.substring(0, 1)}
          </div>
       </div>

       {/* Info */}
       <div className="flex-1 min-w-0">
          <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-0.5 truncate">{brand?.name}</div>
          <h4 className="font-bold text-gray-900 text-sm leading-tight truncate mb-1 group-hover:text-red-600 transition-colors">{campaign.title}</h4>
          
          <div className="flex items-center gap-1.5 text-xs font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded-full inline-flex">
             <Clock size={10} />
             <span>Ends in {timeLeftString}</span>
          </div>
       </div>
    </div>
  );
};

export default CompactCampaignCard;
