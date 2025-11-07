import React, { useEffect, useState } from 'react';
import axiosInstance from '../../utils/axiosInstance';

const TestProtectedComponent: React.FC = () => {
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProtectedData = async () => {
      try {
        const response = await axiosInstance.get('/api/protected/profile');
        setUserData(response.data.user);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to fetch protected data');
      } finally {
        setLoading(false);
      }
    };

    fetchProtectedData();
  }, []);

  if (loading) {
    return <div className="text-center p-4">Loading protected data...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center p-4">Error: {error}</div>;
  }

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
      <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
        Protected User Data
      </h2>
      {userData && (
        <div className="space-y-2">
          <p><strong>Name:</strong> {userData.fullName}</p>
          <p><strong>Email:</strong> {userData.email}</p>
          <p><strong>Role:</strong> {userData.role}</p>
          <p><strong>Email Verified:</strong> {userData.emailVerified ? 'Yes' : 'No'}</p>
        </div>
      )}
    </div>
  );
};

export default TestProtectedComponent;