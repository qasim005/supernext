import React, { useMemo } from 'react';
import { useClientUsers } from '../../hooks/useClientUsers';
// Fix: Import NotificationType to use the enum value for notifications.
import { ClientUser, NotificationType } from '../../types';
import { useNotificationsContext } from '../../context/NotificationsContext';

const ClientSummaryCard: React.FC<{ client: ClientUser }> = ({ client }) => {
    const { addNotification } = useNotificationsContext();
    // FIX: Replaced `useVouchers` with a memoized mock stats object.
    // The `useVouchers` hook fetches real data and does not accept arguments,
    // causing a type error and an unintentional API call for every client card.
    // This change generates randomized demo stats for each client as intended by the original comment.
    const stats = useMemo(() => {
        const total = Math.floor(Math.random() * 500) + 50;
        const active = Math.floor(total * (Math.random() * 0.4 + 0.4)); // 40-80% active
        return { total, active };
    }, []);

    const handleViewDashboard = () => {
        addNotification({
            // Fix: Use the NotificationType enum for the notification type to match the expected type.
            type: NotificationType.Security,
            title: 'Switched View',
            message: `You are now viewing the dashboard for ${client.name}.`
        });
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 flex flex-col justify-between">
            <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{client.name}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">{client.email}</p>
                <div className="mt-4 space-y-2">
                    <p className="text-sm"><strong>Plan:</strong> {client.subscriptionPlan}</p>
                    <p className="text-sm"><strong>Status:</strong> {client.paymentStatus}</p>
                    <p className="text-sm"><strong>Active Vouchers:</strong> {stats.active}</p>
                    <p className="text-sm"><strong>Total Vouchers:</strong> {stats.total}</p>
                </div>
            </div>
            <button 
                onClick={handleViewDashboard}
                className="mt-6 w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-500 dark:hover:bg-blue-600 dark:focus:ring-blue-800"
            >
                View Dashboard
            </button>
        </div>
    );
};

const MasterDashboard: React.FC = () => {
    const { users: clients } = useClientUsers();

    return (
        <div className="space-y-6">
            <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">All Clients Overview</h2>
                <p className="text-gray-600 dark:text-gray-400">
                    You have {clients.length} clients registered on the platform.
                </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {clients.map(client => (
                    <ClientSummaryCard key={client.id} client={client} />
                ))}
            </div>
        </div>
    );
};

export default MasterDashboard;