import React, { createContext, useContext } from 'react';
import { useNotifications } from '../hooks/useNotifications';
import { AppNotification } from '../types';

interface NotificationsContextType {
    notifications: AppNotification[];
    unreadCount: number;
    addNotification: (notification: Omit<AppNotification, 'id' | 'timestamp' | 'read'>) => void;
    markAsRead: (id: string) => void;
    markAllAsRead: () => void;
}

const NotificationsContext = createContext<NotificationsContextType | undefined>(undefined);

export const NotificationsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const notificationManager = useNotifications();

    return (
        <NotificationsContext.Provider value={notificationManager}>
            {children}
        </NotificationsContext.Provider>
    );
};

export const useNotificationsContext = () => {
    const context = useContext(NotificationsContext);
    if (context === undefined) {
        throw new Error('useNotificationsContext must be used within a NotificationsProvider');
    }
    return context;
};
