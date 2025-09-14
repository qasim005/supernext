import React, { useState, useRef, useEffect } from 'react';
import { ClientUser, PaymentStatus, SubscriptionPlan } from '../../types';
import { MoreVerticalIcon } from '../icons/IconComponents';

interface UserTableProps {
  users: ClientUser[];
  onToggleAccess: (id: string) => void;
  onSuspend: (id: string) => void;
  onResetPassword: (id: string) => void;
}

const planColorMap: Record<SubscriptionPlan, string> = {
  [SubscriptionPlan.Enterprise]: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
  [SubscriptionPlan.Professional]: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
  [SubscriptionPlan.Starter]: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
  [SubscriptionPlan.Trial]: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
};

const statusColorMap: Record<PaymentStatus, string> = {
  [PaymentStatus.Active]: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
  [PaymentStatus.Trial]: 'bg-sky-100 text-sky-800 dark:bg-sky-900 dark:text-sky-300',
  [PaymentStatus.Overdue]: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
  [PaymentStatus.Canceled]: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
  [PaymentStatus.Suspended]: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300',
};

const ActionsDropdown: React.FC<{ user: ClientUser; onToggleAccess: (id: string) => void; onSuspend: (id: string) => void; onResetPassword: (id: string) => void; }> = 
({ user, onToggleAccess, onSuspend, onResetPassword }) => {
    const [isOpen, setIsOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (ref.current && !ref.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleAction = (action: (id: string) => void) => {
        action(user.id);
        setIsOpen(false);
    };

    return (
        <div className="relative" ref={ref}>
            <button onClick={() => setIsOpen(!isOpen)} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
                <MoreVerticalIcon className="w-5 h-5" />
            </button>
            {isOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 dark:bg-gray-800 border dark:border-gray-700">
                    <ul className="py-1 text-sm text-gray-700 dark:text-gray-200">
                        <li>
                            <button onClick={() => handleAction(onToggleAccess)} className="block w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600">
                                {user.accessEnabled ? 'Disable Access' : 'Enable Access'}
                            </button>
                        </li>
                         <li>
                            <button onClick={() => handleAction(onSuspend)} className="block w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600">
                                Suspend Account
                            </button>
                        </li>
                        <li>
                            <button onClick={() => handleAction(onResetPassword)} className="block w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600">
                                Reset Password
                            </button>
                        </li>
                    </ul>
                </div>
            )}
        </div>
    );
};


const UserTable: React.FC<UserTableProps> = ({ users, onToggleAccess, onSuspend, onResetPassword }) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th scope="col" className="px-6 py-3">Client</th>
            <th scope="col" className="px-6 py-3">Subscription Plan</th>
            <th scope="col" className="px-6 py-3">Payment Status</th>
            <th scope="col" className="px-6 py-3">Next Due Date</th>
            <th scope="col" className="px-6 py-3">Access Enabled</th>
            <th scope="col" className="px-6 py-3 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
              <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                <p>{user.name}</p>
                <p className="text-xs font-normal text-gray-500 dark:text-gray-400">{user.email}</p>
              </th>
              <td className="px-6 py-4">
                 <span className={`px-2 py-1 text-xs font-medium rounded-full ${planColorMap[user.subscriptionPlan]}`}>
                    {user.subscriptionPlan}
                  </span>
              </td>
              <td className="px-6 py-4">
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusColorMap[user.paymentStatus]}`}>
                    {user.paymentStatus}
                  </span>
              </td>
              <td className="px-6 py-4">{user.nextDueDate ? user.nextDueDate.toLocaleDateString() : 'N/A'}</td>
              <td className="px-6 py-4">
                <div className={`h-2.5 w-2.5 rounded-full ${user.accessEnabled ? 'bg-green-500' : 'bg-red-500'}`}></div>
              </td>
              <td className="px-6 py-4 flex justify-center">
                <ActionsDropdown user={user} onToggleAccess={onToggleAccess} onSuspend={onSuspend} onResetPassword={onResetPassword} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserTable;
