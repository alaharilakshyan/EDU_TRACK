import React from 'react';

const PendingApprovals = () => {
  return (
    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <div className="px-4 py-6 sm:px-0">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Pending Approvals</h1>
        <div className="border-4 border-dashed border-gray-200 rounded-lg h-96 flex items-center justify-center">
          <div className="text-center">
            <p className="text-gray-500">Pending Approvals</p>
            <p className="text-sm text-gray-400 mt-2">Review and approve student submissions here</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PendingApprovals;
