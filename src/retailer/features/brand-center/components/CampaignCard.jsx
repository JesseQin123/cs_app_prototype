import React from 'react';
import { Clock, Pin, Instagram, Facebook, Mail, FileText, Download, Smartphone, Linkedin, Twitter, Globe, MessageSquare, Share2, Check, Flame, ArrowRight, Lock, Infinity as InfinityIcon } from 'lucide-react';
import Tooltip from '../../../../components/Tooltip';

const CampaignCard = ({ campaign, brand, templates = [], files = [], hideExpiringStatus = false }) => {
  // Calculate asset counts
  const linkedTemplates = templates.filter(t => campaign.templates?.includes(t.id));
  const linkedAssets = files.filter(f => campaign.assets?.includes(f.id));

  const socialTemplates = linkedTemplates.filter(t => t.type === 'social');
  const socialCount = socialTemplates.length;
  const emailCount = linkedTemplates.filter(t => t.type === 'email').length;
  const smsCount = linkedTemplates.filter(t => t.type === 'sms').length;
  const fileCount = linkedAssets.filter(f => f.type !== 'folder').length;

  // Extract unique platforms
  const platforms = [...new Set(socialTemplates.flatMap(t => t.platforms || []))];

  // Helper for status
  const getExpirationStatus = () => {
      // 1. Permanent
      if (campaign.endDate === 'Permanent') {
          return { 
              type: 'permanent', 
              label: 'No Expiration', 
              color: 'text-green-600', 
              icon: <InfinityIcon size={14} className="text-green-600" />,
              tooltip: 'Always available'
          };
      }

      // Override if status is explicitly Ended/Archived
      if (campaign.status === 'Ended' || campaign.status === 'Archived') {
          return { 
              type: 'expired', 
              label: 'Expired', 
              color: 'text-gray-900', 
              icon: <div className="w-1.5 h-1.5 rounded-full bg-black"></div>,
              tooltip: `Not available since ${campaign.endDate}`
          };
      }
      
      const end = new Date(campaign.endDate);
      const now = new Date('2025-11-26'); // Simulated Now
      const diffTime = end - now;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      // Date Formatter
      const formatDate = (date) => date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      const formatTime = (date) => date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });

      // 2. Expired
      if (diffDays <= 0) {
          return { 
              type: 'expired', 
              label: 'Expired', 
              color: 'text-gray-900', 
              icon: <div className="w-1.5 h-1.5 rounded-full bg-black"></div>,
              tooltip: `Not available since ${formatDate(end)}`
          };
      }

      // 3. Urgent (Ends Today)
      if (diffDays <= 1) {
          // Calculate hours if needed, but "Ends Today" is clean
          return { 
              type: 'urgent', 
              label: 'Ends Today', 
              color: 'text-red-600', 
              icon: <Flame size={12} className="fill-red-600 text-red-600"/>,
              tooltip: `Expires: Today, ${formatTime(end)}`
          };
      }

      // 4. Warning (< 7 Days)
      if (diffDays <= 7) {
          return { 
              type: 'warning', 
              label: `${diffDays} days left`, 
              color: 'text-amber-600',
              tooltip: `Expires: ${formatDate(end)}, ${formatTime(end)}`
          };
      }
      
      // 5. Regular
      return { 
          type: 'normal', 
          label: `Ends ${formatDate(end)}`, 
          color: 'text-gray-500',
          tooltip: `Expires: ${formatDate(end)}, ${formatTime(end)}`
      };
  };

  const expiration = getExpirationStatus();
  const isUsed = campaign.retailerUsage && Object.values(campaign.retailerUsage).some(v => v === true);
  
  // New & Blue Dot Logic
  const now = new Date('2025-11-26');
  const start = new Date(campaign.startDate);
  const lastUpdated = campaign.lastUpdated ? new Date(campaign.lastUpdated) : null;
  
  const isNew = (now - start) / (1000 * 60 * 60 * 24) <= 3;
  const isUpdated = !isNew && lastUpdated && (now - lastUpdated) / (1000 * 60 * 60) <= 48; 

  const getPlatformIcon = (p) => {
      switch(p) {
          case 'instagram': return <Instagram size={14} className="text-pink-600"/>;
          case 'facebook': return <div className="w-3.5 h-3.5 bg-blue-600 rounded-full flex items-center justify-center text-[9px] text-white font-bold">f</div>;
          case 'x': 
          case 'twitter': return <div className="w-3.5 h-3.5 bg-black rounded-xs flex items-center justify-center text-white font-black text-[10px]">𝕏</div>;
          case 'google': 
          case 'gmb': return <div className="w-3.5 h-3.5 rounded-xs flex items-center justify-center text-white font-bold text-[9px]" style={{backgroundColor: '#4285F4'}}>G</div>;
          default: return <Smartphone size={14} className="text-gray-400"/>;
      }
  };

  const isExpired = expiration.type === 'expired';

  return (
    <div className={`group relative bg-white rounded-xl shadow-xs transition-all duration-300 flex flex-col h-full border border-gray-100 ${isExpired ? 'cursor-default' : 'hover:shadow-xl hover:border-gray-200 cursor-pointer'}`}>
      {/* Visual Area (Fixed Aspect Ratio 16:9) */}
      <div className="relative aspect-video w-full overflow-hidden bg-gray-100 rounded-t-xl shrink-0">
        {/* Cover Image */}
        <div 
           className={`absolute inset-0 bg-cover bg-center transition-transform duration-700 ${!isExpired && 'group-hover:scale-105'} ${campaign.coverImage && typeof campaign.coverImage === 'string' && campaign.coverImage.startsWith('http') ? '' : campaign.cover}`}
           style={campaign.coverImage ? { backgroundImage: `url(${campaign.coverImage})` } : {}}
        ></div>
        
        {/* Expired Overlay */}
        {isExpired && <div className="absolute inset-0 bg-white/30 backdrop-grayscale"></div>}

        {/* Status Badge (Top Left) - Priority: New/Expiring/Expired */}
        <div className="absolute top-3 left-3 z-30 flex flex-col items-start gap-2">
           {isNew && expiration.type !== 'urgent' && !isExpired && (
              <div className="relative overflow-hidden bg-linear-to-r from-amber-200 to-yellow-400 text-yellow-900 text-[10px] font-bold px-2 py-1 rounded-sm shadow-xs uppercase tracking-wider border border-yellow-300">
                 <span className="relative z-10">New</span>
                 <div className="absolute inset-0 bg-white/40 skew-x-12 animate-[shimmer_2s_infinite] -translate-x-full"></div>
              </div>
           )}
            {isUpdated && expiration.type !== 'urgent' && !isExpired && (
               <div className="relative group/updated cursor-help">
                   <div className="relative overflow-hidden bg-linear-to-r from-blue-500 to-indigo-600 text-white text-[10px] font-bold px-2 py-1 rounded-sm shadow-xs uppercase tracking-wider border border-blue-400">
                      <span className="relative z-10">Updated</span>
                      <div className="absolute inset-0 bg-white/20 skew-x-12 animate-[shimmer_2s_infinite] -translate-x-full"></div>
                   </div>
                   {/* Tooltip */}
                   <div className="absolute top-full left-0 mt-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-sm opacity-0 group-hover/updated:opacity-100 transition pointer-events-none whitespace-nowrap z-50 shadow-lg font-sans font-normal min-w-[200px]">
                       <div className="font-bold mb-0.5">Updated</div>
                       <div className="text-gray-300 text-[10px] whitespace-normal leading-tight">This campaign has been updated within the last 48 hours.</div>
                   </div>
               </div>
            )}
           {expiration.type === 'urgent' && !hideExpiringStatus && (
              <div className="bg-red-600 text-white text-[10px] font-bold px-2 py-1 rounded-sm shadow-xs uppercase tracking-wider flex items-center gap-1 animate-pulse border border-red-700">
                 <Flame size={10} className="fill-white"/> Ends Today
              </div>
           )}
           {isExpired && !hideExpiringStatus && (
              <div className="bg-gray-900 text-white text-[10px] font-bold px-2 py-1 rounded-sm shadow-xs uppercase tracking-wider border border-black flex items-center gap-1">
                 <Lock size={10} /> EXPIRED
              </div>
           )}
        </div>

        {/* Right Side Badges (Used) */}
        {isUsed && (
            <div className="absolute top-3 right-3 z-30">
               <div className="bg-green-100 text-green-700 text-[10px] font-bold px-2 py-1 rounded-md shadow-xs uppercase tracking-wider flex items-center gap-1 border border-green-200">
                  <Check size={10} strokeWidth={3} /> Used
               </div>
            </div>
        )}
      </div>

      {/* Info Area */}
      <div className="flex-1 p-4 flex flex-col bg-white relative z-20 rounded-b-xl">
         {/* Row 1: Brand Logo + Name */}
         <div className="flex items-center gap-2 mb-2">
            <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[8px] font-bold overflow-hidden ${brand?.logo?.startsWith('bg-') ? `${brand.logo} text-white` : 'bg-white'}`}>
               {brand?.logo?.startsWith('bg-') ? (
                  brand?.name?.substring(0, 1)
               ) : (
                  <img src={brand?.logo} alt={brand?.name} className="w-full h-full object-cover" />
               )}
            </div>
            <span className="text-xs font-medium text-gray-500">{brand?.name}</span>
         </div>
         
         {/* Row 2: Title + Pin */}
         <div className="flex items-start justify-between gap-2 mb-1">
            <div className="mb-3 min-h-[40px] flex-1">
              <Tooltip content={campaign.title}>
                 <h3 className={`font-bold text-lg leading-tight mb-1 line-clamp-2 ${isExpired ? 'text-gray-400' : 'text-gray-900 group-hover:text-[#C5A065] transition-colors'}`}>
                    {campaign.title}
                 </h3>
              </Tooltip>
            </div>
            {campaign.isPinned && (
               <Pin size={14} className="fill-black shrink-0 mt-1.5"/>
            )}
         </div>

         {/* Row 3: Expiration Date */}
          <div className="flex items-center justify-between mb-4">
             <div className={`text-xs font-medium flex items-center gap-1 ${expiration.color}`}>
                 {expiration.icon}
                 <Tooltip content={expiration.tooltip}>
                    <span>{expiration.label}</span>
                 </Tooltip>
             </div>
          </div>

         {/* Row 4: Asset Icons (Platform logos, Envelope, Bubble, Download) */}
         <div className="mt-auto pt-3 border-t border-gray-50 flex items-center gap-1.5">
             {/* Social Platforms */}
             {platforms.length > 0 && (
                <div className="flex items-center -space-x-1.5 group/social relative cursor-help">
                   {platforms.map(p => (
                      <div key={p} className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center shadow-xs z-10 relative border border-white">
                         {getPlatformIcon(p)}
                      </div>
                   ))}
                   {/* Tooltip */}
                   <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-[10px] rounded-sm opacity-0 group-hover/social:opacity-100 transition pointer-events-none whitespace-nowrap z-30">
                      {socialCount} Posts
                   </div>
                </div>
             )}

             {/* Email */}
             {emailCount > 0 && (
                <div className="group/email relative cursor-help">
                   <div className="w-6 h-6 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                      <Mail size={12}/>
                   </div>
                   <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-[10px] rounded-sm opacity-0 group-hover/email:opacity-100 transition pointer-events-none whitespace-nowrap z-30">
                      {emailCount} Emails
                   </div>
                </div>
             )}

             {/* SMS */}
             {smsCount > 0 && (
                <div className="group/sms relative cursor-help">
                   <div className="w-6 h-6 rounded-full bg-purple-50 flex items-center justify-center text-purple-600">
                      <MessageSquare size={12}/>
                   </div>
                   <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-[10px] rounded-sm opacity-0 group-hover/sms:opacity-100 transition pointer-events-none whitespace-nowrap z-30">
                      {smsCount} SMS
                   </div>
                </div>
             )}

             {/* Downloads */}
             {fileCount > 0 && (
                <div className="group/files relative cursor-help">
                   <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-gray-600">
                      <Download size={12}/>
                   </div>
                   <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-[10px] rounded-sm opacity-0 group-hover/files:opacity-100 transition pointer-events-none whitespace-nowrap z-30">
                      {fileCount} Files
                   </div>
                </div>
             )}

             {/* Arrow Icon (Bottom Right) */}
             <div className="ml-auto text-gray-300 group-hover:text-[#C5A065] transition">
                <ArrowRight size={16} />
             </div>
         </div>
      </div>
    </div>
  );
};

export default CampaignCard;
