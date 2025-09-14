import { useState, useCallback, useMemo, useEffect } from 'react';
import { Voucher, VoucherStatus } from '../types';
import { api } from '../utils/api'; // Import the new API client

export interface GenerateVoucherOptions {
    count: number;
    validity: string;
    speedLimit: string;
    deviceLimit: number;
    batch: string;
}

export const useVouchers = () => {
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchVouchers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.get('/vouchers');
      // Ensure date strings from API are converted to Date objects
      const formattedData = data.map((v: any) => ({
        ...v,
        createdAt: new Date(v.createdAt),
        expiresAt: new Date(v.expiresAt),
      }));
      setVouchers(formattedData);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch vouchers.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchVouchers();
  }, [fetchVouchers]);

  const stats = useMemo(() => {
    const now = new Date();
    const sevenDaysFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    const nonArchived = vouchers.filter(v => v.status !== VoucherStatus.Archived);

    return {
      total: nonArchived.length,
      active: nonArchived.filter(v => v.status === VoucherStatus.Active).length,
      pending: nonArchived.filter(v => v.status === VoucherStatus.Pending).length,
      expired: nonArchived.filter(v => v.status === VoucherStatus.Expired).length,
      suspended: nonArchived.filter(v => v.status === VoucherStatus.Suspended).length,
      expiringSoon: nonArchived.filter(v => 
          v.status !== VoucherStatus.Expired &&
          v.expiresAt > now &&
          v.expiresAt <= sevenDaysFromNow
      ).length,
    };
  }, [vouchers]);

  const updateVoucherStatus = async (ids: string[], status: VoucherStatus) => {
    setLoading(true);
    try {
      const endpointMap = {
        [VoucherStatus.Active]: '/vouchers/activate',
        [VoucherStatus.Suspended]: '/vouchers/suspend',
        [VoucherStatus.Archived]: '/vouchers/archive',
      };
      // Find the correct endpoint or throw an error
      const endpoint = Object.entries(endpointMap).find(([s]) => s === status)?.[1];
      if (!endpoint) throw new Error(`Invalid status update: ${status}`);

      await api.post(endpoint, { voucherIds: ids });
      // Refetch data to get the latest state from the server
      await fetchVouchers();
    } catch (err: any) {
      setError(err.message || `Failed to update voucher status to ${status}.`);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const generateVouchers = async (options: GenerateVoucherOptions) => {
    setLoading(true);
    try {
      await api.post('/vouchers', options);
      await fetchVouchers(); // Refresh list after generating
    } catch (err: any) {
      setError(err.message || 'Failed to generate vouchers.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const deleteVouchers = async (ids: string[]) => {
    setLoading(true);
    try {
      // Assuming a DELETE /vouchers endpoint that accepts a body with IDs
      await api.post('/vouchers/delete', { voucherIds: ids }); // Many backends use POST for bulk delete
      await fetchVouchers(); // Refresh list
    } catch (err: any) {
      setError(err.message || 'Failed to delete vouchers.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const suspendVouchers = (ids: string[]) => updateVoucherStatus(ids, VoucherStatus.Suspended);
  const activateVouchers = (ids: string[]) => updateVoucherStatus(ids, VoucherStatus.Active);
  const archiveVouchers = (ids: string[]) => updateVoucherStatus(ids, VoucherStatus.Archived);

  return { vouchers, stats, loading, error, generateVouchers, deleteVouchers, suspendVouchers, activateVouchers, archiveVouchers };
};
