import { useMemo, useState, useCallback } from 'react';
import { SubUser, SubUserActivity, SubUserRole } from '../types';

const createMockSubUsers = (): SubUser[] => {
  const now = new Date();
  return [
    { id: 'sub_1', name: 'John Doe', email: 'admin@company.com', role: 'Admin', status: 'Active', lastLogin: new Date(now.getTime() - 2 * 60 * 60 * 1000) },
    { id: 'sub_2', name: 'Jane Smith', email: 'billing@company.com', role: 'Billing', status: 'Active', lastLogin: new Date(now.getTime() - 28 * 60 * 60 * 1000) },
    { id: 'sub_3', name: 'Peter Jones', email: 'support@company.com', role: 'Read-only', status: 'Pending Invitation', lastLogin: null },
  ];
};

const createMockActivity = (): SubUserActivity[] => {
    const now = new Date();
    return [
        { id: 'act_1', user: 'admin@company.com', action: 'Generated 100 vouchers in "Weekend-Promo" batch.', timestamp: new Date(now.getTime() - 5 * 60 * 1000) },
        { id: 'act_2', user: 'billing@company.com', action: 'Downloaded invoice #INV-003.', timestamp: new Date(now.getTime() - 2 * 60 * 60 * 1000) },
        { id: 'act_3', user: 'admin@company.com', action: 'Suspended 5 vouchers.', timestamp: new Date(now.getTime() - 24 * 60 * 60 * 1000) },
    ].sort((a,b) => b.timestamp.getTime() - a.timestamp.getTime());
};


export const useUserAccess = () => {
  const [users, setUsers] = useState<SubUser[]>(createMockSubUsers);
  const [activities, setActivities] = useState<SubUserActivity[]>(createMockActivity);
  
  const planLimits = useMemo(() => ({
      'Pro': 5,
      'Starter': 1,
  }), []);

  const addUser = useCallback((name: string, email: string, role: SubUserRole) => {
      const newUser: SubUser = {
        id: `sub_${Date.now()}`,
        name,
        email,
        role,
        status: 'Pending Invitation',
        lastLogin: null
      };
      setUsers(prev => [...prev, newUser]);
  }, []);

  const deleteUser = useCallback((id: string) => {
      setUsers(prev => prev.filter(u => u.id !== id));
  }, []);

  return { users, activities, planLimits, addUser, deleteUser };
};
