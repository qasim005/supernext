import React, { useState, useEffect, useRef } from 'react';
import { MikrotikDevice } from '../MikrotikPage';

interface NasTestModalProps {
    device: MikrotikDevice;
    onClose: () => void;
    onComplete: (success: boolean) => void;
}

const NasTestModal: React.FC<NasTestModalProps> = ({ device, onClose, onComplete }) => {
    const [logs, setLogs] = useState<string[]>([]);
    const [isComplete, setIsComplete] = useState(false);
    const [wasSuccessful, setWasSuccessful] = useState(false);
    const logContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const testSteps = [
            { message: `Starting connection test for ${device.name}...`, delay: 500 },
            { message: `> Pinging ${device.ipAddress}...`, delay: 1000 },
            { message: `  Ping successful. Latency: 12ms.`, delay: 500, success: true },
            { message: `> Attempting to connect to API on port ${device.apiPort}...`, delay: 1000 },
            { message: `  API connection established.`, delay: 500, success: true },
            { message: `> Authenticating with username '${device.username}'...`, delay: 1000 },
            { message: `  Authentication successful. RouterOS version 7.1.`, delay: 500, success: true },
            { message: `\nTest complete: Connection successful.`, delay: 500, final: true, success: true },
        ];
        
        const failureSteps = [
             { message: `Starting connection test for ${device.name}...`, delay: 500 },
            { message: `> Pinging ${device.ipAddress}...`, delay: 1000 },
            { message: `  Ping successful. Latency: 12ms.`, delay: 500, success: true },
            { message: `> Attempting to connect to API on port ${device.apiPort}...`, delay: 1000 },
            { message: `  Error: Connection timed out.`, delay: 500, success: false },
            { message: `\nTest complete: Connection failed. Please check IP, port, and firewall settings.`, delay: 500, final: true, success: false },
        ]

        // 80% chance of success for demo purposes
        const stepsToRun = Math.random() < 0.8 ? testSteps : failureSteps;
        let delay = 0;

        stepsToRun.forEach(step => {
            delay += step.delay;
            setTimeout(() => {
                setLogs(prev => [...prev, step.message]);
                if (step.final) {
                    setIsComplete(true);
                    setWasSuccessful(step.success);
                }
            }, delay);
        });

    }, [device]);

    useEffect(() => {
        if (logContainerRef.current) {
            logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
        }
    }, [logs]);

    const handleClose = () => {
        if (isComplete) {
            onComplete(wasSuccessful);
        } else {
            onClose(); // Test was aborted
        }
    };
    
    const getLogColor = (log: string): string => {
        if (log.includes('successful') || log.includes('established')) return 'text-green-400';
        if (log.includes('failed') || log.includes('Error')) return 'text-red-400';
        return 'text-gray-300';
    }


    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60" onClick={handleClose}>
            <div className="bg-gray-800 text-gray-200 rounded-lg shadow-xl w-full max-w-2xl flex flex-col m-4" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center p-4 border-b border-gray-700">
                    <h3 className="text-lg font-semibold">Testing Connection: {device.name}</h3>
                    <button type="button" onClick={handleClose} className="text-gray-400 bg-transparent hover:bg-gray-600 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center">
                       &times;
                    </button>
                </div>
                <div ref={logContainerRef} className="p-4 font-mono text-sm h-72 overflow-y-auto bg-black/50">
                    {logs.map((log, index) => (
                        <div key={index} className={`whitespace-pre-wrap ${getLogColor(log)}`}>{log}</div>
                    ))}
                    {!isComplete && <div className="w-2 h-4 bg-gray-300 animate-pulse"></div>}
                </div>
                 <div className="p-4 border-t border-gray-700 flex justify-end">
                    <button
                        onClick={handleClose}
                        disabled={!isComplete}
                        className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-wait"
                    >
                        {isComplete ? 'Close' : 'Testing...'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default NasTestModal;