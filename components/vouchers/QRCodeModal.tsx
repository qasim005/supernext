import React from 'react';

interface QRCodeModalProps {
  voucherCode: string;
  onClose: () => void;
}

const QRCodeModal: React.FC<QRCodeModalProps> = ({ voucherCode, onClose }) => {
  const loginUrl = `https://superlink-hotspot.login/redeem?voucher=${voucherCode}`;
  const qrCodeImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=256x256&data=${encodeURIComponent(loginUrl)}`;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-lg shadow-xl dark:bg-gray-800 w-full max-w-xs m-4 p-6 text-center"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Scan to Connect</h3>
          <button type="button" onClick={onClose} className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
          </button>
        </div>
        <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
            <img src={qrCodeImageUrl} alt={`QR Code for voucher ${voucherCode}`} className="mx-auto" />
        </div>
        <p className="mt-4 font-mono text-lg text-gray-800 dark:text-gray-200 break-all">{voucherCode}</p>
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Point your camera at the QR code to log in automatically.</p>
      </div>
    </div>
  );
};

export default QRCodeModal;