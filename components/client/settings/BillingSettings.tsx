import React, { useEffect, useRef } from 'react';
import { useClientSettings } from '../../../hooks/useClientSettings';
import { CreditCardIcon, FileTextIcon } from '../../icons/IconComponents';
import { useNotificationsContext } from '../../../context/NotificationsContext';
import { NotificationType } from '../../../types';

const BillingSettings: React.FC = () => {
    const { billing } = useClientSettings();
    const { addNotification } = useNotificationsContext();
    const notificationSentRef = useRef(false);

    useEffect(() => {
        if (!notificationSentRef.current) {
            const now = new Date();
            const sevenDaysFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
            if (billing.renewalDate <= sevenDaysFromNow && billing.renewalDate > now) {
                addNotification({
                    type: NotificationType.Billing,
                    title: 'Subscription Renewal',
                    message: `Your '${billing.plan} Plan' renews on ${billing.renewalDate.toLocaleDateString()}.`
                });
                notificationSentRef.current = true;
            }
        }
    }, [billing, addNotification]);

    return (
        <div className="space-y-8">
            {/* Subscription Overview */}
            <div>
                <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">Subscription Overview</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-gray-50 dark:bg-gray-700/50 p-6 rounded-lg">
                        <h4 className="font-semibold text-gray-900 dark:text-white">Current Plan</h4>
                        <p className="text-2xl font-bold text-blue-600 dark:text-blue-400 mt-2">{billing.plan} Plan</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Renews on {billing.renewalDate.toLocaleDateString()}</p>
                        <button className="mt-4 text-sm font-medium text-blue-600 hover:underline">Change Plan</button>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-700/50 p-6 rounded-lg">
                        <h4 className="font-semibold text-gray-900 dark:text-white">Service Usage</h4>
                         <p className="text-2xl font-bold text-gray-800 dark:text-gray-200 mt-2">{billing.vouchersUsed} / {billing.voucherLimit}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Vouchers Generated This Cycle</p>
                    </div>
                     <div className="bg-gray-50 dark:bg-gray-700/50 p-6 rounded-lg">
                        <h4 className="font-semibold text-gray-900 dark:text-white">Auto-Renewal</h4>
                        <div className="flex items-center justify-between mt-4">
                           <span className={`text-sm font-medium ${billing.autoRenewal ? 'text-green-600 dark:text-green-400' : 'text-gray-600 dark:text-gray-400'}`}>
                            {billing.autoRenewal ? 'Enabled' : 'Disabled'}
                           </span>
                            <label className="inline-flex items-center cursor-pointer">
                            <input type="checkbox" defaultChecked={billing.autoRenewal} className="sr-only peer" />
                            <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                            </label>
                        </div>
                    </div>
                </div>
            </div>

            {/* Payment Methods */}
            <div>
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Payment Methods</h3>
                    <button className="px-3 py-1.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700">Add New Method</button>
                </div>
                <div className="space-y-4">
                    {billing.paymentMethods.map(method => (
                        <div key={method.id} className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                            <div className="flex items-center gap-4">
                                <CreditCardIcon className="w-6 h-6 text-gray-500" />
                                <div>
                                    <p className="font-medium text-gray-900 dark:text-white">{method.type} ending in {method.last4}</p>
                                    {method.isDefault && <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">Default</span>}
                                </div>
                            </div>
                            <div className="flex gap-4">
                                {!method.isDefault && <button className="text-sm font-medium text-blue-600 hover:underline">Set as Default</button>}
                                <button className="text-sm font-medium text-red-600 hover:underline">Remove</button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Payment History */}
             <div>
                <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">Payment History</h3>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                            <tr>
                                <th scope="col" className="px-6 py-3">Invoice ID</th>
                                <th scope="col" className="px-6 py-3">Date</th>
                                <th scope="col" className="px-6 py-3">Amount</th>
                                <th scope="col" className="px-6 py-3">Status</th>
                                <th scope="col" className="px-6 py-3"></th>
                            </tr>
                        </thead>
                        <tbody>
                        {billing.invoices.map(invoice => (
                             <tr key={invoice.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">#{invoice.id}</td>
                                <td className="px-6 py-4">{invoice.date.toLocaleDateString()}</td>
                                <td className="px-6 py-4">${invoice.amount.toFixed(2)}</td>
                                <td className="px-6 py-4">
                                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">{invoice.status}</span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <button className="flex items-center gap-2 font-medium text-blue-600 dark:text-blue-500 hover:underline">
                                        <FileTextIcon className="w-4 h-4" /> Download
                                    </button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default BillingSettings;
