import React, { useEffect, useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import NotificationItem from './NotificationItem';
import { useNotifications } from '../../context/NotificationContext';
import { Bell, Check, Eraser, X, CheckCheck } from 'lucide-react';

const NotificationPanel = ({ onNavigate, currentView }) => {
  const { 
    isPanelOpen, 
    closePanel, 
    notifications, 
    markAsRead, 
    markAllAsRead, 
    clearAll 
  } = useNotifications();

  const [isMounted, setIsMounted] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  
  // Track previous view to prevent unintended closing on re-renders
  const prevViewRef = useRef(currentView);

  // Auto-close when route/view changes
  useEffect(() => {
      if (prevViewRef.current !== currentView) {
          if (isPanelOpen) closePanel();
          prevViewRef.current = currentView;
      }
  }, [currentView, isPanelOpen, closePanel]);

  useEffect(() => {
    if (isPanelOpen) {
      setIsMounted(true);
      requestAnimationFrame(() => {
          requestAnimationFrame(() => setIsAnimating(true));
      });
    } else {
      setIsAnimating(false);
      const timer = setTimeout(() => setIsMounted(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isPanelOpen]);

  const handleItemClick = (notification) => {
    if (!notification.isRead) {
      markAsRead(notification.id);
    }
    
    if (onNavigate && notification.actionLink) {
       const target = notification.actionLink.split('-')[0];
       if (notification.actionLink === 'settings-integrations') onNavigate('settings');
       else if (notification.actionLink === 'retailer-detail') onNavigate('partner-retailers');
       else if (notification.actionLink === 'retailer-profile') onNavigate('partner-retailers');
       else if (notification.actionLink === 'brand-campaign-detail') onNavigate('brand-center-campaigns');
       else if (notification.actionLink === 'campaign-analytics') onNavigate('partner-campaigns');
       else if (notification.actionLink === 'credit-wallet') onNavigate('my-marketing');
       else onNavigate(target);
       closePanel();
    }
  };

  if (!isMounted) return null;

  return createPortal(
    <div className="fixed inset-0 z-[60] flex overflow-hidden pointer-events-none"> 
      {/* 
         Pointer events set to none on container to let clicks pass through to Sidebar (if visible)
         The visible parts (backdrop, panel) will restore pointer-events-auto
      */}

      {/* Backdrop (Clicking closes) */}
      <div 
        className={`fixed inset-0 bg-black/10 backdrop-blur-[1px] transition-opacity duration-300 pointer-events-auto ${isAnimating ? 'opacity-100' : 'opacity-0'}`}
        onClick={closePanel}
      />

      {/* 
         Drawer Container
         Positioned at left-0.
         Contains a spacer (= Sidebar width) + Panel.
         Animation translates the entire container from -100% to 0%.
         Because Sidebar is z-50 and this is z-40, the spacer part is hidden *under* the sidebar.
      */}
      <div 
         className={`
            absolute top-0 bottom-0 left-0
            flex h-full
            transform transition-transform duration-300 ease-out
            ${isAnimating ? 'translate-x-0' : '-translate-x-full'}
         `}
      >
          {/* Spacer - Matches Sidebar Width exact logic */}
          <div className="shrink-0 w-20 md:w-60 h-full"></div>

          {/* Actual Panel Content */}
          <div className="w-[420px] h-full bg-white/95 backdrop-blur-xl shadow-2xl border-r border-gray-100 flex flex-col pointer-events-auto">
                
                {/* Header */}
                <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between shrink-0 bg-white/90 backdrop-blur-md z-10">
                    <div className="flex items-center gap-3">
                        <h3 className="text-xl font-bold font-display text-gray-900 tracking-tight">Notifications</h3>
                        {notifications.some(n => !n.isRead) && (
                            <span className="bg-[#D32F2F] text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">
                                {notifications.filter(n => !n.isRead).length}
                            </span>
                        )}
                    </div>
                    
                    {/* Mark All Read (Top Right) - Luxury Minimalist */}
                    {notifications.some(n => !n.isRead) && (
                         <button 
                            onClick={markAllAsRead}
                            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white text-xs cursor-pointer font-bold text-gray-500 hover:text-gray-900 hover:border-gray-300 transition-all group active:scale-95"
                            title="Mark all as read"
                        >
                            <Check size={14} className="text-gray-400 group-hover:text-gray-900 transition-colors" />
                            <span>Mark all as read</span>
                        </button>
                    )}
                </div>

                {/* Content List */}
                <div className="flex-1 overflow-y-auto p-0 bg-white [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-transparent hover:[&::-webkit-scrollbar-thumb]:bg-gray-200">
                    {notifications.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center p-8 text-center text-gray-400">
                            <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mb-4">
                                <Bell size={24} className="text-gray-300" />
                            </div>
                            <p className="text-sm font-medium text-gray-500">No new notifications</p>
                            <p className="text-xs text-gray-400 mt-1">We'll notify you when something important happens.</p>
                        </div>
                    ) : (
                        <div className="pb-4">
                            {(() => {
                                const todayDate = new Date();
                                todayDate.setHours(0,0,0,0);
                                const groups = { today: [], earlier: [] };
                                notifications.forEach(n => {
                                    const d = new Date(n.timestamp);
                                    if (d >= todayDate) groups.today.push(n);
                                    else groups.earlier.push(n);
                                });
                                
                                return (
                                    <>
                                        {groups.today.length > 0 && (
                                            <div>
                                                <div className="px-6 mt-4 mb-2 text-[10px] font-bold uppercase tracking-widest text-gray-400">Today</div>
                                                <div>
                                                    {groups.today.map(item => (
                                                        <NotificationItem 
                                                            key={item.id} 
                                                            notification={item} 
                                                            onClick={() => handleItemClick(item)} 
                                                        />
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                        
                                        {groups.earlier.length > 0 && (
                                            <div>
                                                <div className="px-6 mt-6 mb-2 text-[10px] font-bold uppercase tracking-widest text-gray-400">Earlier</div>
                                                <div>
                                                    {groups.earlier.map(item => (
                                                        <NotificationItem 
                                                            key={item.id} 
                                                            notification={item} 
                                                            onClick={() => handleItemClick(item)} 
                                                        />
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </>
                                );
                            })()}
                        </div>
                    )}
                </div>

                {/* Footer Actions - Sticky Bottom */}
                {(notifications.length > 0) && (
                    <div className="p-2 border-t border-gray-100 bg-white/95 backdrop-blur-sm flex items-center justify-center shrink-0">
                        <button 
                            onClick={clearAll}
                            className="w-full flex items-center justify-center cursor-pointer gap-2 py-2.5 rounded-lg text-xs font-bold text-gray-400 hover:bg-gray-50 hover:text-red-600 transition-all group"
                            title="Clear all notifications"
                        >
                            <Eraser size={14} className="transition-transform group-hover:-rotate-12" />
                            <span>Clear All</span>
                        </button>
                    </div>
                )}
          </div>
      </div>
    </div>,
    document.body
  );
};

export default NotificationPanel;
