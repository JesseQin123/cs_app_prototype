import React, { useMemo } from 'react';
import { Bell } from 'lucide-react';
import { useNotifications } from '../../context/NotificationContext';

const NotificationTrigger = () => {
    const { togglePanel, unreadCount, notifications } = useNotifications();

    // Check for Critical (P0) alerts among unread items
    const hasCritical = useMemo(() => {
        return notifications.some(n => !n.isRead && n.priority === 'P0');
    }, [notifications]);

    return (
        <button 
            onClick={togglePanel}
            className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all duration-300 group text-gray-500 hover:bg-gray-50 hover:text-gray-900"
        >
            <div className="flex items-center gap-3.5">
                <div className="relative">
                    <Bell size={18} className={`${hasCritical ? 'animate-pulse text-red-600' : 'text-gray-400 group-hover:text-gray-600'} transition-colors duration-300`} />
                    
                    {/* Unread Dot */}
                    {unreadCount > 0 && (
                        <span className="absolute -top-1 -right-0.5 w-2.5 h-2.5 bg-[#D32F2F] rounded-full border-2 border-white"></span>
                    )}
                </div>
                <span className="text-sm font-medium tracking-wide text-gray-500 group-hover:text-gray-900">
                    Notifications
                </span>
            </div>
            
            {/* Count Badge */}
            {unreadCount > 0 && (
                <span className="bg-[#D32F2F] text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm min-w-[20px] text-center flex items-center justify-center">
                    {unreadCount > 99 ? '99+' : unreadCount}
                </span>
            )}
        </button>
    );
};

export default NotificationTrigger;
