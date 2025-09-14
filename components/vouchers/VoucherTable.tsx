import React from 'react';
import { Voucher, VoucherStatus } from '../../types';
import { QrCodeIcon } from '../icons/IconComponents';

interface VoucherTableProps {
  vouchers: Voucher[];
  selectedVouchers: string[];
  onSelectAll: (isSelected: boolean) => void;
  onSelectOne: (id: string, isSelected: boolean) => void;
  onShowQrCode: (code: string) => void;
  onSort: (key: keyof Voucher) => void;
  sortConfig: { key: keyof Voucher; direction: 'ascending' | 'descending' } | null;
}

const statusColorMap: Record<VoucherStatus, string> = {
  [VoucherStatus.Active]: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
  [VoucherStatus.Pending]: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300',
  [VoucherStatus.Expired]: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
  [VoucherStatus.Suspended]: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
  [VoucherStatus.Archived]: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300',
};

const SortableHeader: React.FC<{
  columnKey: keyof Voucher;
  title: string;
  onSort: (key: keyof Voucher) => void;
  sortConfig: { key: keyof Voucher; direction: 'ascending' | 'descending' } | null;
}> = ({ columnKey, title, onSort, sortConfig }) => {
  const isSorted = sortConfig?.key === columnKey;
  const directionIcon = sortConfig?.direction === 'ascending' ? '▲' : '▼';

  return (
    <th scope="col" className="px-6 py-3">
      <button onClick={() => onSort(columnKey)} className="flex items-center gap-1.5 group font-semibold">
        <span className="group-hover:text-gray-900 dark:group-hover:text-white uppercase">{title}</span>
        <span className={`text-xs transition-opacity ${isSorted ? 'opacity-100' : 'opacity-30 group-hover:opacity-100'}`}>
          {isSorted ? directionIcon : '▼'}
        </span>
      </button>
    </th>
  );
};

const VoucherTable: React.FC<VoucherTableProps> = ({ vouchers, selectedVouchers, onSelectAll, onSelectOne, onShowQrCode, onSort, sortConfig }) => {
  const isAllSelected = vouchers.length > 0 && selectedVouchers.length === vouchers.length;

  const isExpiringSoon = (voucher: Voucher): boolean => {
    if (voucher.status === VoucherStatus.Expired) return false;
    const now = new Date();
    const sevenDaysFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    return voucher.expiresAt > now && voucher.expiresAt <= sevenDaysFromNow;
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th scope="col" className="p-4">
              <div className="flex items-center">
                <input 
                    id="checkbox-all" 
                    type="checkbox" 
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                    checked={isAllSelected}
                    onChange={(e) => onSelectAll(e.target.checked)}
                />
                <label htmlFor="checkbox-all" className="sr-only">checkbox</label>
              </div>
            </th>
            <SortableHeader columnKey="code" title="Voucher Code" onSort={onSort} sortConfig={sortConfig} />
            <SortableHeader columnKey="status" title="Status" onSort={onSort} sortConfig={sortConfig} />
            <SortableHeader columnKey="batch" title="Batch" onSort={onSort} sortConfig={sortConfig} />
            <SortableHeader columnKey="validity" title="Validity" onSort={onSort} sortConfig={sortConfig} />
            <SortableHeader columnKey="speedLimit" title="Speed Limit" onSort={onSort} sortConfig={sortConfig} />
            <SortableHeader columnKey="deviceLimit" title="Devices" onSort={onSort} sortConfig={sortConfig} />
            <SortableHeader columnKey="createdAt" title="Created At" onSort={onSort} sortConfig={sortConfig} />
            <SortableHeader columnKey="expiresAt" title="Expires At" onSort={onSort} sortConfig={sortConfig} />
            <th scope="col" className="px-6 py-3 uppercase">Actions</th>
          </tr>
        </thead>
        <tbody>
          {vouchers.map((voucher) => {
            const expiring = isExpiringSoon(voucher);
            return (
              <tr key={voucher.id} className={`border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 ${expiring ? 'bg-yellow-50 dark:bg-yellow-900/20' : 'bg-white dark:bg-gray-800'}`}>
                <td className="w-4 p-4">
                  <div className="flex items-center">
                    <input 
                      id={`checkbox-${voucher.id}`}
                      type="checkbox"
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                      checked={selectedVouchers.includes(voucher.id)}
                      onChange={(e) => onSelectOne(voucher.id, e.target.checked)}
                    />
                    <label htmlFor={`checkbox-${voucher.id}`} className="sr-only">checkbox</label>
                  </div>
                </td>
                <th scope="row" className="px-6 py-4 font-mono font-medium text-gray-900 whitespace-nowrap dark:text-white">
                  {voucher.code}
                </th>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusColorMap[voucher.status]}`}>
                    {voucher.status}
                  </span>
                </td>
                <td className="px-6 py-4">{voucher.batch || 'N/A'}</td>
                <td className="px-6 py-4">{voucher.validity}</td>
                <td className="px-6 py-4">{voucher.speedLimit}</td>
                <td className="px-6 py-4">{voucher.deviceLimit || 1}</td>
                <td className="px-6 py-4">{new Date(voucher.createdAt).toLocaleDateString()}</td>
                <td className="px-6 py-4">{new Date(voucher.expiresAt).toLocaleDateString()}</td>
                <td className="px-6 py-4">
                    <button onClick={() => onShowQrCode(voucher.code)} className="text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-500">
                        <QrCodeIcon className="w-5 h-5" />
                    </button>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  );
};

export default VoucherTable;