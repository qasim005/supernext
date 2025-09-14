import React, { useState } from 'react';
import { useUserAccess } from '../../../hooks/useUserAccess';
import { SubUser, SubUserRole } from '../../../types';
import { UsersIcon } from '../../icons/IconComponents';

const InviteUserModal: React.FC<{onClose: () => void, onInvite: (name: string, email: string, role: SubUserRole) => void}> = ({onClose, onInvite}) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [role, setRole] = useState<SubUserRole>('Read-only');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onInvite(name, email, role);
        onClose();
    };
    
    return (
     <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl dark:bg-gray-800 w-full max-w-md m-4">
        <div className="flex justify-between items-center p-4 border-b dark:border-gray-600">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Invite New User</h3>
          <button type="button" onClick={onClose} className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-4">
            <div>
              <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Full Name</label>
              <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600" required />
            </div>
            <div>
              <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Email Address</label>
              <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600" required />
            </div>
            <div>
                <label htmlFor="role" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Role</label>
                <select id="role" value={role} onChange={e => setRole(e.target.value as SubUserRole)} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600">
                    <option>Read-only</option>
                    <option>Billing</option>
                    <option>Admin</option>
                </select>
            </div>
          </div>
          <div className="flex items-center p-6 space-x-2 border-t border-gray-200 rounded-b dark:border-gray-600">
            <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
              Send Invitation
            </button>
          </div>
        </form>
      </div>
    </div>
    );
};

const UserAccessPage: React.FC = () => {
    const { users, activities, planLimits, addUser, deleteUser } = useUserAccess();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const userLimit = planLimits['Pro']; // Assuming 'Pro' plan for mock

    const formatRelativeTime = (date: Date | null): string => {
        if (!date) return 'Never';
        const now = new Date();
        const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
        let interval = seconds / 3600;
        if (interval > 24) return date.toLocaleDateString();
        if (interval > 1) return `${Math.floor(interval)} hours ago`;
        interval = seconds / 60;
        if (interval > 1) return `${Math.floor(interval)} minutes ago`;
        return `A few seconds ago`;
    }

    return (
        <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 md:p-6">
                 <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-4">
                    <div>
                        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Manage Users</h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            You have used {users.length} of your {userLimit} available user seats.
                        </p>
                    </div>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        disabled={users.length >= userLimit}
                        className="mt-3 md:mt-0 flex items-center justify-center text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-500 dark:hover:bg-blue-600 focus:outline-none dark:focus:ring-blue-800 disabled:opacity-50"
                    >
                        <UsersIcon className="h-4 w-4 mr-2"/>
                        Invite User
                    </button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                         <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                            <tr>
                                <th scope="col" className="px-6 py-3">User</th>
                                <th scope="col" className="px-6 py-3">Role</th>
                                <th scope="col" className="px-6 py-3">Status</th>
                                <th scope="col" className="px-6 py-3">Last Login</th>
                                <th scope="col" className="px-6 py-3">Actions</th>
                            </tr>
                         </thead>
                         <tbody>
                            {users.map(user => (
                                <tr key={user.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                                    <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                        <p>{user.name}</p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">{user.email}</p>
                                    </th>
                                    <td className="px-6 py-4">{user.role}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${user.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                            {user.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">{formatRelativeTime(user.lastLogin)}</td>
                                    <td className="px-6 py-4">
                                        <button className="font-medium text-blue-600 dark:text-blue-500 hover:underline">Edit</button>
                                        <button onClick={() => deleteUser(user.id)} className="font-medium text-red-600 dark:text-red-500 hover:underline ml-4">Delete</button>
                                    </td>
                                </tr>
                            ))}
                         </tbody>
                    </table>
                </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 md:p-6">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">Sub-user Activity Log</h3>
                <ul className="space-y-4">
                {activities.map(log => (
                    <li key={log.id} className="flex items-start space-x-3">
                        <div className="flex-shrink-0 h-2 w-2 rounded-full bg-blue-500 mt-2"></div>
                        <div className="flex-1">
                        <p className="text-sm text-gray-700 dark:text-gray-300">{log.action}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                            by <span className="font-medium">{log.user}</span> &bull; {formatRelativeTime(log.timestamp)}
                        </p>
                        </div>
                    </li>
                    ))}
                </ul>
            </div>

            {isModalOpen && <InviteUserModal onClose={() => setIsModalOpen(false)} onInvite={addUser} />}
        </div>
    );
};

export default UserAccessPage;
