import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FiAlertTriangle, FiHome } from 'react-icons/fi';

const AdminUnauthorized = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200">
      <div className="text-center max-w-md px-6">
        <div className="mb-6">
          <FiAlertTriangle className="text-error text-8xl mx-auto mb-4" />
        </div>
        
        <h1 className="text-4xl font-bold mb-4">Access Denied</h1>
        
        <p className="text-lg text-base-content/70 mb-2">
          You do not have permission to access this page.
        </p>
        
        <p className="text-sm text-base-content/60 mb-8">
          Admin privileges are required to view this content. If you believe this is an error, please contact your administrator.
        </p>
        
        <button
          onClick={() => navigate('/home')}
          className="btn btn-primary gap-2"
        >
          <FiHome />
          Go to Homepage
        </button>
      </div>
    </div>
  );
};

export default AdminUnauthorized;
