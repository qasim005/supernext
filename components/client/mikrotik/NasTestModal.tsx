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
        // Start the real connection test
        performRealConnectionTest();
    }, [device]);

    const performRealConnectionTest = async () => {
        setLogs([`Starting connection test for ${device.name}...`]);
        
        try {
            // Step 1: Connecting message
            setTimeout(() => {
                setLogs(prev => [...prev, `> Connecting to ${device.ipAddress}:${device.apiPort}...`]);
            }, 500);

            // Step 2: Make actual API call to backend
            setTimeout(async () => {
                try {
                    const response = await fetch(`${import.meta.env.VITE_BASE_URL}/api/mikrotik/test`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            ipAddress: device.ipAddress,
                            username: device.username,
                            password: device.sharedSecret, // Using sharedSecret as password
                            apiPort: device.apiPort
                        })
                    });

                    const result = await response.json();

                    if (result.success) {
                        // Success path
                        setLogs(prev => [...prev, 
                            `  ✓ API connection established.`,
                            `  ✓ Authentication successful.`,
                            `  ✓ RouterOS version: ${result.data[0]?.version || 'N/A'}`,
                            `  ✓ Uptime: ${result.data[0]?.uptime || 'N/A'}`,
                            `  ✓ CPU Load: ${result.data[0]?.['cpu-load'] || 'N/A'}%`,
                            ``,
                            `✅ Test complete: Connection successful!`
                        ]);
                        setWasSuccessful(true);
                    } else {
                        // Failure path
                        setLogs(prev => [...prev,
                            `  ❌ Connection failed: ${result.error}`,
                            ``,
                            `❌ Test complete: Connection failed.`
                        ]);
                        setWasSuccessful(false);
                    }
                } catch (error) {
                    // Network error
                    setLogs(prev => [...prev,
                        `  ❌ Network error: ${error.message}`,
                        ``,
                        `❌ Test complete: Connection failed.`
                    ]);
                    setWasSuccessful(false);
                }
                
                setIsComplete(true);
            }, 1500);

        } catch (error) {
            setLogs(prev => [...prev, `❌ Test failed: ${error.message}`]);
            setWasSuccessful(false);
            setIsComplete(true);
        }
    };

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
        if (log.includes('✓') || log.includes('✅')) return 'text-green-400';
        if (log.includes('❌') || log.includes('failed') || log.includes('Error')) return 'text-red-400';
        if (log.includes('>')) return 'text-blue-400';
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
                    {!isComplete && <div className="w-2 h-4 bg-gray-300 animate-pulse inline-block">_</div>}
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