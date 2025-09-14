import React from 'react';
import { Voucher } from '../../types';
import { PrintIcon } from '../icons/IconComponents';

const VoucherCard: React.FC<{ voucher: Voucher }> = ({ voucher }) => {
    const loginUrl = `https://superlink-hotspot.login/redeem?voucher=${voucher.code}`;
    const qrCodeImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(loginUrl)}`;
    
    return (
        <div className="p-4 border border-gray-300 rounded-lg shadow-sm break-inside-avoid flex flex-col items-center text-center bg-white">
            <h4 className="font-bold text-lg text-gray-800">SuperLink Hotspot</h4>
            <img src={qrCodeImageUrl} alt={`QR Code for ${voucher.code}`} className="my-2" />
            <p className="font-mono text-xl font-semibold tracking-widest text-gray-900">{voucher.code}</p>
            <div className="text-xs text-gray-600 mt-2">
                <span>Speed: {voucher.speedLimit}</span> | <span>Devices: {voucher.deviceLimit}</span>
                <p>Validity: {voucher.validity}</p>
            </div>
        </div>
    );
};

interface PrintVouchersProps {
  vouchers: Voucher[];
  onCancel: () => void;
}

const PrintVouchers: React.FC<PrintVouchersProps> = ({ vouchers, onCancel }) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <>
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .print-container, .print-container * {
            visibility: visible;
          }
          .print-container {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
          .no-print {
            display: none;
          }
        }
      `}</style>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-6 no-print">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Print Vouchers ({vouchers.length})</h2>
          <div className="flex gap-4">
            <button
              onClick={onCancel}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600"
            >
              Cancel
            </button>
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700"
            >
              <PrintIcon className="w-5 h-5" />
              Print Now
            </button>
          </div>
        </div>
        <div className="print-container">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {vouchers.map(voucher => (
                <VoucherCard key={voucher.id} voucher={voucher} />
            ))}
            </div>
        </div>
      </div>
    </>
  );
};

export default PrintVouchers;