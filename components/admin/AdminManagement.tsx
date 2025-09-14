import React, { useState } from 'react';
import { useAdmins } from '../../hooks/useAdmins';
import { AdminUser, AdminRole } from '../../types';

const AddEditAdminModal: React.FC<{
    onClose: () => void;
    onSave: (data: Omit<AdminUser, 'id' | 'lastLogin'> | (Partial<AdminUser> & { id: string })) => void;
    admin?: AdminUser;
}> = ({ onClose, onSave, admin }) => {
    const [name, setName] = useState(admin?.name || '');
    const [email, setEmail] = useState(admin?.email || '');
    const [role, setRole] = useState<AdminRole>(admin?.role || 'Read-only');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (admin) {
            onSave({ id: admin.id, name, email, role });
        } else {
            onSave({ name, email, role });
        }
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg shadow-xl dark:bg-gray-800 w-full max-w-md m-4">
                <div className="flex justify-between items-center p-4 border-b dark:border-gray-600">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{admin ? 'Edit' : 'Create'} Admin User</h3>
                    <button type="button" onClick={onClose} className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
                    </button>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="p-6 space-y-4">
                        <div>
                            <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Full Name</label>
                            <input type="text" id="name" value={name} onChange={e => setName(e.target.value)} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600" required />
                        </div>
                        <div>
                            <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Email Address</label>
                            <input type="email" id="email" value={email} onChange={e => setEmail(e.target.value)} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600" required />
                        </div>
                        <div>
                            <label htmlFor="role" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Role</label>
                            <select id="role" value={role} onChange={e => setRole(e.target.value as AdminRole)} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600">
                                <option>Full Access</option>
                                <option>Support</option>
                                <option>Read-only</option>
                            </select>
                        </div>
                    </div>
                    <div className="flex items-center p-6 space-x-2 border-t border-gray-200 rounded-b dark:border-gray-600">
                        <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};


const AdminManagement: React.FC = () => {
    const { admins, addAdmin, updateAdmin, deleteAdmin } = useAdmins();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingAdmin, setEditingAdmin] = useState<AdminUser | undefined>(undefined);

    const handleSave = (data: Omit<AdminUser, 'id' | 'lastLogin'> | (Partial<AdminUser> & { id: string })) => {
        if ('id' in data) {
            updateAdmin(data.id, data);
        } else {
            addAdmin(data);
        }
    };

    const openModal = (admin?: AdminUser) => {
        setEditingAdmin(admin);
        setIsModalOpen(true);
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 md:p-6">
            <div className="flex flex-col md:flex-row items-center justify-between space-y-3 md:space-y-0 p-4">
                <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">System Administrators</h2>
                <button
                    onClick={() => openModal()}
                    className="flex items-center justify-center text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-500 dark:hover:bg-blue-600 focus:outline-none dark:focus:ring-blue-800"
                >
                    Create Admin
                </button>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            <th scope="col" className="px-6 py-3">Name</th>
                            <th scope="col" className="px-6 py-3">Email</th>
                            <th scope="col" className="px-6 py-3">Role</th>
                            <th scope="col" className="px-6 py-3">Last Login</th>
                            <th scope="col" className="px-6 py-3">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {admins.map(admin => (
                            <tr key={admin.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                                <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{admin.name}</td>
                                <td className="px-6 py-4">{admin.email}</td>
                                <td className="px-6 py-4">{admin.role}</td>
                                <td className="px-6 py-4">{admin.lastLogin.toLocaleString()}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <button onClick={() => openModal(admin)} className="font-medium text-blue-600 dark:text-blue-500 hover:underline">Edit</button>
                                    <button onClick={() => deleteAdmin(admin.id)} className="font-medium text-red-600 dark:text-red-500 hover:underline ml-4">Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {isModalOpen && <AddEditAdminModal onClose={() => setIsModalOpen(false)} onSave={handleSave} admin={editingAdmin} />}
        </div>
    );
};

export default AdminManagement;
