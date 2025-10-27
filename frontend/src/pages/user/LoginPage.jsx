import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Login from "../../components/user/Login.jsx";
import InquiraIcon from "../../assets/icons/Inquira.svg"
import { loginUser } from "../../services/auth.js";

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(""); // shows message error
  const [loading, setLoading] = useState(false); // loading state 
  const navigate = useNavigate(); // for navigation react-router-dom

  // Remove Error after 3 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(""), 3000) // set timeout for 3 sec
      return () => clearTimeout(timer) // clean up for errors
    }
  }, [error]) // will trigger everytime error changes value

  

  const handleLogin = async (e) => {
    e.preventDefault(); // To prevent page reload on submit
    setLoading(true) // loading...

    const payload = { username, password }; // object destructuring
    const data = await loginUser(payload);  // logging in User
    setLoading(false);                      // loading done!
    
    // Checks returned data 
    if (!data.ok) {
      setError(data.message || "Something went wrong")
      return;
    }

    navigate('/home'); // if data status is ok then navigate to / homepage
  };

  const handleGoogleLogin = () => {
    window.location.href = "http://127.0.0.1:5000/oauth/login";
  }

  return (
    <section className="registration ">
      <div className="registration-card ">
        {/* Logo & Title */}
        <div className="text-center mb-8">
          <img src={InquiraIcon} alt="inquira icon" className="h-8 mx-auto mb-2"/>
          <p className="text-sm text-gray-600 leading-relaxed">
            Create and share surveys, or steal insights<br />by answering others—only on Inquira.
          </p>
        </div>

        {/* Login Form */}
        <Login
          value={{ email: username, password: password }}
          onChangeEmail={(e) => setUsername(e.target.value)}
          onChangePassword={(e) => setPassword(e.target.value)}
          handleGoogleLogin={handleGoogleLogin}
          submit={handleLogin}
          loading={loading}
          error={error}
        />
      </div>
    </section>
  );
};

export default LoginPage;
