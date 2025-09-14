import React, { useState } from 'react';
import GenerateVoucherModal from './GenerateVoucherModal';
import { ArchiveIcon, PauseIcon, PlayIcon, PrintIcon, FileDownIcon, WifiIcon } from '../icons/IconComponents';
import { GenerateVoucherOptions } from '../../hooks/useVouchers';

interface VoucherActionsProps {
  onGenerate: (options: GenerateVoucherOptions) => void;
  onDelete?: () => void;
  onSuspend?: () => void;
  onActivate?: () => void;
  onArchive?: () => void;
  onPrint?: () => void;
  onExport?: () => void;
  onSimulate?: () => void;
  hasSelection: boolean;
  selectionCount: number;
  loading: boolean;
}

const VoucherActions: React.FC<VoucherActionsProps> = ({ 
    onGenerate, onDelete, onSuspend, onActivate, onArchive, onPrint, onExport, onSimulate, hasSelection, selectionCount, loading 
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const ActionButton: React.FC<{
    onClick?: () => void, 
    icon: React.ReactNode, 
    text: string, 
    primary?: boolean,
    enabled?: boolean
  }> = ({onClick, icon, text, primary, enabled}) => (
    <button
        onClick={onClick}
        disabled={!enabled || loading}
        className={`w-full md:w-auto flex items-center justify-center py-2 px-4 text-sm font-medium focus:outline-none rounded-lg border focus:z-10 focus:ring-4 disabled:opacity-50 disabled:cursor-not-allowed ${
            primary 
            ? 'text-white bg-blue-600 hover:bg-blue-700 focus:ring-blue-300 dark:bg-blue-500 dark:hover:bg-blue-600 dark:focus:ring-blue-800 border-transparent'
            : 'text-gray-900 bg-white border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700'
        }`}
    >
        {icon}
        {text}
    </button>
  );

  return (
    <div className="flex flex-col md:flex-row items-center justify-between space-y-3 md:space-y-0 md:space-x-4 p-4">
        <div className="w-full md:w-auto flex flex-col md:flex-row space-y-2 md:space-y-0 items-stretch md:items-center justify-end md:space-x-3 flex-shrink-0">
            <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                className="flex items-center justify-center text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-500 dark:hover:bg-blue-600 focus:outline-none dark:focus:ring-blue-800"
            >
                <svg className="h-3.5 w-3.5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                    <path clipRule="evenodd" fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" />
                </svg>
                Generate Vouchers
            </button>
            <div className="flex items-center space-x-3 w-full md:w-auto">
                {onActivate && <ActionButton onClick={onActivate} icon={<PlayIcon className="h-4 w-4 mr-2" />} text="Activate" enabled={hasSelection} />}
                {onSuspend && <ActionButton onClick={onSuspend} icon={<PauseIcon className="h-4 w-4 mr-2" />} text="Suspend" enabled={hasSelection} />}
                {onArchive && <ActionButton onClick={onArchive} icon={<ArchiveIcon className="h-4 w-4 mr-2" />} text="Archive" enabled={hasSelection} />}
                {onPrint && <ActionButton onClick={onPrint} icon={<PrintIcon className="h-4 w-4 mr-2" />} text="Print" enabled={hasSelection} />}
                {onExport && <ActionButton onClick={onExport} icon={<FileDownIcon className="h-4 w-4 mr-2" />} text="Export CSV" enabled={true} />}
                {onDelete && <ActionButton onClick={onDelete} text={'Delete Selected'} icon={<></>} enabled={hasSelection} />}
                {onSimulate && <ActionButton onClick={onSimulate} icon={<WifiIcon className="h-4 w-4 mr-2" />} text="Simulate Connection" enabled={selectionCount === 1} />}
            </div>
        </div>
        <GenerateVoucherModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onGenerate={onGenerate}
            loading={loading}
        />
    </div>
  );
};

export default VoucherActions;