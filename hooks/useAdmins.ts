import { useState, useMemo, useCallback } from 'react';
import { AdminUser, AdminRole } from '../types';

const createMockAdmins = (): AdminUser[] => {
    return [
        { id: 'admin_1', name: 'Jane Foster', email: 'jane.foster@superlink.com', role: 'Full Access', lastLogin: new Date(Date.now() - 3 * 3600 * 1000) },
        { id: 'admin_2', name: 'Peter Quill', email: 'peter.quill@superlink.com', role: 'Support', lastLogin: new Date(Date.now() - 25 * 3600 * 1000) },
        { id: 'admin_3', name: 'Bruce Banner', email: 'bruce.banner@superlink.com', role: 'Read-only', lastLogin: new Date(Date.now() - 50 * 3600 * 1000) },
    ];
};

export const useAdmins = () => {
    const [admins, setAdmins] = useState<AdminUser[]>(createMockAdmins);

    const addAdmin = useCallback((adminData: Omit<AdminUser, 'id' | 'lastLogin'>) => {
        const newAdmin: AdminUser = {
            ...adminData,
            id: `admin_${Date.now()}`,
            lastLogin: new Date(), // Set current time for new user, though they haven't logged in
        };
        setAdmins(prev => [...prev, newAdmin]);
    }, []);

    const updateAdmin = useCallback((id: string, adminData: Partial<AdminUser>) => {
        setAdmins(prev => prev.map(admin => admin.id === id ? { ...admin, ...adminData } : admin));
    }, []);

    const deleteAdmin = useCallback((id: string) => {
        setAdmins(prev => prev.filter(admin => admin.id !== id));
    }, []);

    return { admins, addAdmin, updateAdmin, deleteAdmin };
};
