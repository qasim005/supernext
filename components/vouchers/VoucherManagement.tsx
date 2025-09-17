import React, { useState, useMemo } from 'react';
import { useVouchers, GenerateVoucherOptions } from '../../hooks/useVouchers';
import StatCard from '../dashboard/StatCard';
import VoucherTable from './VoucherTable';
import Pagination from './Pagination';
import VoucherActions from './VoucherActions';
import { TicketIcon, UsersIcon, AlertTriangleIcon } from '../icons/IconComponents';
import QRCodeModal from './QRCodeModal';
import { useNotificationsContext } from '../../context/NotificationsContext';
import { NotificationType, Voucher, VoucherStatus } from '../../types';

const ITEMS_PER_PAGE = 10;

const VoucherManagement: React.FC = () => {
  const { vouchers, stats, loading, generateVouchers: originalGenerateVouchers, deleteVouchers, suspendVouchers, activateVouchers, archiveVouchers, updateVoucherExpiry } = useVouchers();
  const handleUpdateExpiry = async (voucherCode: string, newExpiry: string) => {
    await updateVoucherExpiry(voucherCode, newExpiry);
    addNotification({
      type: NotificationType.Voucher,
      title: 'Voucher Expiry Updated',
      message: `Voucher ${voucherCode} expiry updated to ${newExpiry}.`
    });
  };
  const { addNotification } = useNotificationsContext();
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedVouchers, setSelectedVouchers] = useState<string[]>([]);
  const [qrCodeValue, setQrCodeValue] = useState<string | null>(null);
  const [sortConfig, setSortConfig] = useState<{ key: keyof Voucher; direction: 'ascending' | 'descending' } | null>({ key: 'createdAt', direction: 'descending' });

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<VoucherStatus | 'all'>('all');

  const requestSort = (key: keyof Voucher) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
    setCurrentPage(1); // Reset to first page on sort
  };

  const processedVouchers = useMemo(() => {
    let sortableItems = [...vouchers]
      .filter(v => statusFilter === 'all' || v.status === statusFilter)
      .filter(v => {
        if (searchQuery.trim() === '') return true;
        const lowerCaseQuery = searchQuery.toLowerCase();
        return v.code.toLowerCase().includes(lowerCaseQuery) || (v.batch && v.batch.toLowerCase().includes(lowerCaseQuery));
      });

    if (sortConfig !== null) {
      sortableItems.sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];

        if (aValue === null || aValue === undefined) return 1;
        if (bValue === null || bValue === undefined) return -1;

        let comparison = 0;
        if (aValue instanceof Date && bValue instanceof Date) {
          comparison = aValue.getTime() - bValue.getTime();
        } else if (typeof aValue === 'string' && typeof bValue === 'string') {
          comparison = aValue.localeCompare(bValue, undefined, { numeric: true });
        } else {
          if (aValue < bValue) {
            comparison = -1;
          } else if (aValue > bValue) {
            comparison = 1;
          }
        }

        return sortConfig.direction === 'descending' ? comparison * -1 : comparison;
      });
    }
    return sortableItems;
  }, [vouchers, sortConfig, searchQuery, statusFilter]);

  const paginatedVouchers = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return processedVouchers.slice(startIndex, endIndex);
  }, [processedVouchers, currentPage]);

  const generateVouchers = (options: GenerateVoucherOptions) => {
    originalGenerateVouchers(options);
    addNotification({
      type: NotificationType.Voucher,
      title: 'Vouchers Generated',
      message: `Successfully created ${options.count} vouchers for batch "${options.batch}".`
    });
  };

  const handleSelectAll = (isSelected: boolean) => {
    if (isSelected) {
      setSelectedVouchers(paginatedVouchers.map(v => v.id));
    } else {
      setSelectedVouchers([]);
    }
  };

  const handleSelectOne = (id: string, isSelected: boolean) => {
    if (isSelected) {
      setSelectedVouchers(prev => [...prev, id]);
    } else {
      setSelectedVouchers(prev => prev.filter(vId => vId !== id));
    }
  };

  const handleAction = (action: (ids: string[]) => void, actionName: string) => {
    const count = selectedVouchers.length;
    if (count === 0) return;

    action(selectedVouchers);

    addNotification({
      type: NotificationType.Voucher,
      title: `Vouchers ${actionName.charAt(0).toUpperCase() + actionName.slice(1)}`,
      message: `Successfully ${actionName} ${count} voucher(s).`
    });

    setSelectedVouchers([]);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
        <StatCard title="Total Vouchers" value={stats.total} icon={<TicketIcon />} colorClass="bg-blue-500" />
        <StatCard title="Active Vouchers" value={stats.active} icon={<UsersIcon />} colorClass="bg-green-500" />
        <StatCard title="Pending Vouchers" value={stats.pending} icon={<TicketIcon />} colorClass="bg-orange-500" />
        <StatCard title="Expiring Soon" value={stats.expiringSoon} icon={<AlertTriangleIcon />} colorClass="bg-yellow-500" />
        <StatCard title="Expired Vouchers" value={stats.expired} icon={<TicketIcon />} colorClass="bg-red-500" />
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 md:p-6">
        <div className="p-4 flex flex-col md:flex-row gap-4 items-end">
          <div className="w-full md:w-auto flex-1">
            <label htmlFor="search-filter" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Search by Code/Batch</label>
            <input
              type="text"
              id="search-filter"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Enter code or batch..."
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
            />
          </div>
          <div className="w-full md:w-auto flex-1">
            <label htmlFor="status-filter" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Filter by Status</label>
            <select
              id="status-filter"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as VoucherStatus | 'all')}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
            >
              <option value="all">All Statuses</option>
              {Object.values(VoucherStatus).map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>
        </div>
        <VoucherActions
          onGenerate={generateVouchers}
          onDelete={() => handleAction(deleteVouchers, 'deleted')}
          onSuspend={() => handleAction(suspendVouchers, 'suspended')}
          onActivate={() => handleAction(activateVouchers, 'activated')}
          onArchive={() => handleAction(archiveVouchers, 'archived')}
          hasSelection={selectedVouchers.length > 0}
          loading={loading}
          selectionCount={selectedVouchers.length}
        />
        <VoucherTable
          vouchers={paginatedVouchers}
          selectedVouchers={selectedVouchers}
          onSelectAll={handleSelectAll}
          onSelectOne={handleSelectOne}
          onShowQrCode={setQrCodeValue}
          onSort={requestSort}
          sortConfig={sortConfig}
          onUpdateExpiry={handleUpdateExpiry}
          onDeleteVoucher={async (voucherCode: string) => {
            await deleteVouchers([voucherCode]);
            addNotification({
              type: NotificationType.Voucher,
              title: 'Voucher Deleted',
              message: `Voucher ${voucherCode} deleted successfully.`
            });
          }}
        />
        <Pagination
          currentPage={currentPage}
          totalItems={processedVouchers.length}
          itemsPerPage={ITEMS_PER_PAGE}
          onPageChange={setCurrentPage}
        />
      </div>
      {qrCodeValue && <QRCodeModal voucherCode={qrCodeValue} onClose={() => setQrCodeValue(null)} />}
    </div>
  );
};

export default VoucherManagement;