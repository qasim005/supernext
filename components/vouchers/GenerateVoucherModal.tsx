import React, { useState } from 'react';
import { GenerateVoucherOptions } from '../../hooks/useVouchers';

interface GenerateVoucherModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGenerate: (options: GenerateVoucherOptions) => void;
  loading: boolean;
}

const GenerateVoucherModal: React.FC<GenerateVoucherModalProps> = ({ isOpen, onClose, onGenerate, loading }) => {
  const [count, setCount] = useState(10);
  const [validityOption, setValidityOption] = useState('7d');
  const [customValidity, setCustomValidity] = useState(1);
  const [speedLimit, setSpeedLimit] = useState('5 Mbps');
  const [deviceLimit, setDeviceLimit] = useState(1);
  const [batch, setBatch] = useState(`Batch-${new Date().toISOString().slice(0, 10)}`);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Convert validity to expiration date
    let days = 7;
    if (validityOption === 'custom') {
      days = customValidity;
    } else {
      days = parseInt(validityOption.replace('d', ''));
    }
    const now = new Date();
    const expirationDate = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);
    const expiration = expirationDate.toISOString().slice(0, 10); // 'YYYY-MM-DD'
    onGenerate({ count, expiration, speedLimit, deviceLimit, batch });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl dark:bg-gray-800 w-full max-w-lg m-4">
        <div className="flex justify-between items-center p-4 border-b dark:border-gray-600">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Generate New Vouchers</h3>
          <button type="button" onClick={onClose} className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Column 1 */}
            <div className="space-y-4">
              <div>
                <label htmlFor="voucher-count" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Number of Vouchers</label>
                <input type="number" id="voucher-count" value={count} onChange={(e) => setCount(parseInt(e.target.value))} min="1" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white" required />
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Validity</label>
                <div className="flex flex-wrap gap-2">
                  {['7d', '15d', '30d', 'custom'].map(val => (
                    <button type="button" key={val} onClick={() => setValidityOption(val)} className={`px-3 py-1.5 text-sm rounded-md ${validityOption === val ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}>
                      {val === '7d' ? '7 Days' : val === '15d' ? '15 Days' : val === '30d' ? '1 Month' : 'Custom'}
                    </button>
                  ))}
                </div>
                {validityOption === 'custom' && (
                  <div className="mt-2">
                    <input type="number" placeholder="Days" value={customValidity} onChange={e => setCustomValidity(parseInt(e.target.value))} min="1" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600" required />
                  </div>
                )}
              </div>
              <div>
                <label htmlFor="batch" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Batch Name</label>
                <input type="text" id="batch" value={batch} onChange={(e) => setBatch(e.target.value)} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white" />
              </div>
            </div>
            {/* Column 2 */}
            <div className="space-y-4">
              <div>
                <label htmlFor="speed-limit" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Speed Limit</label>
                <select id="speed-limit" value={speedLimit} onChange={e => setSpeedLimit(e.target.value)} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600">
                  <option>Unlimited</option>
                  <option>5 Mbps</option>
                  <option>10 Mbps</option>
                  <option>15 Mbps</option>
                  <option>20 Mbps</option>
                </select>
              </div>
              <div>
                <label htmlFor="device-limit" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Number of Devices</label>
                <select id="device-limit" value={deviceLimit} onChange={e => setDeviceLimit(parseInt(e.target.value))} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600">
                  <option value="1">1</option>
                  <option value="5">5</option>
                  <option value="10">10</option>
                </select>
              </div>
            </div>
          </div>
          <div className="flex items-center p-6 space-x-2 border-t border-gray-200 rounded-b dark:border-gray-600">
            <button type="submit" disabled={loading} className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 disabled:opacity-50">
              {loading ? 'Generating...' : 'Generate'}
            </button>
            <button onClick={onClose} type="button" className="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default GenerateVoucherModal;