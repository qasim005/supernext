
import { useState, useMemo } from 'react';
import { User, UserStatus } from '../types';

const generateMACAddress = (): string => {
  return 'XX:XX:XX:XX:XX:XX'.replace(/X/g, () => {
    return '0123456789ABCDEF'.charAt(Math.floor(Math.random() * 16));
  });
};

const createMockUsers = (count: number): User[] => {
  const users: User[] = [];
  const now = new Date();
  for (let i = 0; i < count; i++) {
    const isOnline = Math.random() > 0.3; // 70% chance of being online
    const lastSeen = new Date(now.getTime() - Math.random() * 3 * 24 * 60 * 60 * 1000); // last 3 days
    
    users.push({
      id: `user_${i + 1}`,
      username: `user${1000 + i}`,
      macAddress: generateMACAddress(),
      ipAddress: `192.168.1.${100 + i}`,
      status: isOnline ? UserStatus.Online : UserStatus.Offline,
      dataUsage: parseFloat((Math.random() * 5000).toFixed(2)), // 0-5000 MB
      connectedSince: isOnline ? new Date(now.getTime() - Math.random() * 5 * 60 * 60 * 1000) : null, // connected in last 5 hours
      lastSeen: isOnline ? now : lastSeen,
    });
  }
  return users.sort((a, b) => b.lastSeen.getTime() - a.lastSeen.getTime());
};

export const useUsers = (initialCount = 250) => {
  const [users, setUsers] = useState<User[]>(() => createMockUsers(initialCount));
  const [loading, setLoading] = useState(false);

  const stats = useMemo(() => {
    return {
      total: users.length,
      online: users.filter(u => u.status === UserStatus.Online).length,
    };
  }, [users]);

  // Placeholder for future actions
  const disconnectUser = (id: string) => {
    console.log(`Disconnecting user ${id}`);
    setUsers(prev => prev.map(u => u.id === id ? { ...u, status: UserStatus.Offline, connectedSince: null } : u));
  };

  return { users, stats, loading, disconnectUser };
};
