import React from 'react';
import { GoogleIcon, CloudIcon, DatabaseIcon } from '../icons/IconComponents';

const BackupProviderCard: React.FC<{
  icon: React.ReactNode;
  title: string;
  description: string;
}> = ({ icon, title, description }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <div className="flex items-center gap-4 mb-4">
        <div className="text-gray-700 dark:text-gray-300">{icon}</div>
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">{title}</h3>
      </div>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
        {description}
      </p>
      <div className="flex items-center justify-between mb-6">
        <span className="text-sm font-medium text-gray-900 dark:text-gray-300">Enable automatic 24-hour backup</span>
        <label className="inline-flex items-center cursor-pointer">
          <input type="checkbox" value="" className="sr-only peer" />
          <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
        </label>
      </div>
      <button className="w-full flex items-center justify-center gap-2 text-gray-900 bg-white border border-gray-300 hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-sm px-4 py-2.5 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700">
        Backup Now
      </button>
    </div>
  );
};

const BackupPage: React.FC = () => {
  return (
    <div className="space-y-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border-l-4 border-green-500">
            <div className="flex items-center gap-4">
                <DatabaseIcon className="w-10 h-10 text-green-500" />
                <div>
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Database Status</h3>
                    <p className="text-sm font-bold text-green-500">Live & Connected</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        Your voucher database is online and all data is being persisted in real-time.
                    </p>
                </div>
            </div>
        </div>
        <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">Data Backup Configuration</h2>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
                Secure your voucher data by setting up automatic daily backups to your preferred cloud storage provider. You can also perform a manual backup at any time.
            </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
            <BackupProviderCard
                icon={<GoogleIcon className="w-8 h-8" />}
                title="Google Drive"
                description="Automatically back up your voucher data to a dedicated folder in your Google Drive account every 24 hours."
            />
            <BackupProviderCard
                icon={<CloudIcon className="w-8 h-8 text-sky-500" />}
                title="OneDrive"
                description="Keep your data safe with automatic daily backups to your Microsoft OneDrive account. Restore at any time."
            />
        </div>
    </div>
  );
};

export default BackupPage;