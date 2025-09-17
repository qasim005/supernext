import React, { useState, useEffect } from 'react';
import { RouterIcon } from '../icons/IconComponents';
import APConfigModal from './APConfigModal';

interface AccessPoint {
    _id: string;
    name: string;
    macAddress: string;
    externalIP: string;
    identity: string;
    radiusServer: string;
    radiusSecret: string;
    status: 'pending' | 'active' | 'error' | 'inactive';
    hotspotConfigured: boolean;
    createdAt: string;
    updatedAt: string;
}

interface AddAPModalProps {
    onClose: () => void;
    onAdd: (data: { name: string; macAddress: string; externalIP: string }) => void;
    ap?: AccessPoint;
}

const AddAPModal: React.FC<AddAPModalProps> = ({ onClose, onAdd, ap }) => {
    const [name, setName] = useState(ap?.name || '');
    const [macAddress, setMacAddress] = useState(ap?.macAddress || '');
    const [externalIP, setExternalIP] = useState(ap?.externalIP || '');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onAdd({ name, macAddress, externalIP });
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg shadow-xl dark:bg-gray-800 w-full max-w-lg m-4">
                <div className="flex justify-between items-center p-4 border-b dark:border-gray-600">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {ap ? 'Edit' : 'Add New'} MikroTik Access Point
                    </h3>
                    <button type="button" onClick={onClose} className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
                    </button>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="p-6 grid grid-cols-1 gap-4">
                        <div>
                            <label htmlFor="ap-name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Access Point Name</label>
                            <input
                                type="text"
                                id="ap-name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="e.g., Main Lobby AP"
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="mac-address" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">MAC Address</label>
                            <input
                                type="text"
                                id="mac-address"
                                value={macAddress}
                                onChange={(e) => setMacAddress(e.target.value)}
                                placeholder="e.g., 00:0C:42:12:34:56"
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="external-ip" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">External IP Address</label>
                            <input
                                type="text"
                                id="external-ip"
                                value={externalIP}
                                onChange={(e) => setExternalIP(e.target.value)}
                                placeholder="e.g., 203.0.113.1"
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                                required
                            />
                        </div>
                    </div>
                    <div className="flex items-center p-6 space-x-2 border-t border-gray-200 rounded-b dark:border-gray-600">
                        <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                            {ap ? 'Save Changes' : 'Add Access Point'}
                        </button>
                        <button type="button" onClick={onClose} className="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600">
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const MikrotikAPPage: React.FC = () => {
    const [accessPoints, setAccessPoints] = useState<AccessPoint[]>([]);
    const [loading, setLoading] = useState(true);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [editingAP, setEditingAP] = useState<AccessPoint | undefined>(undefined);
    const [error, setError] = useState<string | null>(null);
    const [configModalAP, setConfigModalAP] = useState<{ id: string; name: string } | null>(null);

    // Fetch access points from backend
    const fetchAccessPoints = async () => {
        try {
            setLoading(true);
            const response = await fetch('http://localhost:3000/api/mikrotik/aps');
            if (!response.ok) {
                throw new Error('Failed to fetch access points');
            }
            const data = await response.json();
            setAccessPoints(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch access points');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAccessPoints();
    }, []);

    const handleAddAP = async (apData: { name: string; macAddress: string; externalIP: string }) => {
        try {
            const response = await fetch('http://localhost:3000/api/mikrotik/aps', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(apData),
            });

            if (!response.ok) {
                throw new Error('Failed to create access point');
            }

            const result = await response.json();
            setAccessPoints(prev => [result.accessPoint, ...prev]);
            setError(null);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to create access point');
        }
    };

    const handleDeleteAP = async (id: string) => {
        if (!confirm('Are you sure you want to delete this access point?')) {
            return;
        }

        try {
            const response = await fetch(`http://localhost:3000/api/mikrotik/aps/${id}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error('Failed to delete access point');
            }

            setAccessPoints(prev => prev.filter(ap => ap._id !== id));
            setError(null);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to delete access point');
        }
    };

    const handleUpdateStatus = async (id: string, status: AccessPoint['status']) => {
        try {
            const response = await fetch(`http://localhost:3000/api/mikrotik/aps/${id}/status`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ status }),
            });

            if (!response.ok) {
                throw new Error('Failed to update status');
            }

            const updatedAP = await response.json();
            setAccessPoints(prev => prev.map(ap => ap._id === id ? updatedAP : ap));
            setError(null);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to update status');
        }
    };

    const getStatusColor = (status: AccessPoint['status']) => {
        switch (status) {
            case 'active': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
            case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
            case 'error': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
            case 'inactive': return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
            default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
        }
    };

    const openAddModal = () => {
        setEditingAP(undefined);
        setIsAddModalOpen(true);
    };

    const openEditModal = (ap: AccessPoint) => {
        setEditingAP(ap);
        setIsAddModalOpen(true);
    };

    const openConfigModal = (ap: AccessPoint) => {
        setConfigModalAP({ id: ap._id, name: ap.name });
    };

    const closeConfigModal = () => {
        setConfigModalAP(null);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md dark:bg-red-900/50 dark:border-red-800 dark:text-red-300">
                    {error}
                </div>
            )}

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 md:p-6">
                <div className="flex flex-col md:flex-row items-center justify-between space-y-3 md:space-y-0 md:space-x-4 p-4">
                    <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Your MikroTik Access Points</h2>
                    <button
                        type="button"
                        onClick={openAddModal}
                        className="flex items-center justify-center text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-500 dark:hover:bg-blue-600 focus:outline-none dark:focus:ring-blue-800"
                    >
                        <svg className="h-3.5 w-3.5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                            <path clipRule="evenodd" fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" />
                        </svg>
                        Add Access Point
                    </button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                            <tr>
                                <th scope="col" className="px-6 py-3">Name</th>
                                <th scope="col" className="px-6 py-3">MAC Address</th>
                                <th scope="col" className="px-6 py-3">External IP</th>
                                <th scope="col" className="px-6 py-3">Identity</th>
                                <th scope="col" className="px-6 py-3">Status</th>
                                <th scope="col" className="px-6 py-3">Hotspot Configured</th>
                                <th scope="col" className="px-6 py-3 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {accessPoints.map((ap) => (
                                <tr key={ap._id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                    <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                        {ap.name}
                                    </th>
                                    <td className="px-6 py-4 font-mono text-sm">{ap.macAddress}</td>
                                    <td className="px-6 py-4 font-mono">{ap.externalIP}</td>
                                    <td className="px-6 py-4 font-mono text-sm">{ap.identity}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(ap.status)}`}>
                                            {ap.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${ap.hotspotConfigured ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'}`}>
                                            {ap.hotspotConfigured ? 'Yes' : 'No'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-center space-x-4">
                                        <button onClick={() => openConfigModal(ap)} className="font-medium text-indigo-600 dark:text-indigo-400 hover:underline">Config</button>
                                        <button onClick={() => window.open(`http://localhost:3000/api/mikrotik/aps/${ap._id}/login-html`, '_blank')} className="font-medium text-green-600 dark:text-green-400 hover:underline">Login HTML</button>
                                        <button onClick={() => openEditModal(ap)} className="font-medium text-blue-600 dark:text-blue-500 hover:underline">Edit</button>
                                        <button onClick={() => handleDeleteAP(ap._id)} className="font-medium text-red-600 dark:text-red-500 hover:underline">Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {accessPoints.length === 0 && (
                        <div className="text-center py-8">
                            <RouterIcon className="mx-auto h-12 w-12 text-gray-400" />
                            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-300">No access points</h3>
                            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Get started by adding your first MikroTik access point.</p>
                            <div className="mt-6">
                                <button
                                    onClick={openAddModal}
                                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                >
                                    <svg className="-ml-1 mr-2 h-5 w-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                        <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                                    </svg>
                                    Add Access Point
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {isAddModalOpen && (
                <AddAPModal
                    onClose={() => setIsAddModalOpen(false)}
                    onAdd={handleAddAP}
                    ap={editingAP}
                />
            )}

            {configModalAP && (
                <APConfigModal
                    apId={configModalAP.id}
                    apName={configModalAP.name}
                    onClose={closeConfigModal}
                />
            )}
        </div>
    );
};

export default MikrotikAPPage;