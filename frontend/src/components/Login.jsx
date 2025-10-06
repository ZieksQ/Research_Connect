import React from "react";

const Login = ({value, onChangeEmail, onChangePassword, submit, }) => {
  return (
    <form onSubmit={submit}>
      <fieldset class="fieldset bg-base-200 border-base-300 rounded-box w-xs border p-4">
        <legend class="fieldset-legend">Login</legend>

        <label class="label">Email</label>
        <input type="text" class="input" placeholder="Email" value={value.email} onChange={onChangeEmail}/>

        <label class="label">Password</label>
        <input type="password" class="input" placeholder="Password" value={value.password} onChange={onChangePassword}/>

        <button class="btn btn-neutral mt-4" type="submit">Login</button>
      </fieldset>
    </form>
  );
};

export default Login;
