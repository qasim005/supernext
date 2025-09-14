import React, { useState, useMemo } from 'react';
import { useVouchers, GenerateVoucherOptions } from '../../hooks/useVouchers';
import StatCard from '../dashboard/StatCard';
import VoucherTable from '../vouchers/VoucherTable';
import Pagination from '../vouchers/Pagination';
import VoucherActions from '../vouchers/VoucherActions';
import { TicketIcon, UsersIcon, AlertTriangleIcon, PauseIcon } from '../icons/IconComponents';
import QRCodeModal from '../vouchers/QRCodeModal';
import { Voucher, VoucherStatus } from '../../types';
import PrintVouchers from './PrintVouchers';
import { useNotificationsContext } from '../../context/NotificationsContext';
import { NotificationType } from '../../types';

const ITEMS_PER_PAGE = 500;

interface ClientVoucherManagementProps {
  onStartSimulation: (voucherCode: string) => void;
}

const ClientVoucherManagement: React.FC<ClientVoucherManagementProps> = ({ onStartSimulation }) => {
  const { vouchers, stats, loading, generateVouchers: originalGenerateVouchers, suspendVouchers, activateVouchers, archiveVouchers } = useVouchers();
  const { addNotification } = useNotificationsContext();
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedVouchers, setSelectedVouchers] = useState<string[]>([]);
  const [qrCodeValue, setQrCodeValue] = useState<string | null>(null);
  const [isPrinting, setIsPrinting] = useState(false);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<VoucherStatus | 'all'>('all');
  const [dateRange, setDateRange] = useState<{ start: string; end: string }>({ start: '', end: '' });
  const [sortConfig, setSortConfig] = useState<{ key: keyof Voucher; direction: 'ascending' | 'descending' }>({ key: 'createdAt', direction: 'descending' });

  const processedVouchers = useMemo(() => {
    let filteredData = vouchers
      .filter(v => v.status !== VoucherStatus.Archived)
      .filter(v => statusFilter === 'all' || v.status === statusFilter)
      .filter(v => {
        if (!dateRange.start || !dateRange.end) return true;
        const voucherDate = new Date(v.createdAt);
        const startDate = new Date(dateRange.start);
        const endDate = new Date(dateRange.end);
        startDate.setHours(0, 0, 0, 0);
        endDate.setHours(23, 59, 59, 999);
        return voucherDate >= startDate && voucherDate <= endDate;
      })
      .filter(v => {
          if (searchQuery.trim() === '') return true;
          const lowerCaseQuery = searchQuery.toLowerCase();
          return (
            v.code.toLowerCase().includes(lowerCaseQuery) ||
            (v.batch && v.batch.toLowerCase().includes(lowerCaseQuery))
          );
        });

    if (sortConfig !== null) {
      filteredData.sort((a, b) => {
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

    return filteredData;

  }, [vouchers, statusFilter, dateRange, searchQuery, sortConfig]);

  const paginatedVouchers = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return processedVouchers.slice(startIndex, endIndex);
  }, [processedVouchers, currentPage]);
  
  const vouchersForPrinting = useMemo(() => {
    return vouchers.filter(v => selectedVouchers.includes(v.id));
  }, [selectedVouchers, vouchers]);

  const generateVouchers = (options: GenerateVoucherOptions) => {
    originalGenerateVouchers(options);
    addNotification({
        type: NotificationType.Voucher,
        title: 'Vouchers Generated',
        message: `Successfully created ${options.count} vouchers for batch "${options.batch}".`
    });
  };

  const requestSort = (key: keyof Voucher) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
    setCurrentPage(1); // Reset to first page on sort
  };

  if (isPrinting) {
      return <PrintVouchers vouchers={vouchersForPrinting} onCancel={() => setIsPrinting(false)} />
  }

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

  const handleDateChange = (field: 'start' | 'end', value: string) => {
    const today = new Date().toISOString().split('T')[0];

    setDateRange(prev => {
        if (field === 'start') {
            const newStartDate = value;
            return {
                start: newStartDate,
                // If end date is empty and start date is being set, default end date to today.
                end: prev.end === '' && newStartDate !== '' ? today : prev.end,
            };
        } else { // field === 'end'
            const newEndDate = value;
            return {
                // If start date is empty and end date is being set, default start date to the selected end date.
                start: prev.start === '' && newEndDate !== '' ? newEndDate : prev.start,
                end: newEndDate,
            };
        }
    });
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setStatusFilter('all');
    setDateRange({ start: '', end: '' });
  };
  
  const handleExportCSV = () => {
    if (processedVouchers.length === 0) {
      addNotification({
        type: NotificationType.Voucher,
        title: 'Export Failed',
        message: 'No vouchers to export in the current view.'
      });
      return;
    }

    const headers = ["Code", "Status", "Batch", "Validity", "Speed Limit", "Device Limit", "Created At", "Expires At"];
    const rows = processedVouchers.map(v => [
      v.code, v.status, v.batch || 'N/A', v.validity, v.speedLimit, v.deviceLimit || 1, v.createdAt.toISOString(), v.expiresAt.toISOString()
    ]);

    const csvContent = [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.href) {
      URL.revokeObjectURL(link.href);
    }
    link.href = URL.createObjectURL(blob);
    link.download = `vouchers-export-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    addNotification({
      type: NotificationType.Voucher,
      title: 'Export Successful',
      message: `Exported ${processedVouchers.length} vouchers.`
    });
  };

  const handleSimulation = () => {
    if (selectedVouchers.length === 1) {
      const voucherToSimulate = vouchers.find(v => v.id === selectedVouchers[0]);
      if (voucherToSimulate) {
        onStartSimulation(voucherToSimulate.code);
      }
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
        <StatCard title="Total Vouchers" value={stats.total} icon={<TicketIcon />} colorClass="bg-blue-500" />
        <StatCard title="Active Vouchers" value={stats.active} icon={<UsersIcon />} colorClass="bg-green-500" />
        <StatCard title="Suspended" value={stats.suspended} icon={<PauseIcon />} colorClass="bg-yellow-500" />
        <StatCard title="Expiring Soon" value={stats.expiringSoon} icon={<AlertTriangleIcon />} colorClass="bg-orange-500" />
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
                    {Object.values(VoucherStatus).filter(s => s !== VoucherStatus.Archived).map(status => (
                        <option key={status} value={status}>{status}</option>
                    ))}
                </select>
            </div>
            <div className="w-full md:w-auto md:flex-[2]">
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Filter by Creation Date</label>
                <div className="flex items-center gap-2">
                    <input type="date" value={dateRange.start} onChange={(e) => handleDateChange('start', e.target.value)} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white" />
                    <span className="text-gray-500 dark:text-gray-400">to</span>
                    <input type="date" value={dateRange.end} onChange={(e) => handleDateChange('end', e.target.value)} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white" />
                </div>
            </div>
            <div>
                 <button 
                    onClick={handleClearFilters}
                    className="w-full md:w-auto px-4 py-2.5 text-sm font-medium text-gray-900 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
                >
                    Clear Filters
                </button>
            </div>
        </div>

        <VoucherActions 
            onGenerate={generateVouchers} 
            onSuspend={() => handleAction(suspendVouchers, 'suspended')}
            onActivate={() => handleAction(activateVouchers, 'activated')}
            onArchive={() => handleAction(archiveVouchers, 'archived')}
            onPrint={() => setIsPrinting(true)}
            onExport={handleExportCSV}
            onSimulate={handleSimulation}
            hasSelection={selectedVouchers.length > 0}
            selectionCount={selectedVouchers.length}
            loading={loading}
        />
        <VoucherTable
          vouchers={paginatedVouchers}
          selectedVouchers={selectedVouchers}
          onSelectAll={handleSelectAll}
          onSelectOne={handleSelectOne}
          onShowQrCode={setQrCodeValue}
          onSort={requestSort}
          sortConfig={sortConfig}
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

export default ClientVoucherManagement;