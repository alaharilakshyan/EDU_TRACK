import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-900">404</h1>
        <p className="mt-4 text-xl text-gray-600">Page not found</p>
        <Link
          to="/"
          className="mt-8 inline-block px-6 py-3 bg-indigo-600 text-white font-medium rounded-md hover:bg-indigo-700"
        >
          Go back home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
