import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MdHome, MdArrowBack } from 'react-icons/md';

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 text-center">
      {/* 404 Text */}
      <h1 className="font-giaza text-9xl text-custom-blue opacity-20 select-none">
        404
      </h1>
      
      <div className="-mt-12 relative z-10">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          Page Not Found
        </h2>
        <p className="text-gray-600 text-lg max-w-md mx-auto mb-8">
          Oops! The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="btn btn-outline border-custom-blue text-custom-blue hover:bg-custom-blue hover:text-white hover:border-custom-blue gap-2 w-full sm:w-auto"
          >
            <MdArrowBack className="text-xl" />
            Go Back
          </button>

          <Link
            to="/home"
            className="btn bg-custom-blue border-custom-blue text-white hover:bg-blue-800 hover:border-blue-800 gap-2 w-full sm:w-auto"
          >
            <MdHome className="text-xl" />
            Back to Home
          </Link>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-custom-blue/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-custom-green/5 rounded-full blur-3xl"></div>
      </div>
    </div>
  );
};

export default NotFoundPage;
