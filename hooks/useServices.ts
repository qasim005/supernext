import { useState, useEffect, useCallback } from 'react';
import { Service, ServiceStatus } from '../types';

const initialServices: Service[] = [
    { id: 'api_gateway', name: 'API Gateway', status: ServiceStatus.Running, uptime: 3600 * 24 * 7, cpuUsage: 15, memoryUsage: 128, memoryTotal: 512 },
    { id: 'voucher_generator', name: 'Voucher Generator', status: ServiceStatus.Running, uptime: 3600 * 24 * 2, cpuUsage: 5, memoryUsage: 64, memoryTotal: 256 },
    { id: 'auth_service', name: 'Authentication Service', status: ServiceStatus.Running, uptime: 3600 * 24 * 15, cpuUsage: 25, memoryUsage: 256, memoryTotal: 512 },
    { id: 'db_sync', name: 'Database Sync', status: ServiceStatus.Degraded, uptime: 3600 * 6, cpuUsage: 80, memoryUsage: 480, memoryTotal: 1024 },
    { id: 'radius_proxy', name: 'RADIUS Proxy', status: ServiceStatus.Stopped, uptime: 0, cpuUsage: 0, memoryUsage: 0, memoryTotal: 256 },
];

const generateLogMessage = (serviceName: string): string => {
    const timestamp = new Date().toISOString();
    const levels = ['INFO', 'WARN', 'ERROR', 'DEBUG'];
    const messages = [
        'Request processed successfully', 'User authentication failed', 'Cache cleared', 
        'High CPU usage detected', 'Database connection timed out', 'New voucher batch created'
    ];
    const level = levels[Math.floor(Math.random() * levels.length)];
    const message = messages[Math.floor(Math.random() * messages.length)];
    return `${timestamp} [${serviceName}] [${level}] - ${message}`;
};

export const useServices = () => {
    const [services, setServices] = useState<Service[]>(initialServices);
    const [logs, setLogs] = useState<Record<string, string[]>>({});

    useEffect(() => {
        const interval = setInterval(() => {
            setServices(prevServices =>
                prevServices.map(service => {
                    if (service.status === ServiceStatus.Stopped) {
                        return service;
                    }
                    // Simulate fluctuations
                    const cpuChange = Math.random() * 10 - 5;
                    const memChange = Math.random() * 20 - 10;
                    
                    const newCpu = Math.min(100, Math.max(0, service.cpuUsage + cpuChange));
                    const newMem = Math.min(service.memoryTotal, Math.max(0, service.memoryUsage + memChange));

                    let newStatus = service.status;
                    if (newCpu > 90 || newMem / service.memoryTotal > 0.9) {
                        newStatus = ServiceStatus.Degraded;
                    } else if (service.status === ServiceStatus.Degraded && newCpu < 70 && newMem / service.memoryTotal < 0.7) {
                        newStatus = ServiceStatus.Running;
                    }

                    return {
                        ...service,
                        uptime: service.uptime + 2,
                        cpuUsage: parseFloat(newCpu.toFixed(1)),
                        memoryUsage: parseFloat(newMem.toFixed(1)),
                        status: newStatus,
                    };
                })
            );

            // Simulate logs
             setLogs(prevLogs => {
                const newLogs = { ...prevLogs };
                services.forEach(service => {
                    if (service.status !== ServiceStatus.Stopped && Math.random() > 0.5) {
                        if (!newLogs[service.id]) newLogs[service.id] = [];
                        newLogs[service.id].push(generateLogMessage(service.name));
                        // Keep logs to a reasonable size
                        if (newLogs[service.id].length > 100) {
                            newLogs[service.id].shift();
                        }
                    }
                });
                return newLogs;
            });

        }, 2000);

        return () => clearInterval(interval);
    }, [services]);

    const restartService = useCallback((id: string) => {
        setServices(prev =>
            prev.map(s => s.id === id ? { ...s, status: ServiceStatus.Running, uptime: 0, cpuUsage: 10, memoryUsage: 50 } : s)
        );
    }, []);

    const stopService = useCallback((id: string) => {
        setServices(prev =>
            prev.map(s => s.id === id ? { ...s, status: ServiceStatus.Stopped, uptime: 0, cpuUsage: 0, memoryUsage: 0 } : s)
        );
    }, []);

    return { services, logs, restartService, stopService };
};
