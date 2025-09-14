import React, { useEffect, useRef } from 'react';
import { Service } from '../../types';

interface ServiceLogModalProps {
    service: Service;
    logs: string[];
    onClose: () => void;
}

const ServiceLogModal: React.FC<ServiceLogModalProps> = ({ service, logs, onClose }) => {
    const logContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (logContainerRef.current) {
            logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
        }
    }, [logs]);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60" onClick={onClose}>
            <div className="bg-gray-800 text-gray-200 rounded-lg shadow-xl w-full max-w-4xl h-[80vh] flex flex-col m-4" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center p-4 border-b border-gray-700">
                    <h3 className="text-lg font-semibold">Live Logs: {service.name}</h3>
                    <button type="button" onClick={onClose} className="text-gray-400 bg-transparent hover:bg-gray-600 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
                    </button>
                </div>
                <div ref={logContainerRef} className="p-4 font-mono text-xs overflow-y-auto flex-grow bg-black">
                    {logs.map((log, index) => (
                        <div key={index} className="whitespace-pre-wrap">{log}</div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ServiceLogModal;
