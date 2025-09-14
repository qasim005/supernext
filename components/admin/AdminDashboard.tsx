

import React from 'react';
import { useAdminStats } from '../../hooks/useAdminStats';
import StatCard from '../dashboard/StatCard';
import SimpleBarChart from '../charts/SimpleBarChart';
import { WifiIcon, UsersIcon, DatabaseIcon } from '../icons/IconComponents';

const AdminDashboard: React.FC = () => {
  const { stats } = useAdminStats();

  const formatTimestamp = (date: Date) => {
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    let interval = seconds / 31536000;
    if (interval > 1) return `${Math.floor(interval)} years ago`;
    interval = seconds / 2592000;
    if (interval > 1) return `${Math.floor(interval)} months ago`;
    interval = seconds / 86400;
    if (interval > 1) return `${Math.floor(interval)} days ago`;
    interval = seconds / 3600;
    if (interval > 1) return `${Math.floor(interval)} hours ago`;
    interval = seconds / 60;
    if (interval > 1) return `${Math.floor(interval)} minutes ago`;
    return `${Math.floor(seconds)} seconds ago`;
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Online Access Points" value={stats.network.onlineAPs} icon={<WifiIcon />} colorClass="bg-green-500" />
        <StatCard title="Total Users" value={stats.users.total} icon={<UsersIcon />} colorClass="bg-indigo-500" />
        <StatCard title="Active Sessions" value={stats.users.active} icon={<UsersIcon />} colorClass="bg-sky-500" />
        <StatCard title="Data Consumed" value={stats.data.consumedGB} icon={<DatabaseIcon />} colorClass="bg-purple-500" suffix="GB" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
            <SimpleBarChart
                title="Daily Active Users"
                data={stats.charts.dailyUsers.map(d => ({ label: d.day, value: d.users }))}
            />
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">Recent Activity</h3>
          <ul className="space-y-4">
            {stats.logs.map(log => (
              <li key={log.id} className="flex items-start space-x-3">
                <div className="flex-shrink-0 h-2 w-2 rounded-full bg-blue-500 mt-2"></div>
                <div className="flex-1">
                  <p className="text-sm text-gray-700 dark:text-gray-300">{log.action}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    by <span className="font-medium">{log.user}</span> &bull; {formatTimestamp(log.timestamp)}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;