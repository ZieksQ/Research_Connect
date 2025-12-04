import React, { useState } from "react";
import { Link } from "react-router-dom";
import GoogleLogo from "../../assets/icons/google_icon.svg";

const Signup = ({
  onSubmit,
  onChangeUsername,
  onChangePassword,
  onChangeConfirmPassword,
  Data,
  error,
  loading,
}) => {
  const { username, password, confirmPassword } = Data;

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {/* Error Message */}
      {error && (
        <div
          role="alert"
          className="alert alert-error mb-4 rounded-lg shadow-sm text-sm py-2"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 shrink-0 stroke-current"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span>{error}</span>
        </div>
      )}

      {/* Username */}
      <div className="form-control w-full">
        <label className="label">
          <span className="label-text font-medium text-gray-700">Username</span>
        </label>
        <input
          type="text"
          placeholder="Choose a username"
          className="input input-bordered w-full bg-white border-gray-300 focus:border-custom-blue focus:ring-1 focus:ring-custom-blue text-gray-900"
          required
          value={username}
          onChange={onChangeUsername}
        />
      </div>

      {/* Password */}
      <div className="form-control w-full">
        <label className="label">
          <span className="label-text font-medium text-gray-700">Password</span>
        </label>
        <input
          type="password"
          placeholder="Create a password (min 8 chars)"
          className="input input-bordered w-full bg-white border-gray-300 focus:border-custom-blue focus:ring-1 focus:ring-custom-blue text-gray-900"
          required
          minLength={8}
          value={password}
          onChange={onChangePassword}
        />
      </div>

      {/* Confirm Password */}
      <div className="form-control w-full">
        <label className="label">
          <span className="label-text font-medium text-gray-700">Confirm Password</span>
        </label>
        <input
          type="password"
          placeholder="Re-enter your password"
          className="input input-bordered w-full bg-white border-gray-300 focus:border-custom-blue focus:ring-1 focus:ring-custom-blue text-gray-900"
          required
          minLength={8}
          value={confirmPassword}
          onChange={onChangeConfirmPassword}
        />
      </div>

      {/* Sign Up Button */}
      <button 
        className="btn bg-custom-blue text-white hover:bg-blue-800 border-none mt-6 w-full" 
        type="submit"
        disabled={loading}
      >
        {loading ? <span className="loading loading-dots loading-md"></span> : "Sign Up"}
      </button>

      {/* Login Redirect */}
      <p className="mt-6 text-center text-sm text-gray-600">
        Already have an account?{" "}
        <Link
          to={"/login"}
          className="font-semibold text-custom-blue hover:text-blue-800 hover:underline"
        >
          Login
        </Link>
      </p>
    </form>
  );
};

export default Signup;
