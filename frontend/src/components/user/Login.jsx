import React from "react";
import { Link } from "react-router-dom";
import GoogleLogo from "../../assets/icons/google_icon.svg";
import InquiraIcon from "../../assets/icons/Inquira.svg"

const Login = ({ value, onChangeEmail, onChangePassword, submit, error, loading, handleGoogleLogin }) => {
  return (
    <form onSubmit={submit}>
      {/* Error Handling */}
      {error && (
        <div role="alert" className="alert alert-error rounded-md shadow-sm">
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

      {/* Username Input */}
      <label className="floating-label mb-4">
        <span>Username</span>
        <input
          type="text"
          className="input w-full"
          placeholder="Username"
          required
          value={value.email}
          onChange={onChangeEmail}
        />
      </label>

      {/* Password Input */}
      <div>
        
        <label className="floating-label mb-2">
          <span>Password</span>
          <input
            type="password"
            className="input w-full"
            placeholder="Password"
            min={8}
            required
            value={value.password}
            onChange={onChangePassword}
          />
        </label>
  
      </div>

      <div className="flex">
        <a href="#" className="ml-auto text-xs text-blue-600 hover:text-blue-700 underline">
          Forgot password?
        </a>
      </div>

      {/* Sign In Button */}
      <button className="btn btn-neutral w-full mt-6" type="submit">
        {loading ? <span className="loading loading-dots loading-md"></span> : "Login"}
      </button>

      {/* Divider */}
      <div className="divider text-gray-400 text-xs my-4">or</div>

      {/* Google Login */}
      <button type="button" onClick={handleGoogleLogin} className="btn bg-white border border-gray-300 w-full hover:bg-gray-50">
        <img src={GoogleLogo} alt="google icon" className="icon-size w-5 h-5" />
        Login with Google
      </button>

      {/* Sign Up Link */}
      <p className="text-center text-sm text-gray-600 mt-6">
        Don't have an account?{" "}
        <Link to={"/signup"} className="font-semibold text-blue-600 hover:text-blue-700">
          Register
        </Link>
      </p>
    </form>
  );
};

export default Login;
