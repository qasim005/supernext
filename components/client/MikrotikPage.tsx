import React, { useState } from 'react';
import NasTestModal from './NasTestModal';

type ConnectionStatus = 'Connected' | 'Disconnected' | 'Testing';

export interface MikrotikDevice {
  id: number;
  name: string;
  ipAddress: string;
  username: string;
  apiPort: string;
  sharedSecret: string;
  status: ConnectionStatus;
}

const AddNasModal: React.FC<{
    onClose: () => void;
    onAdd: (device: Omit<MikrotikDevice, 'id' | 'status'>) => void;
    device?: MikrotikDevice;
}> = ({ onClose, onAdd, device }) => {
    const [name, setName] = useState(device?.name || '');
    const [ipAddress, setIpAddress] = useState(device?.ipAddress || '');
    const [username, setUsername] = useState(device?.username || 'admin');
    const [apiPort, setApiPort] = useState(device?.apiPort || '8728');
    const [sharedSecret, setSharedSecret] = useState(device?.sharedSecret || '');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onAdd({ name, ipAddress, username, apiPort, sharedSecret });
        onClose();
    };

    return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl dark:bg-gray-800 w-full max-w-lg m-4">
        <div className="flex justify-between items-center p-4 border-b dark:border-gray-600">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{device ? 'Edit' : 'Add New'} MikroTik Router</h3>
          <button type="button" onClick={onClose} className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label htmlFor="nas-name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Device Name</label>
              <input type="text" id="nas-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g., Main Cafe Router" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white" required />
            </div>
            <div>
              <label htmlFor="ip-address" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">IP Address / Hostname</label>
              <input type="text" id="ip-address" value={ipAddress} onChange={(e) => setIpAddress(e.target.value)} placeholder="e.g., 192.168.88.1" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white" required />
            </div>
            <div>
              <label htmlFor="username" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Username</label>
              <input type="text" id="username" value={username} onChange={(e) => setUsername(e.target.value)} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600" required />
            </div>
            <div>
              <label htmlFor="api-port" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">API Port</label>
              <input type="text" id="api-port" value={apiPort} onChange={(e) => setApiPort(e.target.value)} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600" required />
            </div>
             <div>
              <label htmlFor="shared-secret" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Shared Secret</label>
              <input type="password" id="shared-secret" value={sharedSecret} onChange={(e) => setSharedSecret(e.target.value)} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600" />
            </div>
          </div>
          <div className="flex items-center p-6 space-x-2 border-t border-gray-200 rounded-b dark:border-gray-600">
            <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
              {device ? 'Save Changes' : 'Add Device'}
            </button>
            <button onClick={onClose} type="button" className="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600">Cancel</button>
          </div>
        </form>
      </div>
    </div>
    );
}

const statusIndicator: Record<ConnectionStatus, { text: string; dot: string; }> = {
    'Connected': { text: 'text-green-500', dot: 'bg-green-500' },
    'Disconnected': { text: 'text-red-500', dot: 'bg-red-500' },
    'Testing': { text: 'text-yellow-500', dot: 'bg-yellow-500 animate-pulse' },
};

const MikrotikPage: React.FC = () => {
    const [devices, setDevices] = useState<MikrotikDevice[]>([
        { id: 1, name: 'Main Lobby Router', ipAddress: '192.168.1.1', username: 'admin', apiPort: '8728', sharedSecret: 'secret123', status: 'Connected' },
        { id: 2, name: 'Cafe AP', ipAddress: '192.168.1.5', username: 'api-user', apiPort: '8728', sharedSecret: 'secret123', status: 'Connected' },
        { id: 3, name: 'Warehouse AP', ipAddress: '10.0.5.1', username: 'admin', apiPort: '8728', sharedSecret: 'secret123', status: 'Disconnected' },
    ]);
    const [editingDevice, setEditingDevice] = useState<MikrotikDevice | undefined>(undefined);
    const [isAddEditModalOpen, setAddEditModalOpen] = useState(false);
    const [isTestModalOpen, setIsTestModalOpen] = useState(false);
    const [testingDevice, setTestingDevice] = useState<MikrotikDevice | null>(null);

    const handleAddOrUpdateDevice = (deviceData: Omit<MikrotikDevice, 'id' | 'status'>) => {
        if(editingDevice) {
            setDevices(prev => prev.map(d => d.id === editingDevice.id ? {...editingDevice, ...deviceData} : d));
        } else {
            const newDevice: MikrotikDevice = {
                ...deviceData,
                id: devices.length > 0 ? Math.max(...devices.map(d => d.id)) + 1 : 1,
                status: 'Disconnected'
            };
            setDevices(prev => [...prev, newDevice]);
        }
    }

    const openAddModal = () => {
        setEditingDevice(undefined);
        setAddEditModalOpen(true);
    }
    
    const openEditModal = (device: MikrotikDevice) => {
        setEditingDevice(device);
        setAddEditModalOpen(true);
    }

    const handleDelete = (id: number) => {
        setDevices(prev => prev.filter(d => d.id !== id));
    }
    
    const handleTestConnection = (device: MikrotikDevice) => {
        setTestingDevice(device);
        setIsTestModalOpen(true);
        setDevices(prev => prev.map(d => d.id === device.id ? { ...d, status: 'Testing' } : d));
    };

    const handleTestComplete = (deviceId: number, success: boolean) => {
        setIsTestModalOpen(false);
        setTestingDevice(null);
        setDevices(prev => prev.map(d => {
            if (d.id === deviceId) {
                return { ...d, status: success ? 'Connected' : 'Disconnected' };
            }
            return d;
        }));
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 md:p-6">
            <div className="flex flex-col md:flex-row items-center justify-between space-y-3 md:space-y-0 md:space-x-4 p-4">
                <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Your MikroTik Devices</h2>
                <button
                    type="button"
                    onClick={openAddModal}
                    className="flex items-center justify-center text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-500 dark:hover:bg-blue-600 focus:outline-none dark:focus:ring-blue-800"
                >
                    <svg className="h-3.5 w-3.5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                        <path clipRule="evenodd" fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" />
                    </svg>
                    Add Router
                </button>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            <th scope="col" className="px-6 py-3">Device Name</th>
                            <th scope="col" className="px-6 py-3">IP Address</th>
                            <th scope="col" className="px-6 py-3">Status</th>
                            <th scope="col" className="px-6 py-3">Username</th>
                            <th scope="col" className="px-6 py-3">API Port</th>
                            <th scope="col" className="px-6 py-3 text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {devices.map((device) => (
                        <tr key={device.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                            <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                {device.name}
                            </th>
                            <td className="px-6 py-4 font-mono">{device.ipAddress}</td>
                             <td className="px-6 py-4">
                                <div className="flex items-center">
                                    <div className={`h-2.5 w-2.5 rounded-full mr-2 ${statusIndicator[device.status].dot}`}></div>
                                    <span className={statusIndicator[device.status].text}>{device.status}</span>
                                </div>
                            </td>
                            <td className="px-6 py-4">{device.username}</td>
                            <td className="px-6 py-4">{device.apiPort}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-center space-x-4">
                                <button onClick={() => handleTestConnection(device)} className="font-medium text-indigo-600 dark:text-indigo-400 hover:underline disabled:opacity-50" disabled={device.status === 'Testing'}>Test</button>
                                <button onClick={() => openEditModal(device)} className="font-medium text-blue-600 dark:text-blue-500 hover:underline">Edit</button>
                                <button onClick={() => handleDelete(device.id)} className="font-medium text-red-600 dark:text-red-500 hover:underline">Delete</button>
                            </td>
                        </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {isAddEditModalOpen && <AddNasModal onClose={() => setAddEditModalOpen(false)} onAdd={handleAddOrUpdateDevice} device={editingDevice} />}
            {isTestModalOpen && testingDevice && (
                <NasTestModal 
                    device={testingDevice}
                    onClose={() => handleTestComplete(testingDevice.id, false)}
                    onComplete={(success) => handleTestComplete(testingDevice.id, success)}
                />
            )}
        </div>
    );
};

export default MikrotikPage;