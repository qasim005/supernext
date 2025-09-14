import { useMemo } from 'react';
import { AccessLog } from '../types';

const createMockAccessLogs = (count: number): AccessLog[] => {
  const logs: AccessLog[] = [];
  const now = new Date();
  const users = ['client_user', 'admin@company.com', 'billing@company.com', 'support@company.com'];
  const locations = ['New York, USA', 'London, UK', 'Tokyo, JP', 'Sydney, AU', 'Unknown'];
  const devices = ['Chrome on Windows', 'Safari on macOS', 'Mobile App on Android', 'Firefox on Linux'];

  for (let i = 0; i < count; i++) {
    const isSuccess = Math.random() > 0.1; // 90% success rate
    logs.push({
      id: `log_${i + 1}`,
      user: users[Math.floor(Math.random() * users.length)],
      ipAddress: `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
      location: locations[Math.floor(Math.random() * locations.length)],
      device: devices[Math.floor(Math.random() * devices.length)],
      status: isSuccess ? 'Success' : 'Failed',
      timestamp: new Date(now.getTime() - Math.random() * 7 * 24 * 60 * 60 * 1000), // last 7 days
    });
  }
  return logs.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
};

export const useAccessLogs = (initialCount = 50) => {
  const logs = useMemo(() => createMockAccessLogs(initialCount), [initialCount]);
  
  return { logs };
};
