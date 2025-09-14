import React from 'react';
import { useSplashPageSettings } from '../../../hooks/useSplashPageSettings';
import { SplashPageSettings } from '../../../types';
import { GoogleIcon, TicketIcon, UploadCloudIcon, WifiIcon, BitcoinIcon, CreditCardIcon, FacebookIcon, InstagramIcon, TikTokIcon, PhoneIcon } from '../../icons/IconComponents';
import ChatbotWidget from './ChatbotWidget';

const SplashPagePreview: React.FC<{ settings: SplashPageSettings }> = ({ settings }) => {
    const backgroundStyle: React.CSSProperties = settings.backgroundType === 'image'
        ? { backgroundImage: `url(${settings.backgroundImageUrl})` }
        : { backgroundColor: settings.backgroundColor };
    
    return (
        <div className="relative w-full h-full rounded-lg overflow-hidden shadow-lg flex items-center justify-center bg-cover bg-center" style={backgroundStyle}>
            <div className="bg-black bg-opacity-40 p-8 rounded-lg w-full max-w-sm text-center" style={{ color: settings.textColor }}>
                {settings.logoUrl && <img src={settings.logoUrl} alt="Logo" className="h-12 mx-auto mb-6" />}
                <h1 className="text-3xl font-bold">{settings.welcomeTitle}</h1>
                <p className="mt-2 text-sm opacity-90">{settings.welcomeMessage}</p>

                <div className="mt-8 space-y-4">
                    {settings.loginOptions.voucher && (
                        <button className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-semibold" style={{ backgroundColor: settings.primaryColor, color: settings.textColor }}>
                           <TicketIcon className="w-5 h-5"/> Enter Voucher Code
                        </button>
                    )}
                    {settings.loginOptions.sms && (
                        <div className="flex gap-2">
                            <input type="tel" placeholder="Enter mobile number" className="flex-grow bg-white/20 placeholder-white/70 text-white border-white/50 border rounded-lg px-3 text-sm focus:ring-2 focus:ring-white/50 focus:outline-none" />
                            <button className="flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-semibold" style={{ backgroundColor: settings.primaryColor, color: settings.textColor }}>
                                <PhoneIcon className="w-5 h-5"/>
                            </button>
                        </div>
                    )}
                    {settings.enableStripe && (
                         <button className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-semibold bg-white text-gray-800">
                           <CreditCardIcon className="w-5 h-5"/> Pay with Card
                        </button>
                    )}
                     {settings.enableCryptoPayments && (
                        <button className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-semibold bg-white text-gray-800">
                           <BitcoinIcon className="w-5 h-5"/> Pay with Crypto
                        </button>
                    )}
                    
                    {(settings.loginOptions.socialGoogle || settings.loginOptions.socialFacebook || settings.loginOptions.socialInstagram || settings.loginOptions.socialTikTok) && (
                         <div className="relative flex py-2 items-center">
                            <div className="flex-grow border-t border-gray-400"></div>
                            <span className="flex-shrink mx-4 text-xs opacity-80">Or connect with</span>
                            <div className="flex-grow border-t border-gray-400"></div>
                        </div>
                    )}

                    <div className="flex justify-center items-center gap-3">
                        {settings.loginOptions.socialGoogle && (
                            <button className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-semibold bg-white text-gray-800">
                               <GoogleIcon className="w-5 h-5"/>
                            </button>
                        )}
                        {settings.loginOptions.socialFacebook && (
                             <button className="flex-1 flex items-center justify-center py-3 px-4 rounded-lg font-semibold text-white" style={{backgroundColor: '#1877F2'}}>
                               <FacebookIcon className="w-5 h-5"/>
                            </button>
                        )}
                        {settings.loginOptions.socialInstagram && (
                             <button className="flex-1 flex items-center justify-center py-3 px-4 rounded-lg font-semibold text-white bg-gradient-to-r from-purple-500 via-pink-500 to-red-500">
                               <InstagramIcon className="w-5 h-5"/>
                            </button>
                        )}
                         {settings.loginOptions.socialTikTok && (
                             <button className="flex-1 flex items-center justify-center py-3 px-4 rounded-lg font-semibold text-white bg-black">
                               <TikTokIcon className="w-5 h-5"/>
                            </button>
                        )}
                    </div>
                </div>
            </div>
            {settings.enableChatbot && <ChatbotWidget settings={settings} />}
        </div>
    );
};

const ControlSection: React.FC<{title: string, children: React.ReactNode}> = ({title, children}) => (
    <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4 pb-2 border-b border-gray-200 dark:border-gray-700">{title}</h3>
        <div className="space-y-4">{children}</div>
    </div>
);

const ToggleSwitch: React.FC<{label: string, enabled: boolean, onChange: (enabled: boolean) => void}> = ({label, enabled, onChange}) => (
    <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-gray-900 dark:text-gray-300">{label}</span>
        <label className="inline-flex items-center cursor-pointer">
          <input type="checkbox" checked={enabled} onChange={e => onChange(e.target.checked)} className="sr-only peer" />
          <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
        </label>
    </div>
);


const SplashPageCustomizer: React.FC = () => {
    const { settings, updateSettings, updateLoginOption } = useSplashPageSettings();

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, field: 'logoUrl' | 'backgroundImageUrl') => {
        if (e.target.files && e.target.files[0]) {
            const fileUrl = URL.createObjectURL(e.target.files[0]);
            updateSettings({ [field]: fileUrl });
        }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-[calc(100vh-12rem)]">
            {/* Controls Panel */}
            <div className="lg:col-span-1 bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 overflow-y-auto">
                <ControlSection title="Branding">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Company Logo</label>
                        <div className="mt-2 flex items-center gap-4">
                            <img src={settings.logoUrl} alt="logo" className="h-12 w-12 p-2 bg-gray-600 rounded-md object-contain"/>
                            <input type="file" id="logo-upload" onChange={e => handleFileChange(e, 'logoUrl')} className="hidden"/>
                            <label htmlFor="logo-upload" className="cursor-pointer text-sm text-blue-600 dark:text-blue-400 hover:underline">Change logo</label>
                        </div>
                    </div>
                     <div>
                        <label htmlFor="welcomeTitle" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Welcome Title</label>
                        <input type="text" id="welcomeTitle" value={settings.welcomeTitle} onChange={e => updateSettings({ welcomeTitle: e.target.value })} className="mt-1 w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg p-2.5 dark:bg-gray-700 dark:border-gray-600" />
                    </div>
                     <div>
                        <label htmlFor="welcomeMessage" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Welcome Message</label>
                        <textarea id="welcomeMessage" value={settings.welcomeMessage} onChange={e => updateSettings({ welcomeMessage: e.target.value })} rows={3} className="mt-1 w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg p-2.5 dark:bg-gray-700 dark:border-gray-600" />
                    </div>
                </ControlSection>

                <ControlSection title="Appearance">
                     <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Background</label>
                         <div className="flex items-center p-1 rounded-lg bg-gray-200 dark:bg-gray-700">
                             <button onClick={() => updateSettings({ backgroundType: 'image' })} className={`w-1/2 py-1.5 text-sm rounded-md ${settings.backgroundType === 'image' ? 'bg-white dark:bg-gray-800 shadow' : ''}`}>Image</button>
                             <button onClick={() => updateSettings({ backgroundType: 'color' })} className={`w-1/2 py-1.5 text-sm rounded-md ${settings.backgroundType === 'color' ? 'bg-white dark:bg-gray-800 shadow' : ''}`}>Color</button>
                         </div>
                         {settings.backgroundType === 'image' ? (
                              <div className="mt-2">
                                <label htmlFor="bg-upload" className="relative cursor-pointer w-full h-24 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 flex flex-col justify-center items-center text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                   <UploadCloudIcon className="w-6 h-6"/>
                                   <span className="text-xs mt-1">Click to upload background</span>
                                   <input type="file" id="bg-upload" onChange={e => handleFileChange(e, 'backgroundImageUrl')} className="hidden"/>
                                </label>
                              </div>
                         ) : (
                             <div className="mt-2 flex items-center gap-2">
                                <input type="color" value={settings.backgroundColor} onChange={e => updateSettings({ backgroundColor: e.target.value })} className="p-0 h-10 w-10 border-none rounded-md cursor-pointer"/>
                                <span className="text-sm font-mono">{settings.backgroundColor}</span>
                             </div>
                         )}
                    </div>
                     <div className="flex justify-between items-center">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Primary Button Color</label>
                        <input type="color" value={settings.primaryColor} onChange={e => updateSettings({ primaryColor: e.target.value })} className="p-0 h-8 w-8 border-none rounded-md cursor-pointer"/>
                     </div>
                     <div className="flex justify-between items-center">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Text Color</label>
                        <input type="color" value={settings.textColor} onChange={e => updateSettings({ textColor: e.target.value })} className="p-0 h-8 w-8 border-none rounded-md cursor-pointer"/>
                     </div>
                </ControlSection>

                 <ControlSection title="Login Options">
                    <ToggleSwitch label="Voucher Login" enabled={settings.loginOptions.voucher} onChange={val => updateLoginOption('voucher', val)} />
                    <ToggleSwitch label="Mobile SMS Login" enabled={settings.loginOptions.sms} onChange={val => updateLoginOption('sms', val)} />
                    <ToggleSwitch label="Google Login" enabled={settings.loginOptions.socialGoogle} onChange={val => updateLoginOption('socialGoogle', val)} />
                    <ToggleSwitch label="Facebook Login" enabled={settings.loginOptions.socialFacebook} onChange={val => updateLoginOption('socialFacebook', val)} />
                    <ToggleSwitch label="Instagram Login" enabled={settings.loginOptions.socialInstagram} onChange={val => updateLoginOption('socialInstagram', val)} />
                    <ToggleSwitch label="TikTok Login" enabled={settings.loginOptions.socialTikTok} onChange={val => updateLoginOption('socialTikTok', val)} />
                </ControlSection>

                <ControlSection title="Payment Gateway">
                    <ToggleSwitch label="Enable Stripe Payments" enabled={settings.enableStripe} onChange={val => updateSettings({ enableStripe: val })} />
                    <ToggleSwitch label="Enable Cryptocurrency Payments" enabled={settings.enableCryptoPayments} onChange={val => updateSettings({ enableCryptoPayments: val })} />
                    {settings.enableCryptoPayments && (
                        <div className="space-y-4 pt-4">
                            <div>
                                <label htmlFor="bitcoinAddress" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Bitcoin (BTC) Address</label>
                                <input type="text" id="bitcoinAddress" value={settings.bitcoinAddress} onChange={e => updateSettings({ bitcoinAddress: e.target.value })} className="mt-1 w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg p-2.5 dark:bg-gray-700 dark:border-gray-600" />
                            </div>
                            <div>
                                <label htmlFor="ethereumAddress" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Ethereum (ETH) Address</label>
                                <input type="text" id="ethereumAddress" value={settings.ethereumAddress} onChange={e => updateSettings({ ethereumAddress: e.target.value })} className="mt-1 w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg p-2.5 dark:bg-gray-700 dark:border-gray-600" />
                            </div>
                            <div>
                                <label htmlFor="solanaAddress" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Solana (SOL) Address</label>
                                <input type="text" id="solanaAddress" value={settings.solanaAddress} onChange={e => updateSettings({ solanaAddress: e.target.value })} className="mt-1 w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg p-2.5 dark:bg-gray-700 dark:border-gray-600" />
                            </div>
                        </div>
                    )}
                </ControlSection>

                 <ControlSection title="Chatbot Support">
                    <ToggleSwitch label="Enable WhatsApp Chatbot" enabled={settings.enableChatbot} onChange={val => updateSettings({ enableChatbot: val })} />
                    {settings.enableChatbot && (
                         <div>
                            <label htmlFor="whatsappNumber" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Company WhatsApp Number</label>
                            <input type="tel" id="whatsappNumber" placeholder="+1234567890" value={settings.whatsappNumber} onChange={e => updateSettings({ whatsappNumber: e.target.value })} className="mt-1 w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg p-2.5 dark:bg-gray-700 dark:border-gray-600" />
                        </div>
                    )}
                </ControlSection>
            </div>

            {/* Preview Panel */}
            <div className="lg:col-span-2 rounded-lg bg-gray-200 dark:bg-gray-900 p-4">
                <SplashPagePreview settings={settings} />
            </div>
        </div>
    );
};

export default SplashPageCustomizer;