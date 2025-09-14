import { useMemo, useState } from 'react';
import { ClientProfile, BillingInfo } from '../types';

const createMockSettings = () => {
    const profile: ClientProfile = {
        companyName: 'The Grand Cafe',
        logoUrl: 'https://picsum.photos/200',
        address: '123 Coffee Bean Lane, Brewville, CA 90210',
        email: 'contact@grandcafe.com',
        contactNumber: '+1 (555) 123-4567',
        whatsappLink: 'https://wa.me/15551234567',
        timeZone: 'America/Los_Angeles',
        language: 'English',
    };

    const billing: BillingInfo = {
        plan: 'Professional',
        renewalDate: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000), // 20 days from now
        vouchersUsed: 1345,
        voucherLimit: 2000,
        paymentMethods: [
            { id: 'pm_1', type: 'Visa', last4: '4242', isDefault: true },
            { id: 'pm_2', type: 'MasterCard', last4: '5555', isDefault: false },
        ],
        invoices: [
            { id: 'inv_003', date: new Date('2024-07-01'), amount: 79.00, status: 'Paid' },
            { id: 'inv_002', date: new Date('2024-06-01'), amount: 79.00, status: 'Paid' },
            { id: 'inv_001', date: new Date('2024-05-01'), amount: 79.00, status: 'Paid' },
        ],
        autoRenewal: true,
    };

    return { profile, billing };
};

export const useClientSettings = () => {
  const initialSettings = useMemo(() => createMockSettings(), []);
  const [profile, setProfile] = useState<ClientProfile>(initialSettings.profile);
  const [billing, setBilling] = useState<BillingInfo>(initialSettings.billing);

  const updateProfile = (newProfile: Partial<ClientProfile>) => {
      setProfile(prev => ({...prev, ...newProfile}));
  };

  const updateBilling = (newBilling: Partial<BillingInfo>) => {
      setBilling(prev => ({...prev, ...newBilling}));
  };

  return { profile, billing, updateProfile, updateBilling };
};
