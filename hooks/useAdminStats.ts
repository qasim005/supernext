
import { useMemo } from 'react';

// Mock data generation
const generateAdminStats = () => {
  const totalAPs = 50;
  const onlineAPs = Math.floor(totalAPs * (Math.random() * 0.1 + 0.9)); // 90-100% online
  const totalUsers = 1250;
  const activeSessions = Math.floor(totalUsers * (Math.random() * 0.2 + 0.6)); // 60-80% active
  const dataConsumedGB = (Math.random() * 500 + 800).toFixed(2); // 800-1300 GB
  
  const dailyUsersData = [
    { day: 'Mon', users: Math.floor(Math.random() * 100 + 300) },
    { day: 'Tue', users: Math.floor(Math.random() * 100 + 350) },
    { day: 'Wed', users: Math.floor(Math.random() * 100 + 400) },
    { day: 'Thu', users: Math.floor(Math.random() * 100 + 420) },
    { day: 'Fri', users: Math.floor(Math.random() * 100 + 500) },
    { day: 'Sat', users: Math.floor(Math.random() * 100 + 600) },
    { day: 'Sun', users: Math.floor(Math.random() * 100 + 550) },
  ];

  const activityLog = [
    { id: 1, user: 'api_service', action: 'Generated 50 new vouchers', timestamp: new Date(Date.now() - 2 * 60 * 1000) },
    { id: 2, user: 'admin_john', action: 'Updated splash page logo', timestamp: new Date(Date.now() - 15 * 60 * 1000) },
    { id: 3, user: 'AP-05-GH', action: 'Reported high latency', timestamp: new Date(Date.now() - 35 * 60 * 1000) },
    { id: 4, user: 'user_jane_d', action: 'Activated voucher 83475921', timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000) },
    { id: 5, user: 'system', action: 'Firmware update scheduled for APs', timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000) },
  ];

  return {
    network: {
      totalAPs,
      onlineAPs,
      offlineAPs: totalAPs - onlineAPs,
    },
    users: {
      total: totalUsers,
      active: activeSessions,
    },
    data: {
      consumedGB: parseFloat(dataConsumedGB),
    },
    charts: {
      dailyUsers: dailyUsersData,
    },
    logs: activityLog,
  };
};

export const useAdminStats = () => {
  const stats = useMemo(() => generateAdminStats(), []);
  return { stats };
};
