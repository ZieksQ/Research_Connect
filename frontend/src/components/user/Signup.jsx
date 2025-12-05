import React, { useState } from "react";
import { Link } from "react-router-dom";
import GoogleLogo from "../../assets/icons/google_icon.svg";
import TermsModal from "../ui/TermsModal";

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
  const [usernameError, setUsernameError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [showTerms, setShowTerms] = useState(false);

  const validateUsername = () => {
    if (!username) setUsernameError("Username is required");
    else setUsernameError("");
  };

  const validatePassword = () => {
    const hasNumber = /\d/.test(password);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    if (!password) {
      setPasswordError("Password is required");
    } else if (password.length < 8) {
      setPasswordError("Password must be at least 8 characters");
    } else if (!hasNumber) {
      setPasswordError("Password must contain at least one number");
    } else if (!hasSpecial) {
      setPasswordError("Password must contain at least one special character");
    } else {
      setPasswordError("");
    }
  };

  const validateConfirmPassword = () => {
    if (!confirmPassword) setConfirmPasswordError("Confirm Password is required");
    else if (confirmPassword !== password) setConfirmPasswordError("Passwords do not match");
    else setConfirmPasswordError("");
  };

  const handleSignupClick = (e) => {
    e.preventDefault();
    
    // Run all validations
    validateUsername();
    validatePassword();
    validateConfirmPassword();

    // Check if there are any errors (including the ones just set)
    // Since setState is async, we re-check the values directly
    const hasNumber = /\d/.test(password);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    
    if (!username || !password || !confirmPassword) return;
    if (password.length < 8 || !hasNumber || !hasSpecial) return;
    if (password !== confirmPassword) return;

    setShowTerms(true);
  };

  return (
    <>
    <form onSubmit={handleSignupClick} className="space-y-4">
      {/* Requirements Message */}
      <div className="text-xs text-gray-500 mb-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
        <p className="font-semibold mb-1">Requirements:</p>
        <ul className="list-disc list-inside space-y-1">
          <li>Username must be unique</li>
          <li>Password must be at least 8 characters</li>
          <li>Password must contain at least one number</li>
          <li>Password must contain at least one special character</li>
        </ul>
      </div>

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
          className={`input input-bordered w-full bg-white border-gray-300 focus:border-custom-blue focus:ring-1 focus:ring-custom-blue text-gray-900 ${usernameError ? "input-error" : ""}`}
          required
          value={username}
          onChange={(e) => {
            onChangeUsername(e);
            if (usernameError) setUsernameError("");
          }}
          onBlur={validateUsername}
        />
        {usernameError && <span className="label-text-alt text-error mt-1">{usernameError}</span>}
      </div>

      {/* Password */}
      <div className="form-control w-full">
        <label className="label">
          <span className="label-text font-medium text-gray-700">Password</span>
        </label>
        <input
          type="password"
          placeholder="Create a password (min 8 chars)"
          className={`input input-bordered w-full bg-white border-gray-300 focus:border-custom-blue focus:ring-1 focus:ring-custom-blue text-gray-900 ${passwordError ? "input-error" : ""}`}
          required
          minLength={8}
          value={password}
          onChange={(e) => {
            onChangePassword(e);
            if (passwordError) setPasswordError("");
          }}
          onBlur={validatePassword}
        />
        {passwordError && <span className="label-text-alt text-error mt-1">{passwordError}</span>}
      </div>

      {/* Confirm Password */}
      <div className="form-control w-full">
        <label className="label">
          <span className="label-text font-medium text-gray-700">Confirm Password</span>
        </label>
        <input
          type="password"
          placeholder="Re-enter your password"
          className={`input input-bordered w-full bg-white border-gray-300 focus:border-custom-blue focus:ring-1 focus:ring-custom-blue text-gray-900 ${confirmPasswordError ? "input-error" : ""}`}
          required
          minLength={8}
          value={confirmPassword}
          onChange={(e) => {
            onChangeConfirmPassword(e);
            if (confirmPasswordError) setConfirmPasswordError("");
            // Immediate check for match
            if (password && e.target.value !== password) {
               setConfirmPasswordError("Passwords do not match");
            }
          }}
          onBlur={validateConfirmPassword}
        />
        {confirmPasswordError && <span className="label-text-alt text-error mt-1">{confirmPasswordError}</span>}
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
        <Link to="/login" className="font-semibold text-custom-blue hover:text-blue-800 hover:underline">
          Login
        </Link>
      </p>
    </form>

    <TermsModal 
      isOpen={showTerms} 
      onClose={() => setShowTerms(false)} 
      onConfirm={(e) => {
        setShowTerms(false);
        onSubmit(e);
      }}
      showConfirm={true}
    />
    </>
  );
};

export default Signup;
