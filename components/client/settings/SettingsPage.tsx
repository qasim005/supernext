import React, { useState } from 'react';
import ProfileSettings from './ProfileSettings';
import BillingSettings from './BillingSettings';

type Tab = 'profile' | 'billing';

const SettingsPage: React.FC = () => {
    const [activeTab, setActiveTab] = useState<Tab>('profile');

    const TabButton: React.FC<{tabName: Tab, label: string}> = ({ tabName, label }) => {
        const isActive = activeTab === tabName;
        return (
            <button
                onClick={() => setActiveTab(tabName)}
                className={`px-4 py-2 text-sm font-medium rounded-md ${
                    isActive
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-600 hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-gray-700'
                }`}
            >
                {label}
            </button>
        )
    }

    return (
        <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md">
                <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                    <nav className="flex space-x-2">
                        <TabButton tabName="profile" label="Profile" />
                        <TabButton tabName="billing" label="Billing & Subscription" />
                    </nav>
                </div>

                <div className="p-4 md:p-6">
                    {activeTab === 'profile' && <ProfileSettings />}
                    {activeTab === 'billing' && <BillingSettings />}
                </div>
            </div>
        </div>
    );
};

export default SettingsPage;
