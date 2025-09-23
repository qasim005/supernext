import React from 'react';

const NotFoundPage: React.FC = () => (
  <div className="flex flex-col items-center justify-center h-full text-center">
    <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
    <p className="text-lg text-gray-500">Sorry, the page you are looking for does not exist.</p>
  </div>
);

export default NotFoundPage;
