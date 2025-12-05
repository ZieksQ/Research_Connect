import React, { useState } from "react";
import { Link } from "react-router-dom";
import GoogleLogo from "../../assets/icons/google_icon.svg";
import InquiraIcon from "../../assets/icons/Inquira.svg"
import TermsModal from "../ui/TermsModal";

const Login = ({ value, onChangeEmail, onChangePassword, submit, error, loading, handleGoogleLogin }) => {
  const [usernameError, setUsernameError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [showTerms, setShowTerms] = useState(false);

  const validateUsername = () => {
    if (!value.email) {
      setUsernameError("Username is required");
    } else {
      setUsernameError("");
    }
  };

  const validatePassword = () => {
    if (!value.password) {
      setPasswordError("Password is required");
    } else if (value.password.length < 8) {
      setPasswordError("Password must be at least 8 characters");
    } else {
      setPasswordError("");
    }
  };

  return (
    <>
    <form onSubmit={submit} className="space-y-4">
      {/* Error Handling */}
      {error && (
        <div role="alert" className="alert alert-error rounded-lg shadow-sm text-sm py-2">
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

      {/* Username Input */}
      <div className="form-control w-full">
        <label className="label">
          <span className="label-text font-medium text-gray-700">Username</span>
        </label>
        <input
          type="text"
          className={`input input-bordered w-full bg-white border-gray-300 focus:border-custom-blue focus:ring-1 focus:ring-custom-blue text-gray-900 ${usernameError ? "input-error" : ""}`}
          placeholder="Enter your username"
          required
          value={value.email}
          onChange={(e) => {
            onChangeEmail(e);
            if (usernameError) setUsernameError("");
          }}
          onBlur={validateUsername}
        />
        {usernameError && <span className="label-text-alt text-error mt-1">{usernameError}</span>}
      </div>

      {/* Password Input */}
      <div className="form-control w-full">
        <label className="label">
          <span className="label-text font-medium text-gray-700">Password</span>
        </label>
        <input
          type="password"
          className={`input input-bordered w-full bg-white border-gray-300 focus:border-custom-blue focus:ring-1 focus:ring-custom-blue text-gray-900 ${passwordError ? "input-error" : ""}`}
          placeholder="Enter your password"
          min={8}
          required
          value={value.password}
          onChange={(e) => {
            onChangePassword(e);
            if (passwordError) setPasswordError("");
          }}
          onBlur={validatePassword}
        />
        {passwordError && <span className="label-text-alt text-error mt-1">{passwordError}</span>}
      </div>

      {/* Sign In Button */}
      <button 
        className="btn bg-custom-blue text-white hover:bg-blue-800 border-none w-full mt-2" 
        type="submit"
        disabled={loading}
      >
        {loading ? <span className="loading loading-dots loading-md"></span> : "Login"}
      </button>

      {/* Divider */}
      <div className="divider text-gray-400 text-xs my-4">or</div>

      {/* Google Login */}
      <button 
        type="button" 
        onClick={handleGoogleLogin} 
        className="btn bg-white border border-gray-300 w-full hover:bg-gray-50 text-gray-700 hover:border-gray-400"
      >
        <img src={GoogleLogo} alt="google icon" className="w-5 h-5" />
        Login with Google
      </button>

      {/* Sign Up Link */}
      <p className="text-center text-sm text-gray-600 mt-6">
        Don't have an account?{" "}
        <Link to={"/signup"} className="font-semibold text-custom-blue hover:text-blue-800 hover:underline">
          Register
        </Link>
      </p>

      {/* Terms Link */}
      <div className="text-center mt-4">
        <button 
          type="button"
          onClick={() => setShowTerms(true)}
          className="text-xs text-gray-500 hover:text-custom-blue hover:underline"
        >
          Terms and Conditions & Privacy Policy
        </button>
      </div>
    </form>

    <TermsModal 
      isOpen={showTerms} 
      onClose={() => setShowTerms(false)} 
      showConfirm={false}
    />
    </>
  );
};

export default Login;
