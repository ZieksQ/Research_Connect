import React, { useState } from "react";

const Signup = ({ onSubmit, onChangeUsername, onChangePassword, Data }) => {
  const { username, password } = Data;

  return (
    <form onSubmit={onSubmit}>
      <fieldset className="fieldset w-xs bg-base-200 border-base-300 rounded-box border p-4">
        <legend className="fieldset-legend">Sign Up</legend>

        <label className="floating-label">
          <span>Username</span>
          <input
            type="text"
            placeholder="Username"
            className="input validator"
            required
            value={username}
            onChange={onChangeUsername}
          />
          <p className="validator-hint">Cannot be empty</p>
        </label>

        <label className="floating-label">
          <span>Password</span>
          <input
            type="password"
            placeholder="Password"
            className="input validator"
            value={password}
            required
            min={8}
            onChange={onChangePassword}
          />
          <p className="validator-hint">Must be more than 8 characters</p>
        </label>

        <button type="submit" className="btn btn-neutral mt-4">
            Sign Up
        </button>
      </fieldset>
    </form>
  );
};

export default Signup;
