import { useState, useEffect } from 'react';
import { BandwidthPoint, DeviceDistribution } from '../types';
import { User } from '../types';
import { useUsers } from './useUsers';

const MAX_DATA_POINTS = 20;

export const useRealTimeStats = () => {
  const { users } = useUsers(50);
  const [bandwidthData, setBandwidthData] = useState<BandwidthPoint[]>([]);
  const [activeUsers, setActiveUsers] = useState(0);
  const [topUsers, setTopUsers] = useState<User[]>([]);
  const [deviceDistribution, setDeviceDistribution] = useState<DeviceDistribution[]>([
    { name: 'Mobile', value: 65, color: '#3B82F6' },
    { name: 'Desktop', value: 25, color: '#10B981' },
    { name: 'Tablet', value: 10, color: '#F59E0B' },
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate bandwidth update
      setBandwidthData(prevData => {
        const now = new Date();
        const newPoint: BandwidthPoint = {
          time: `${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`,
          upload: parseFloat((Math.random() * 5 + 1).toFixed(2)), // 1-6 Mbps
          download: parseFloat((Math.random() * 20 + 5).toFixed(2)), // 5-25 Mbps
        };
        const newData = [...prevData, newPoint];
        return newData.length > MAX_DATA_POINTS ? newData.slice(1) : newData;
      });

      // Simulate active users and top users update
      const onlineUsers = users.filter(u => Math.random() > 0.2); // Fluctuate online status
      setActiveUsers(onlineUsers.length);

      const updatedTopUsers = onlineUsers
        .map(u => ({...u, dataUsage: u.dataUsage + Math.random() * 2})) // Increment usage
        .sort((a, b) => b.dataUsage - a.dataUsage)
        .slice(0, 5);
      setTopUsers(updatedTopUsers);

      // Simulate device distribution change
      setDeviceDistribution(prev => {
        const newMobile = Math.max(50, prev[0].value + (Math.random() > 0.5 ? 1 : -1));
        const newDesktop = 100 - newMobile - prev[2].value;
        return [
            {...prev[0], value: newMobile },
            {...prev[1], value: newDesktop },
            {...prev[2], value: prev[2].value }
        ]
      })

    }, 2000); // Update every 2 seconds

    return () => clearInterval(interval);
  }, [users]);

  return { bandwidthData, activeUsers, topUsers, deviceDistribution };
};
