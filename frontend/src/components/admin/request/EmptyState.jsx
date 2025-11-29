import React from 'react';
import { FaCheckCircle } from 'react-icons/fa';

const EmptyState = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
      <FaCheckCircle className="text-success text-6xl mb-4" />
      <h3 className="text-2xl font-bold mb-2">All Caught Up!</h3>
      <p className="text-base-content/60">
        There are no pending posts to review at the moment.
      </p>
    </div>
  );
};

export default EmptyState;
