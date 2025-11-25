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
    <form onSubmit={onSubmit}>
      {/* Error Message */}
      {error && (
        <div
          role="alert"
          className="alert alert-error mb-4 rounded-md shadow-sm"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 shrink-0 stroke-current"
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
      <label className="floating-label mb-4">
        <span>Username</span>
        <input
          type="text"
          placeholder="Username"
          className="input w-full"
          required
          value={username}
          onChange={onChangeUsername}
        />
      </label>

      {/* Password */}
      <label className="floating-label mb-4">
        <span>Password</span>
        <input
          type="password"
          placeholder="Password"
          className="input w-full"
          required
          minLength={8}
          value={password}
          onChange={onChangePassword}
        />
      </label>

      {/* Confirm Password */}
      <label className="floating-label mb-2">
        <span>Confirm Password</span>
        <input
          type="password"
          placeholder="Re-enter Password"
          className="input w-full"
          required
          minLength={8}
          value={confirmPassword}
          onChange={onChangeConfirmPassword}
        />
      </label>

      {/* Sign Up Button */}
      <button className="btn btn-neutral mt-6 w-full" type="submit">
        {loading ? <span className="loading loading-dots loading-md"></span> : "Sign Up"}
      </button>

      {/* Divider
      <div className="divider my-4 text-xs text-gray-400">or</div> */}

      {/* Google Sign Up
      <button
        type="button"
        className="btn w-full border border-gray-300 bg-white hover:bg-gray-50"
      >
        <img src={GoogleLogo} alt="google icon" className="icon-size h-5 w-5" />
        Sign up with Google
      </button> */}

      {/* Login Redirect */}
      <p className="mt-6 text-center text-sm text-gray-600">
        Already have an account?{" "}
        <Link
          to={"/login"}
          className="font-semibold text-blue-600 hover:text-blue-700"
        >
          Login
        </Link>
      </p>
    </form>
  );
};

export default Signup;
