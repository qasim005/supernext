import React from 'react';
import StatCard from '../dashboard/StatCard';
import { useReports } from '../../hooks/useReports';
import { TicketIcon, FileDownIcon, MailIcon, FilePdfIcon } from '../icons/IconComponents';

const ReportsPage: React.FC = () => {
  const { stats } = useReports();
  
  const handleActionClick = (action: string) => {
    console.log(`${action} button clicked.`);
    // Placeholder for actual functionality
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">Daily Statistics</h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard title="Vouchers Sold Today" value={stats.daily.sold} icon={<TicketIcon />} colorClass="bg-green-500" />
          <StatCard title="Vouchers Expired Today" value={stats.daily.expired} icon={<TicketIcon />} colorClass="bg-red-500" />
          <StatCard title="Estimated Revenue" value={stats.daily.revenue} icon={<TicketIcon />} colorClass="bg-sky-500" suffix="USD" />
        </div>
      </div>
      
       <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">Generate Reports</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Generate and download reports for your sales and voucher activity for a specific date range.
          </p>
           <div className="flex flex-col md:flex-row items-end gap-4 mb-6">
                <div className="flex-1 w-full">
                    <label htmlFor="start-date" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Start Date</label>
                    <input type="date" id="start-date" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600" />
                </div>
                 <div className="flex-1 w-full">
                    <label htmlFor="end-date" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">End Date</label>
                    <input type="date" id="end-date" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600" />
                </div>
            </div>
          <div className="flex flex-col sm:flex-row gap-4">
             <button onClick={() => handleActionClick('Email Report')} className="flex-1 flex items-center justify-center gap-2 text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2.5 dark:bg-blue-500 dark:hover:bg-blue-600 focus:outline-none dark:focus:ring-blue-800">
                <MailIcon className="w-5 h-5" />
                Email Report
            </button>
             <button onClick={() => handleActionClick('Export CSV')} className="flex-1 flex items-center justify-center gap-2 text-gray-900 bg-white border border-gray-300 hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-sm px-4 py-2.5 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700">
                <FileDownIcon className="w-5 h-5" />
                Export to CSV
            </button>
             <button onClick={() => handleActionClick('Download PDF')} className="flex-1 flex items-center justify-center gap-2 text-gray-900 bg-white border border-gray-300 hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-sm px-4 py-2.5 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700">
                <FilePdfIcon className="w-5 h-5" />
                Download as PDF
            </button>
          </div>
        </div>
    </div>
  );
};

export default ReportsPage;
