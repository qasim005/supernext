import React, { useState } from 'react';
import { useServices } from '../../hooks/useServices';
import { Service, ServiceStatus } from '../../types';
import ServiceLogModal from './ServiceLogModal';

const statusColorMap: Record<ServiceStatus, { bg: string; text: string; dot: string }> = {
    [ServiceStatus.Running]: { bg: 'bg-green-100 dark:bg-green-900/50', text: 'text-green-800 dark:text-green-300', dot: 'bg-green-500' },
    [ServiceStatus.Degraded]: { bg: 'bg-yellow-100 dark:bg-yellow-900/50', text: 'text-yellow-800 dark:text-yellow-300', dot: 'bg-yellow-500' },
    [ServiceStatus.Stopped]: { bg: 'bg-red-100 dark:bg-red-900/50', text: 'text-red-800 dark:text-red-300', dot: 'bg-red-500' },
};

const formatUptime = (seconds: number): string => {
    if (seconds < 60) return `${Math.floor(seconds)}s`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h`;
    return `${Math.floor(seconds / 86400)}d`;
};

const ServiceManagement: React.FC = () => {
    const { services, logs, restartService, stopService } = useServices();
    const [selectedService, setSelectedService] = useState<Service | null>(null);

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 md:p-6">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">Core Services Status</h2>
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            <th scope="col" className="px-6 py-3">Service</th>
                            <th scope="col" className="px-6 py-3">Status</th>
                            <th scope="col" className="px-6 py-3">Uptime</th>
                            <th scope="col" className="px-6 py-3">CPU Usage</th>
                            <th scope="col" className="px-6 py-3">Memory Usage</th>
                            <th scope="col" className="px-6 py-3 text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {services.map((service) => (
                            <tr key={service.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                    {service.name}
                                </th>
                                <td className="px-6 py-4">
                                    <div className="flex items-center">
                                        <div className={`h-2.5 w-2.5 rounded-full mr-2 ${statusColorMap[service.status].dot}`}></div>
                                        <span className={`${statusColorMap[service.status].text}`}>{service.status}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4">{formatUptime(service.uptime)}</td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2">
                                        <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                                            <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${service.cpuUsage}%` }}></div>
                                        </div>
                                        <span className="text-xs font-medium">{service.cpuUsage}%</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                     <div className="flex items-center gap-2">
                                        <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                                            <div className="bg-purple-600 h-2.5 rounded-full" style={{ width: `${(service.memoryUsage / service.memoryTotal) * 100}%` }}></div>
                                        </div>
                                        <span className="text-xs font-medium">{service.memoryUsage}MB / {service.memoryTotal}MB</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap space-x-2 text-center">
                                    <button onClick={() => restartService(service.id)} className="font-medium text-blue-600 dark:text-blue-500 hover:underline text-xs">Restart</button>
                                    <button onClick={() => stopService(service.id)} className="font-medium text-red-600 dark:text-red-500 hover:underline text-xs">Stop</button>
                                    <button onClick={() => setSelectedService(service)} className="font-medium text-gray-600 dark:text-gray-400 hover:underline text-xs">Logs</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {selectedService && (
                <ServiceLogModal 
                    service={selectedService} 
                    logs={logs[selectedService.id] || []}
                    onClose={() => setSelectedService(null)} 
                />
            )}
        </div>
    );
};

export default ServiceManagement;
