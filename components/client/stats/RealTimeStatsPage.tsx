import React from 'react';
import { useRealTimeStats } from '../../../hooks/useRealTimeStats';
import StatCard from '../../dashboard/StatCard';
import LiveLineChart from '../../charts/LiveLineChart';
import DonutChart from '../../charts/DonutChart';
import { UsersIcon, WifiIcon } from '../../icons/IconComponents';

const formatDataUsage = (mb: number): string => {
    if (mb < 1024) return `${mb.toFixed(2)} MB`;
    return `${(mb / 1024).toFixed(2)} GB`;
};

const RealTimeStatsPage: React.FC = () => {
  const { bandwidthData, activeUsers, topUsers, deviceDistribution } = useRealTimeStats();
  
  const latestBandwidth = bandwidthData[bandwidthData.length - 1] || { upload: 0, download: 0 };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard title="Active Users" value={activeUsers} icon={<UsersIcon />} colorClass="bg-green-500" />
        <StatCard title="Live Download" value={latestBandwidth.download} icon={<WifiIcon />} colorClass="bg-blue-500" suffix="Mbps" />
        <StatCard title="Live Upload" value={latestBandwidth.upload} icon={<WifiIcon />} colorClass="bg-sky-500" suffix="Mbps" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <LiveLineChart title="Live Bandwidth Usage" data={bandwidthData} />
        </div>
        <div>
          <DonutChart title="Device Types" data={deviceDistribution} />
        </div>
      </div>
       <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">Top Users by Data Usage</h3>
           <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            <th scope="col" className="px-6 py-3">Username</th>
                            <th scope="col" className="px-6 py-3">IP Address</th>
                            <th scope="col" className="px-6 py-3">MAC Address</th>
                            <th scope="col" className="px-6 py-3">Data Usage</th>
                        </tr>
                    </thead>
                    <tbody>
                        {topUsers.map(user => (
                             <tr key={user.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                                <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{user.username}</td>
                                <td className="px-6 py-4 font-mono text-xs">{user.ipAddress}</td>
                                <td className="px-6 py-4 font-mono text-xs">{user.macAddress}</td>
                                <td className="px-6 py-4 font-semibold">{formatDataUsage(user.dataUsage)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
           </div>
       </div>

    </div>
  );
};

export default RealTimeStatsPage;
