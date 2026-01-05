import { AlertCircle, CheckCircle, Info, Zap, Calendar, TrendingUp, AlertTriangle, Users, Download, Wallet, Megaphone, Server, Settings } from 'lucide-react';

const NotificationItem = ({ notification, onClick }) => {
  const { isRead, priority, type, title, message, timestamp } = notification;

  // Visual Config based on Type/Priority
  const getConfig = () => {
    // P0: System Alert (Critical)
    if (priority === 'P0' || type === 'SYSTEM_ALERT') {
      return {
        icon: AlertCircle,
        iconColor: 'text-red-600',
        bgColor: 'bg-red-50',
        borderColor: 'border-red-100',
        textColor: 'text-gray-900'
      };
    }
    
    // Unified Configuration for ALL other types (Clean/Monochrome)
    const baseConfig = {
        iconColor: 'text-gray-900',
        bgColor: 'bg-gray-50',
        borderColor: 'border-gray-100'
    };

    switch (type) {
      case 'QUOTA_REQUEST': return { icon: Wallet, ...baseConfig };
      case 'NETWORK_GROWTH': return { icon: Users, ...baseConfig };
      case 'PERFORMANCE': return { icon: TrendingUp, ...baseConfig }; 
      case 'ANNOUNCEMENT': return { icon: Server, ...baseConfig };
      case 'CAMPAIGN_STATUS': return { icon: Calendar, ...baseConfig };
      case 'NEW_OPPORTUNITY': return { icon: Megaphone, ...baseConfig };
      case 'EXPIRATION': return { icon: AlertTriangle, ...baseConfig };
      case 'SYSTEM_INFO': 
        if (title && title.includes('Export')) {
             return { icon: Download, ...baseConfig };
        }
        return { icon: Settings, ...baseConfig }; 

      default:
        return { icon: Info, ...baseConfig };
    }
  };

  const config = getConfig();
  const Icon = config.icon;

  // Time formatter (Relative)
  const formatTime = (isoString) => {
    const date = new Date(isoString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    
    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };



  // Row Background Logic
  // Read -> Grayish (History).
  // Unread -> White (Fresh).
  const rowBgClass = isRead 
      ? 'bg-[#FAFAFA] hover:bg-gray-50' 
      : 'bg-white hover:bg-gray-50';

  return (
    <div 
      onClick={onClick}
      className={`
        group relative px-6 py-5 border-b border-dashed border-gray-100 last:border-0 cursor-pointer transition-all duration-300
        ${rowBgClass}
      `}
    >
      <div className={`flex gap-4 items-start ${isRead ? 'opacity-60 group-hover:opacity-100 transition-opacity' : ''}`}>
        {/* Icon Container - Luxurious Minimal (No solid circle, just tint or pure icon) */}
        {/* User asked to "Remove large colored background circles... use specific color OR very subtle". */}
        {/* I'll use a very subtle rounded square (p-2) with minimal opacity */}
        <div className={`mt-0.5 p-2 rounded-lg shrink-0 ${isRead ? 'bg-gray-100 text-gray-400' : `${config.bgColor}/10 ${config.iconColor} ring-1 ring-inset ring-black/5`}`}>
            <Icon size={18} strokeWidth={2} />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0 pt-0.5">
          <div className="flex justify-between items-start mb-1">
             <div className="flex items-center gap-2">
                 <h4 className={`text-sm leading-snug ${isRead ? 'font-medium text-gray-600' : 'font-medium text-gray-900'} tracking-tight`}>
                   {title}
                 </h4>
                 {!isRead && (
                    <span className="w-1.5 h-1.5 rounded-full bg-[#D32F2F] shrink-0"></span>
                 )}
             </div>
             {/* Time as meta */}
             <span className="text-[10px] text-gray-400 font-medium whitespace-nowrap ml-2 shrink-0">
               {formatTime(timestamp)}
             </span>
          </div>
          
          <p className={`text-xs leading-relaxed line-clamp-2 ${isRead ? 'text-gray-400' : 'text-gray-500 font-normal'}`}>
            {message}
          </p>
          
          {/* Optional Action Text Indicator - "Micro-interaction" */}
          {!isRead && (priority === 'P0' || priority === 'P1') && (
              <div className="mt-3 flex">
                 <div className="px-0 py-1 text-[10px] font-bold uppercase tracking-widest text-gray-400 flex items-center gap-1 transition-all duration-300 group-hover:text-gray-900 group-hover:translate-x-1">
                     {type === 'NEW_OPPORTUNITY' || type === 'EXPIRATION' ? 'View Campaign' : 
                      type === 'QUOTA_REQUEST' ? 'Review Request' : 
                      'Resolve Issue'}
                     <span>→</span>
                 </div>
              </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationItem;
