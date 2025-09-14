import { useMemo } from 'react';

const generateReportStats = () => {
  return {
    daily: {
      sold: Math.floor(Math.random() * 50) + 10, // 10-60
      expired: Math.floor(Math.random() * 20) + 5, // 5-25
      revenue: parseFloat(((Math.random() * 150) + 50).toFixed(2)), // $50 - $200
    },
  };
};

export const useReports = () => {
  const stats = useMemo(() => generateReportStats(), []);
  return { stats };
};