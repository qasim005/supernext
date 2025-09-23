import React, { useState, useEffect } from 'react';
import { RouterIcon, DownloadIcon, CopyIcon, CheckIcon } from '../icons/IconComponents';

interface ConfigStep {
    step: number;
    title: string;
    description: string;
    value?: string;
    values?: {
        address: string;
        secret: string;
    };
}

interface ConfigData {
    title: string;
    apName: string;
    steps: ConfigStep[];
}

interface APConfigModalProps {
    apId: string;
    apName: string;
    onClose: () => void;
}

const APConfigModal: React.FC<APConfigModalProps> = ({ apId, apName, onClose }) => {
    const [configData, setConfigData] = useState<ConfigData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [copiedField, setCopiedField] = useState<string | null>(null);
    const [downloadingHTML, setDownloadingHTML] = useState(false);

    useEffect(() => {
        fetchConfigData();
    }, [apId]);

    const fetchConfigData = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${import.meta.env.VITE_BASE_URL}/api/mikrotik/aps/${apId}/config`);
            if (!response.ok) {
                throw new Error('Failed to fetch configuration data');
            }
            const data = await response.json();
            setConfigData(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch configuration');
        } finally {
            setLoading(false);
        }
    };

    const handleDownloadLoginHTML = async () => {
        try {
            setDownloadingHTML(true);
            const response = await fetch(`${import.meta.env.VITE_BASE_URL}/api/mikrotik/aps/${apId}/login-html`);
            if (!response.ok) {
                throw new Error('Failed to fetch login HTML');
            }

            const htmlContent = await response.text();

            // Create and download the file
            const blob = new Blob([htmlContent], { type: 'text/html' });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `${apName.replace(/\s+/g, '_')}_login.html`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to download login HTML');
        } finally {
            setDownloadingHTML(false);
        }
    };

    const copyToClipboard = (text: string, fieldName: string) => {
        navigator.clipboard.writeText(text).then(() => {
            setCopiedField(fieldName);
            setTimeout(() => setCopiedField(null), 2000);
        });
    };

    const CopyButton: React.FC<{ text: string; fieldName: string }> = ({ text, fieldName }) => (
        <button
            onClick={() => copyToClipboard(text, fieldName)}
            className="ml-2 p-1 text-gray-500 hover:text-blue-600 transition-colors"
            title="Copy to clipboard"
        >
            {copiedField === fieldName ? (
                <CheckIcon className="w-4 h-4 text-green-600" />
            ) : (
                <CopyIcon className="w-4 h-4" />
            )}
        </button>
    );

    if (loading) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                <div className="bg-white rounded-lg shadow-xl dark:bg-gray-800 w-full max-w-4xl m-4 p-8">
                    <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                        <span className="ml-3 text-gray-600 dark:text-gray-300">Loading configuration...</span>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg shadow-xl dark:bg-gray-800 w-full max-w-4xl m-4 max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center p-6 border-b dark:border-gray-600">
                    <div className="flex items-center">
                        <RouterIcon className="w-6 h-6 text-blue-600 mr-3" />
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                AP Configuration - {apName}
                            </h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Follow these steps to configure your MikroTik access point</p>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white"
                    >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path>
                        </svg>
                    </button>
                </div>

                <div className="p-6">
                    {error && (
                        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md dark:bg-red-900/50 dark:border-red-800 dark:text-red-300">
                            {error}
                        </div>
                    )}

                    {configData && (
                        <div className="space-y-6">
                            {configData.steps.map((step) => (
                                <div key={step.step} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                                    <div className="flex items-start">
                                        <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold text-sm">
                                            {step.step}
                                        </div>
                                        <div className="ml-4 flex-1">
                                            <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                                                {step.title}
                                            </h4>
                                            <p className="text-gray-600 dark:text-gray-300 mb-4">
                                                {step.description}
                                            </p>

                                            {/* Step 1: Configure Identity */}
                                            {step.step === 1 && step.value && (
                                                <div className="bg-white dark:bg-gray-800 rounded-md p-4 border">
                                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                        Identity Value:
                                                    </label>
                                                    <div className="flex items-center bg-gray-100 dark:bg-gray-600 rounded-md p-3">
                                                        <code className="font-mono text-sm text-gray-900 dark:text-gray-100 flex-1">
                                                            {step.value}
                                                        </code>
                                                        <CopyButton text={step.value} fieldName="identity" />
                                                    </div>
                                                </div>
                                            )}

                                            {/* Step 2: Configure Radius */}
                                            {step.step === 2 && step.values && (
                                                <div className="space-y-4">
                                                    <div className="bg-white dark:bg-gray-800 rounded-md p-4 border">
                                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                            RADIUS Server Address:
                                                        </label>
                                                        <div className="flex items-center bg-gray-100 dark:bg-gray-600 rounded-md p-3">
                                                            <code className="font-mono text-sm text-gray-900 dark:text-gray-100 flex-1">
                                                                {step.values.address}
                                                            </code>
                                                            <CopyButton text={step.values.address} fieldName="address" />
                                                        </div>
                                                    </div>
                                                    <div className="bg-white dark:bg-gray-800 rounded-md p-4 border">
                                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                            RADIUS Secret:
                                                        </label>
                                                        <div className="flex items-center bg-gray-100 dark:bg-gray-600 rounded-md p-3">
                                                            <code className="font-mono text-sm text-gray-900 dark:text-gray-100 flex-1">
                                                                {step.values.secret}
                                                            </code>
                                                            <CopyButton text={step.values.secret} fieldName="secret" />
                                                        </div>
                                                    </div>
                                                </div>
                                            )}

                                            {/* Step 3: Setup Hotspot Profile */}
                                            {step.step === 3 && (
                                                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md p-4">
                                                    <div className="flex items-center">
                                                        <div className="flex-shrink-0">
                                                            <svg className="h-5 w-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                                                                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                                            </svg>
                                                        </div>
                                                        <div className="ml-3">
                                                            <h5 className="text-sm font-medium text-blue-800 dark:text-blue-200">
                                                                Manual Configuration Required
                                                            </h5>
                                                            <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                                                                This step must be completed manually using Winbox on your MikroTik device.
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}

                                            {/* Step 4: Replace login.html */}
                                            {step.step === 4 && (
                                                <div className="bg-white dark:bg-gray-800 rounded-md p-4 border">
                                                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                                                        Download the custom login.html file and replace the existing one in your MikroTik hotspot folder.
                                                    </p>
                                                    <button
                                                        onClick={handleDownloadLoginHTML}
                                                        disabled={downloadingHTML}
                                                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                                    >
                                                        {downloadingHTML ? (
                                                            <>
                                                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                                                Downloading...
                                                            </>
                                                        ) : (
                                                            <>
                                                                <DownloadIcon className="w-4 h-4 mr-2" />
                                                                Download login.html
                                                            </>
                                                        )}
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="flex justify-end p-6 border-t border-gray-200 dark:border-gray-600">
                    <button
                        onClick={onClose}
                        className="px-6 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-gray-600 dark:text-gray-200 dark:border-gray-500 dark:hover:bg-gray-700"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default APConfigModal;