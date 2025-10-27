import { apiFetch } from "./fetcher";

export const loginUser = async(data) => 
    apiFetch('/api/user/login', {
        method: "POST",
        body: JSON.stringify(data),
    })

export const registerUser = async(data) =>
    apiFetch('/api/user/register', {
        method: "POST",
        body: JSON.stringify(data),
    })

export const logoutUser = async() => 
    apiFetch('/api/user/logout', {method: "POST"})

export const refreshUser = async () => {
  try {
    const res = await fetch("http://localhost:5000/api/user/refresh", {
      method: "POST",
      credentials: "include", // send refresh cookie
    });
    return await res.json();
  } catch (err) {
    console.error("Error refreshing token:", err);
    return null;
  }
};
