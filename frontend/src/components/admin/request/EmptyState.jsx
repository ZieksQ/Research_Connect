import React from 'react';
import { FaCheckCircle } from 'react-icons/fa';

const EmptyState = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
      <FaCheckCircle className="text-custom-green text-6xl mb-4" />
      <h3 className="text-2xl font-bold mb-2 text-gray-800">All Caught Up!</h3>
      <p className="text-gray-500">
        There are no pending posts to review at the moment.
      </p>
    </div>
  );
};

export default EmptyState;
