import { useState, useMemo, useCallback } from 'react';
import { ClientUser, SubscriptionPlan, PaymentStatus } from '../types';

const createMockClientUsers = (count: number): ClientUser[] => {
  const users: ClientUser[] = [];
  const now = new Date();
  const plans = Object.values(SubscriptionPlan);
  const statuses = Object.values(PaymentStatus);

  for (let i = 0; i < count; i++) {
    const plan = plans[i % plans.length];
    const status = statuses[i % statuses.length];
    
    let nextDueDate: Date | null = new Date(now.getTime() + (Math.random() * 30) * 24 * 60 * 60 * 1000);
    if (status === PaymentStatus.Canceled) {
      nextDueDate = null;
    }

    users.push({
      id: `client_${i + 1}`,
      name: `Client User ${i + 1}`,
      email: `client${i+1}@example.com`,
      subscriptionPlan: plan,
      paymentStatus: status,
      nextDueDate: nextDueDate,
      accessEnabled: status !== PaymentStatus.Canceled && status !== PaymentStatus.Overdue && status !== PaymentStatus.Suspended,
    });
  }
  return users.sort((a, b) => (a.name > b.name ? 1 : -1));
};

export const useClientUsers = (initialCount = 25) => {
  const [users, setUsers] = useState<ClientUser[]>(() => createMockClientUsers(initialCount));
  
  const stats = useMemo(() => {
    return {
      total: users.length,
      active: users.filter(u => u.paymentStatus === PaymentStatus.Active).length,
    };
  }, [users]);

  const toggleUserAccess = useCallback((id: string) => {
    setUsers(prev => 
      prev.map(user => 
        user.id === id ? { ...user, accessEnabled: !user.accessEnabled } : user
      )
    );
  }, []);

  const suspendUser = useCallback((id: string) => {
    setUsers(prev =>
      prev.map(user =>
        user.id === id ? { ...user, paymentStatus: PaymentStatus.Suspended, accessEnabled: false } : user
      )
    );
  }, []);

  const resetUserPassword = useCallback((id: string) => {
    const user = users.find(u => u.id === id);
    if (user) {
      console.log(`Password reset link sent to ${user.email}`);
      // In a real app, this would trigger an API call.
    }
  }, [users]);

  return { users, stats, toggleUserAccess, suspendUser, resetUserPassword };
};
