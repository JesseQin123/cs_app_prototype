import React, { createContext, useContext, useState, useMemo } from 'react';
import { getInitialNotifications } from '../data/mockStore/notificationStore';

const NotificationContext = createContext();

export const useNotifications = () => {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error('useNotifications must be used within a NotificationProvider');
    }
    return context;
};

export const NotificationProvider = ({ children, userRole = 'brand_admin' }) => {
    // Load initial data
    const [notifications, setNotifications] = useState(getInitialNotifications());
    const [isPanelOpen, setIsPanelOpen] = useState(false);

    // Filter notifications based on current user role
    // Role format expected: 'brand_admin', 'brand_member', 'retailer_admin', 'retailer_member'
    const filteredNotifications = useMemo(() => {
        return notifications
            .filter(n => n.targetRoles.includes(userRole))
            .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)); // Sort by date desc
    }, [notifications, userRole]);

    // Derived state
    const unreadCount = filteredNotifications.filter(n => !n.isRead).length;

    // Actions
    const markAsRead = (id) => {
        setNotifications(prev => prev.map(n => 
            n.id === id ? { ...n, isRead: true } : n
        ));
    };

    const markAllAsRead = () => {
        setNotifications(prev => prev.map(n => 
            n.targetRoles.includes(userRole) ? { ...n, isRead: true } : n
        ));
    };

    const clearAll = () => {
        // Only clear non-actionable or read notifications?
        // PRD: "Clear All - 仅清除 Non-Actionable 的普通通知，保留未处理的 Actionable"
        // For MVP, simply removing them from view (or soft delete)
        // We will filter out "P2/P3" types or read items.
        // Let's implement specific logic: Remove all READ notifications. Keep Unread P0/P1.
        
        setNotifications(prev => prev.filter(n => {
             // Keep it if it doesn't belong to current user (don't touch others' data)
             if (!n.targetRoles.includes(userRole)) return true;
             
             // If unread, keep it (Safety)
             if (!n.isRead) return true;

             // If it's P0/P1 (Actionable), keep it even if read? 
             // PRD says "Clear All - 仅清除 Non-Actionable... 保留未处理的 Actionable (如额度申请)".
             // "未处理" implies Unread or status logic. Since we only have isRead, we'll assume "Unread" = "Unprocessed".
             // So actually, "Clear All" usually clears READ notifications.
             return false; // Remove read notifications
        }));
    };

    const togglePanel = () => setIsPanelOpen(!isPanelOpen);
    const closePanel = () => setIsPanelOpen(false);
    const openPanel = () => setIsPanelOpen(true);

    const value = {
        notifications: filteredNotifications,
        unreadCount,
        isPanelOpen,
        togglePanel,
        closePanel,
        openPanel,
        markAsRead,
        markAllAsRead,
        clearAll
    };

    return (
        <NotificationContext.Provider value={value}>
            {children}
        </NotificationContext.Provider>
    );
};
