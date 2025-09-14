import React, { useEffect, useRef } from 'react';
import { useAccessLogs } from '../../../hooks/useAccessLogs';
import { useNotificationsContext } from '../../../context/NotificationsContext';
import { NotificationType } from '../../../types';

const AccessLogsPage: React.FC = () => {
    const { logs } = useAccessLogs();
    const { addNotification } = useNotificationsContext();
    const notificationsSentRef = useRef(false);

    useEffect(() => {
        if (!notificationsSentRef.current) {
            const failedLogs = logs.filter(log => log.status === 'Failed');
            if (failedLogs.length > 0) {
                const latestFailedLog = failedLogs[0]; // Assuming logs are sorted by date desc
                 addNotification({
                    type: NotificationType.Security,
                    title: 'Security Alert',
                    message: `A failed login attempt was detected from IP ${latestFailedLog.ipAddress}.`,
                });
            }
            notificationsSentRef.current = true;
        }
    }, [logs, addNotification]);
    
    const formatTimestamp = (date: Date) => {
        return date.toLocaleString();
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 md:p-6">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">Dashboard Access Logs</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
                This log shows all successful and failed sign-in attempts to your dashboard.
            </p>
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            <th scope="col" className="px-6 py-3">Timestamp</th>
                            <th scope="col" className="px-6 py-3">User</th>
                            <th scope="col" className="px-6 py-3">Status</th>
                            <th scope="col" className="px-6 py-3">IP Address</th>
                            <th scope="col" className="px-6 py-3">Location</th>
                            <th scope="col" className="px-6 py-3">Device/Browser</th>
                        </tr>
                    </thead>
                    <tbody>
                    {logs.map((log) => (
                        <tr key={log.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                            <td className="px-6 py-4 whitespace-nowrap">{formatTimestamp(log.timestamp)}</td>
                            <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{log.user}</td>
                            <td className="px-6 py-4">
                                <span className={`px-2 py-1 text-xs font-medium rounded-full ${log.status === 'Success' 
                                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' 
                                    : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'}`
                                }>
                                    {log.status}
                                </span>
                            </td>
                            <td className="px-6 py-4 font-mono text-xs">{log.ipAddress}</td>
                            <td className="px-6 py-4">{log.location}</td>
                            <td className="px-6 py-4">{log.device}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AccessLogsPage;
