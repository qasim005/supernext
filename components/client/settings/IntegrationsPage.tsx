import React, { useState } from 'react';
import { IntegrationSettings } from '../../../types';
import { GoogleIcon, MailIcon, MessageSquareIcon, CreditCardIcon } from '../../icons/IconComponents';
import { useNotificationsContext } from '../../../context/NotificationsContext';
import { NotificationType } from '../../../types';

const SectionCard: React.FC<{ title: string, icon: React.ReactNode, children: React.ReactNode }> = ({ title, icon, children }) => (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center gap-3">
            {icon}
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">{title}</h3>
        </div>
        <div className="p-6">
            {children}
        </div>
    </div>
);

const IntegrationsPage: React.FC = () => {
    const { addNotification } = useNotificationsContext();
    const [settings, setSettings] = useState<IntegrationSettings>({
        googleApiKey: '',
        emailGateway: 'none',
        emailApiKey: '',
        emailFromAddress: '',
        smsGateway: 'none',
        smsSid: '',
        smsAuthToken: '',
        smsFromNumber: '',
        stripePublicKey: '',
        stripeSecretKey: '',
    });
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setSettings(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = () => {
        console.log("Saving integration settings:", settings);
        // In a real app, this would make an API call.
        addNotification({
            type: NotificationType.Support,
            title: "Settings Saved",
            message: "Your integration settings have been successfully updated."
        });
    };

    return (
        <div className="space-y-6">
            <SectionCard title="Email Gateway" icon={<MailIcon className="w-6 h-6 text-gray-500" />}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label htmlFor="emailGateway" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Email Provider</label>
                        <select id="emailGateway" name="emailGateway" value={settings.emailGateway} onChange={handleChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600">
                            <option value="none">None</option>
                            <option value="sendgrid">SendGrid</option>
                            <option value="mailgun">Mailgun</option>
                        </select>
                    </div>
                     <div>
                        <label htmlFor="emailFromAddress" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">"From" Email Address</label>
                        <input type="email" id="emailFromAddress" name="emailFromAddress" value={settings.emailFromAddress} onChange={handleChange} placeholder="noreply@yourdomain.com" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600" />
                    </div>
                    <div className="md:col-span-2">
                        <label htmlFor="emailApiKey" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">API Key</label>
                        <input type="password" id="emailApiKey" name="emailApiKey" value={settings.emailApiKey} onChange={handleChange} placeholder="******************" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600" />
                    </div>
                </div>
            </SectionCard>
            
            <SectionCard title="SMS Gateway" icon={<MessageSquareIcon className="w-6 h-6 text-gray-500" />}>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label htmlFor="smsGateway" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">SMS Provider</label>
                        <select id="smsGateway" name="smsGateway" value={settings.smsGateway} onChange={handleChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600">
                            <option value="none">None</option>
                            <option value="twilio">Twilio</option>
                            <option value="atn0">ATN0</option>
                        </select>
                    </div>
                     <div>
                        <label htmlFor="smsFromNumber" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">"From" Number</label>
                        <input type="tel" id="smsFromNumber" name="smsFromNumber" value={settings.smsFromNumber} onChange={handleChange} placeholder="+15551234567" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600" />
                    </div>
                    <div>
                        <label htmlFor="smsSid" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Account SID</label>
                        <input type="text" id="smsSid" name="smsSid" value={settings.smsSid} onChange={handleChange} placeholder="ACxxxxxxxxxxxxxxxxxxxxxxxx" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600" />
                    </div>
                     <div>
                        <label htmlFor="smsAuthToken" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Auth Token</label>
                        <input type="password" id="smsAuthToken" name="smsAuthToken" value={settings.smsAuthToken} onChange={handleChange} placeholder="******************" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600" />
                    </div>
                 </div>
            </SectionCard>
            
            <SectionCard title="Payment Gateway" icon={<CreditCardIcon className="w-6 h-6 text-gray-500" />}>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label htmlFor="stripePublicKey" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Stripe Public Key</label>
                        <input type="text" id="stripePublicKey" name="stripePublicKey" value={settings.stripePublicKey} onChange={handleChange} placeholder="pk_live_xxxxxxxxxxxx" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600" />
                    </div>
                     <div>
                        <label htmlFor="stripeSecretKey" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Stripe Secret Key</label>
                        <input type="password" id="stripeSecretKey" name="stripeSecretKey" value={settings.stripeSecretKey} onChange={handleChange} placeholder="******************" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600" />
                    </div>
                 </div>
            </SectionCard>
            
            <SectionCard title="Google Services" icon={<GoogleIcon className="w-6 h-6" />}>
                 <div>
                    <label htmlFor="googleApiKey" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Google Maps/Analytics API Key</label>
                    <input type="password" id="googleApiKey" name="googleApiKey" value={settings.googleApiKey} onChange={handleChange} placeholder="******************" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600" />
                </div>
            </SectionCard>

            <div className="flex justify-end">
                <button
                    onClick={handleSave}
                    className="px-6 py-2.5 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700"
                >
                    Save All Settings
                </button>
            </div>
        </div>
    );
};

export default IntegrationsPage;