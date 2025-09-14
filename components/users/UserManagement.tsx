import React, { useState, useMemo } from 'react';
import { useClientUsers } from '../../hooks/useClientUsers';
import StatCard from '../dashboard/StatCard';
import UserTable from './UserTable';
import Pagination from '../vouchers/Pagination';
import { UsersIcon } from '../icons/IconComponents';
// Fix: Import NotificationType to use the enum value for notifications.
import { PaymentStatus, NotificationType } from '../../types';
import { useNotificationsContext } from '../../context/NotificationsContext';

const ITEMS_PER_PAGE = 10;

const UserManagement: React.FC = () => {
  const { users, stats, toggleUserAccess, suspendUser, resetUserPassword } = useClientUsers();
  const { addNotification } = useNotificationsContext();
  const [currentPage, setCurrentPage] = useState(1);
  const [filter, setFilter] = useState<PaymentStatus | 'all'>('all');
  
  const filteredUsers = useMemo(() => {
    if (filter === 'all') return users;
    return users.filter(user => user.paymentStatus === filter);
  }, [users, filter]);

  const paginatedUsers = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return filteredUsers.slice(startIndex, endIndex);
  }, [filteredUsers, currentPage]);

  const handleResetPassword = (id: string) => {
    resetUserPassword(id);
    const user = users.find(u => u.id === id);
    if(user) {
      addNotification({
        // Fix: Use the NotificationType enum for the notification type to match the expected type.
        type: NotificationType.Security,
        title: 'Password Reset',
        message: `A password reset link has been sent to ${user.email}.`
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Clients" value={stats.total} icon={<UsersIcon />} colorClass="bg-indigo-500" />
        <StatCard title="Active Subscriptions" value={stats.active} icon={<UsersIcon />} colorClass="bg-green-500" />
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 md:p-6">
        <div className="mb-4">
             <label htmlFor="status-filter" className="sr-only">Filter by Status</label>
             <select 
                id="status-filter" 
                value={filter}
                onChange={(e) => setFilter(e.target.value as PaymentStatus | 'all')}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full md:w-1/4 p-2.5 dark:bg-gray-700 dark:border-gray-600"
            >
                <option value="all">All Statuses</option>
                {Object.values(PaymentStatus).map(status => (
                    <option key={status} value={status}>{status}</option>
                ))}
            </select>
        </div>
        <UserTable 
          users={paginatedUsers} 
          onToggleAccess={toggleUserAccess} 
          onSuspend={suspendUser}
          onResetPassword={handleResetPassword}
        />
        <Pagination
          currentPage={currentPage}
          totalItems={filteredUsers.length}
          itemsPerPage={ITEMS_PER_PAGE}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
};

export default UserManagement;