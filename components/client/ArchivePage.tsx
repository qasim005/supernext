import React, { useState, useMemo } from 'react';
import { useVouchers } from '../../hooks/useVouchers';
import VoucherTable from '../vouchers/VoucherTable';
import Pagination from '../vouchers/Pagination';
import QRCodeModal from '../vouchers/QRCodeModal';
// Fix: Import Voucher type to be used for sorting configuration.
import { Voucher, VoucherStatus } from '../../types';

const ITEMS_PER_PAGE = 50;

const ArchivePage: React.FC = () => {
  const { vouchers } = useVouchers();
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedVouchers, setSelectedVouchers] = useState<string[]>([]);
  const [qrCodeValue, setQrCodeValue] = useState<string | null>(null);
  // Fix: Add state for sorting configuration.
  const [sortConfig, setSortConfig] = useState<{ key: keyof Voucher; direction: 'ascending' | 'descending' }>({ key: 'createdAt', direction: 'descending' });

  // Fix: Add handler for sorting requests from the table header.
  const requestSort = (key: keyof Voucher) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
    setCurrentPage(1); // Reset to first page on sort
  };

  const archivedVouchers = useMemo(() => {
    let filteredVouchers = vouchers.filter(v => v.status === VoucherStatus.Archived);

    // Fix: Add sorting logic for archived vouchers.
    if (sortConfig !== null) {
      filteredVouchers.sort((a, b) => {
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
    
    return filteredVouchers;
  }, [vouchers, sortConfig]);

  const paginatedVouchers = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return archivedVouchers.slice(startIndex, endIndex);
  }, [archivedVouchers, currentPage]);

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

  return (
    <div className="space-y-6">
       <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 md:p-6">
        <p className="text-gray-600 dark:text-gray-400 p-4">
            This section contains all vouchers that have been archived. You can view their details, but they cannot be activated or modified.
        </p>
        {/* Fix: Pass onSort and sortConfig props to VoucherTable to enable sorting. */}
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
          totalItems={archivedVouchers.length}
          itemsPerPage={ITEMS_PER_PAGE}
          onPageChange={setCurrentPage}
        />
      </div>
      {qrCodeValue && <QRCodeModal voucherCode={qrCodeValue} onClose={() => setQrCodeValue(null)} />}
    </div>
  );
};

export default ArchivePage;