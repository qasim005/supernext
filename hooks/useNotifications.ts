import { useState, useCallback, useMemo } from 'react';
import { AppNotification, NotificationType } from '../types';

const createInitialNotifications = (): AppNotification[] => {
    return [
        {
            id: `notif_${Date.now()}`,
            type: NotificationType.Welcome,
            title: 'Welcome to SuperLink!',
            message: 'Your dashboard is ready. Explore the features to get started.',
            timestamp: new Date(),
            read: false,
        }
    ];
};


export const useNotifications = () => {
    const [notifications, setNotifications] = useState<AppNotification[]>(createInitialNotifications);

    const addNotification = useCallback((notification: Omit<AppNotification, 'id' | 'timestamp' | 'read'>) => {
        const newNotification: AppNotification = {
            ...notification,
            id: `notif_${Date.now()}_${Math.random()}`,
            timestamp: new Date(),
            read: false,
        };
        setNotifications(prev => [newNotification, ...prev]);
    }, []);

    const markAsRead = useCallback((id: string) => {
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    }, []);

    const markAllAsRead = useCallback(() => {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    }, []);

    const unreadCount = useMemo(() => {
        return notifications.filter(n => !n.read).length;
    }, [notifications]);

    return { notifications, unreadCount, addNotification, markAsRead, markAllAsRead };
};
