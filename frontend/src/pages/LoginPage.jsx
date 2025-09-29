import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault(); // To prevent page reload on submit

    const data = { username, password }; // creates data object

    // Fetch API : POST
    try {
      const response = await fetch("http://localhost:5000/user/login", {
        method: "POST",
        headers: {
          "Content-type": "application/json", // tells the backend that request body is json
        },
        body: JSON.stringify(data), // converts javascript to json
        credentials: "include", // includes jwt & cookies
      });

      const resData = await response.json(); // wait for response

      if (!resData.ok) {
        // if response is not ok
        return resData.message; // returns response message
      }

      navigate("/home");

    } catch (err) {
      console.error(`Error: ${err}`); // catches error
    }
  };

  return (
    <section>
      <form onSubmit={handleLogin}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)} // update value on change
        />

        <input
          type="text"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)} // update value on change
        />

        <button type="submit">Login</button>
      </form>
    </section>
  );
};

export default LoginPage;
