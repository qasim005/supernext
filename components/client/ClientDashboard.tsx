import React from 'react';
import { useVouchers } from '../../hooks/useVouchers';
import StatCard from '../dashboard/StatCard';
import { TicketIcon, UsersIcon, AlertTriangleIcon, PauseIcon } from '../icons/IconComponents';
import TestProtectedComponent from './TestProtectedComponent';

const ClientDashboard: React.FC = () => {
    const { stats } = useVouchers();

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
                <StatCard title="Total Vouchers" value={stats.total} icon={<TicketIcon />} colorClass="bg-blue-500" />
                <StatCard title="Active Vouchers" value={stats.active} icon={<UsersIcon />} colorClass="bg-green-500" />
                <StatCard title="Suspended" value={stats.suspended} icon={<PauseIcon />} colorClass="bg-yellow-500" />
                <StatCard title="Expiring Soon" value={stats.expiringSoon} icon={<AlertTriangleIcon />} colorClass="bg-orange-500" />
                <StatCard title="Expired Vouchers" value={stats.expired} icon={<TicketIcon />} colorClass="bg-red-500" />
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 text-center">
                <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">Welcome to Your Dashboard</h2>
                <p className="mt-2 text-gray-600 dark:text-gray-400">
                    Here is a quick overview of your voucher statistics. For more detailed actions, please visit the{' '}
                    <span className="font-semibold text-blue-600 dark:text-blue-400">Voucher Management</span> tab.
                </p>
            </div>
            
            {/* Test Protected Component - Remove this after testing */}
            <TestProtectedComponent />
        </div>
    );
};

export default ClientDashboard;
