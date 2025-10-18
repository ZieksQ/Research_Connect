import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Signup from "../../components/user/Signup.jsx";
import InquiraIcon from "../../assets/icons/Inquira.svg";
import { registerUser } from "../../services/auth.js";

// Page for user Sign up
const SignupPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(""); // shows message error
  const [loading, setLoading] = useState(false); // loading state

  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault(); // prevents page to reload everytime you submit
    setLoading(true); // loading...

    const payload = { username, password }; // stores username, password value to send

    // confirm password validation
    if (password != confirmPassword) {
      setError("Wrong Password");
      setLoading(false);
      return;
    }

    const data = await registerUser(payload); // register user

    // checks returned data
    if (!data.ok) {
      return data.message;
    }

    setLoading(false); // Loading done!
    navigate("/login"); // if data is ok then navigate to login page
  };

  return (
    <section className="registration">
      <div className="registration-card">
        {/* Logo */}
        <div className="mb-8 text-center">
          <img
            src={InquiraIcon}
            alt="inquira icon"
            className="mx-auto mb-2 h-8"
          />
          <p className="text-sm leading-relaxed text-gray-600">
            Create and share surveys, or steal insights
            <br />
            by answering others—only on Inquira.
          </p>
        </div>

        {/* Signup Form */}
        <Signup
          Data={{
            username: username,
            password: password,
            confirmPassword: confirmPassword,
          }}
          onChangeUsername={(e) => setUsername(e.target.value)}
          onChangePassword={(e) => setPassword(e.target.value)}
          onChangeConfirmPassword={(e) => setConfirmPassword(e.target.value)}
          onSubmit={handleSignup}
          loading={loading}
          error={error}
        />
      </div>
    </section>
  );
};

export default SignupPage;
