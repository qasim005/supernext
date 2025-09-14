import React from 'react';
import { useNotificationsContext } from '../../context/NotificationsContext';
import { AppNotification, NotificationType } from '../../types';
import { TicketIcon, CreditCardIcon, ShieldIcon, HomeIcon, LifeBuoyIcon } from '../icons/IconComponents';

const NotificationIcon: React.FC<{type: NotificationType}> = ({ type }) => {
    const iconMap: Record<NotificationType, React.ReactNode> = {
        [NotificationType.Voucher]: <TicketIcon className="w-5 h-5" />,
        [NotificationType.Billing]: <CreditCardIcon className="w-5 h-5" />,
        [NotificationType.Security]: <ShieldIcon className="w-5 h-5" />,
        [NotificationType.Welcome]: <HomeIcon className="w-5 h-5" />,
        [NotificationType.Support]: <LifeBuoyIcon className="w-5 h-5" />,
    };
    const colorMap: Record<NotificationType, string> = {
        [NotificationType.Voucher]: 'bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400',
        [NotificationType.Billing]: 'bg-green-100 text-green-600 dark:bg-green-900/50 dark:text-green-400',
        [NotificationType.Security]: 'bg-red-100 text-red-600 dark:bg-red-900/50 dark:text-red-400',
        [NotificationType.Welcome]: 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/50 dark:text-indigo-400',
        [NotificationType.Support]: 'bg-orange-100 text-orange-600 dark:bg-orange-900/50 dark:text-orange-400',
    };
    return <div className={`flex-shrink-0 flex items-center justify-center h-10 w-10 rounded-full ${colorMap[type]}`}>{iconMap[type]}</div>;
}

const formatRelativeTime = (date: Date) => {
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    if (seconds < 60) return `${seconds}s ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
};


export const NotificationsPanel: React.FC<{onClose: () => void}> = ({ onClose }) => {
    const { notifications, markAsRead, markAllAsRead, unreadCount } = useNotificationsContext();
    const recentNotifications = notifications.slice(0, 5);

    const handleMarkAsRead = (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        markAsRead(id);
    };

    return (
        <div className="absolute top-full right-0 mt-2 w-80 max-w-sm bg-white dark:bg-gray-800 rounded-lg shadow-lg border dark:border-gray-700 z-50">
            <div className="flex justify-between items-center p-3 border-b dark:border-gray-700">
                <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-200">Notifications</h4>
                {unreadCount > 0 && (
                    <button onClick={markAllAsRead} className="text-xs font-medium text-blue-600 hover:underline">Mark all as read</button>
                )}
            </div>
            <div className="divide-y divide-gray-100 dark:divide-gray-700 max-h-96 overflow-y-auto">
                {recentNotifications.length > 0 ? (
                    recentNotifications.map(notification => (
                        <div key={notification.id} onClick={(e) => handleMarkAsRead(e, notification.id)} className={`flex items-start gap-3 p-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 ${!notification.read ? 'bg-blue-50 dark:bg-blue-900/20' : ''}`}>
                            <NotificationIcon type={notification.type} />
                            <div className="flex-1">
                                <p className="text-sm font-semibold text-gray-900 dark:text-white">{notification.title}</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">{notification.message}</p>
                                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{formatRelativeTime(notification.timestamp)}</p>
                            </div>
                            {!notification.read && <div className="w-2.5 h-2.5 bg-blue-500 rounded-full mt-1 flex-shrink-0"></div>}
                        </div>
                    ))
                ) : (
                    <p className="p-4 text-sm text-center text-gray-500 dark:text-gray-400">No new notifications.</p>
                )}
            </div>
        </div>
    );
};