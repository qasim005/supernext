import React, { useState } from 'react';
import { WifiIcon, CheckCircleIcon } from '../../icons/IconComponents';
import { SuperNextLogo } from '../../icons/IconComponents';

interface HotspotSimulationPageProps {
    voucherCode: string;
    onBack: () => void;
}

type SimulationStep = 'wifiConnect' | 'splashLogin' | 'connected';

const HotspotSimulationPage: React.FC<HotspotSimulationPageProps> = ({ voucherCode, onBack }) => {
    const [step, setStep] = useState<SimulationStep>('wifiConnect');
    const [inputValue, setInputValue] = useState(voucherCode);

    const handleConnect = () => {
        // Simulate loading then show splash page
        setTimeout(() => setStep('splashLogin'), 1000);
    };

    const handleLogin = () => {
        // Simulate loading then show connected page
         setTimeout(() => setStep('connected'), 1500);
    };


    const renderContent = () => {
        switch (step) {
            case 'wifiConnect':
                return (
                    <div className="p-4 text-gray-800 dark:text-gray-200">
                        <h2 className="font-bold text-center text-lg">Wi-Fi Networks</h2>
                        <div className="mt-4 space-y-2">
                            <div className="flex items-center justify-between p-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
                                <div className="flex items-center gap-3">
                                    <WifiIcon className="w-6 h-6 text-blue-500" />
                                    <span className="font-semibold">SuperNext Guest WiFi</span>
                                </div>
                                <button onClick={handleConnect} className="px-3 py-1 text-sm text-white bg-blue-600 rounded-full">Connect</button>
                            </div>
                             <div className="flex items-center justify-between p-3 rounded-lg">
                                <div className="flex items-center gap-3">
                                    <WifiIcon className="w-6 h-6 text-gray-400" />
                                    <span className="text-gray-500">Other_Network_1</span>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            case 'splashLogin':
                return (
                    <div className="h-full bg-cover bg-center rounded-2xl flex items-center justify-center p-4" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=2047&auto=format&fit=crop')" }}>
                         <div className="bg-black bg-opacity-40 p-8 rounded-lg w-full max-w-sm text-center text-white">
                            <SuperNextLogo className="h-12 mx-auto mb-6" />
                            <h1 className="text-2xl font-bold">Welcome!</h1>
                            <p className="mt-2 text-sm opacity-90">Enter your voucher code to connect.</p>
                            <form onSubmit={(e) => { e.preventDefault(); handleLogin(); }} className="mt-6 space-y-4">
                                <input 
                                    type="text"
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    className="w-full font-mono tracking-widest text-center text-lg bg-white/20 placeholder-white/70 text-white border-white/50 border rounded-lg px-3 py-2 focus:ring-2 focus:ring-white/50 focus:outline-none" 
                                    placeholder="VOUCHER-CODE"
                                />
                                <button type="submit" className="w-full py-3 px-4 rounded-lg font-semibold bg-blue-500 text-white">
                                   Connect Now
                                </button>
                            </form>
                         </div>
                    </div>
                );
            case 'connected':
                return (
                     <div className="h-full bg-gray-100 dark:bg-gray-800 rounded-2xl flex flex-col items-center justify-center p-4 text-center">
                        <CheckCircleIcon className="w-20 h-20 text-green-500" />
                        <h1 className="text-3xl font-bold mt-4 text-gray-900 dark:text-white">You're Connected!</h1>
                        <p className="text-gray-600 dark:text-gray-400 mt-2">Your internet access is now active.</p>
                         <div className="mt-8 text-left bg-white dark:bg-gray-700 p-4 rounded-lg w-full">
                            <p><strong>Voucher:</strong> {inputValue}</p>
                            <p><strong>Time Remaining:</strong> 29 days, 23 hours</p>
                            <p><strong>Speed:</strong> 10 Mbps</p>
                        </div>
                         <button onClick={onBack} className="mt-8 px-6 py-2 text-sm font-medium text-blue-600 hover:underline">
                            Disconnect
                        </button>
                    </div>
                )
        }
    }

    return (
        <div className="fixed inset-0 bg-gray-800 flex flex-col items-center justify-center p-4">
            <h1 className="text-2xl font-bold text-white mb-4">Hotspot Connection Simulation</h1>
            {/* Phone Mockup */}
            <div className="w-full max-w-sm h-[70vh] rounded-[40px] shadow-2xl p-3 bg-gray-900 overflow-hidden">
                <div className="w-full h-full bg-white dark:bg-gray-900 rounded-[30px] overflow-y-auto">
                    {renderContent()}
                </div>
            </div>
             <button onClick={onBack} className="mt-6 px-5 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700">
                &larr; Back to Dashboard
            </button>
        </div>
    );
};

export default HotspotSimulationPage;