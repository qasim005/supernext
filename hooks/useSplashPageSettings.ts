import { useState, useCallback } from 'react';
import { SplashPageSettings } from '../types';

const createDefaultSettings = (): SplashPageSettings => ({
  logoUrl: 'https://tailwindui.com/img/logos/mark.svg?color=white',
  welcomeTitle: 'Welcome to Our Guest WiFi!',
  welcomeMessage: 'Get connected in seconds. Enjoy fast and free internet access during your visit.',
  backgroundType: 'image',
  backgroundColor: '#f3f4f6',
  backgroundImageUrl: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=2047&auto=format&fit=crop',
  primaryColor: '#3B82F6', // blue-500
  textColor: '#ffffff',
  loginOptions: {
    voucher: true,
    sms: false,
    socialGoogle: true,
    socialFacebook: false,
    socialInstagram: false,
    socialTikTok: false,
  },
  enableCryptoPayments: false,
  solanaAddress: '',
  bitcoinAddress: '',
  ethereumAddress: '',
  enableStripe: false,
  enableChatbot: false,
  whatsappNumber: '',
});

export const useSplashPageSettings = () => {
  const [settings, setSettings] = useState<SplashPageSettings>(createDefaultSettings);

  const updateSettings = useCallback((newSettings: Partial<SplashPageSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  }, []);

  const updateLoginOption = useCallback((option: keyof SplashPageSettings['loginOptions'], value: boolean) => {
    setSettings(prev => ({
        ...prev,
        loginOptions: {
            ...prev.loginOptions,
            [option]: value
        }
    }));
  }, []);

  return { settings, updateSettings, updateLoginOption };
};