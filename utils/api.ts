// A simple API client to handle requests to your backend.
// By using a relative path, we can leverage Vite's proxy in development.
const API_BASE_URL = '/api';

const request = async (endpoint: string, method: 'GET' | 'POST' | 'PUT' | 'DELETE', body?: any) => {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    // In the future, you would add your authentication token here:
    // 'Authorization': `Bearer ${your_auth_token}`
  };

  const config: RequestInit = {
    method,
    headers,
  };

  if (body) {
    config.body = JSON.stringify(body);
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: 'An unknown error occurred' }));
    throw new Error(errorData.message || 'API request failed');
  }

  // For DELETE requests or other requests that might not return a body
  if (response.status === 204) {
    return null;
  }

  return response.json();
};

export const api = {
  get: (endpoint: string) => request(endpoint, 'GET'),
  post: (endpoint: string, body: any) => request(endpoint, 'POST', body),
  put: (endpoint: string, body: any) => request(endpoint, 'PUT', body),
  delete: (endpoint: string) => request(endpoint, 'DELETE'),
};