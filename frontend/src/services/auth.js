import { apiFetch } from "./fetcher";

const getCsrfToken = (cookieName = "csrf_access_token") => {
  const cookies = document.cookie.split(";");
  for (let cookie of cookies) {
    const [name, ...rest] = cookie.trim().split("=");
    const value = rest.join("="); // handles "=" in cookie values
    if (name === cookieName) return decodeURIComponent(value);
  }
  return null;
};

export const loginUser = async (data) =>
  apiFetch("/api/user/login", {
    method: "POST",
    body: JSON.stringify(data),
  });

export const registerUser = async (data) =>
  apiFetch("/api/user/register", {
    method: "POST",
    body: JSON.stringify(data),
  });

export const logoutUser = async () =>
  apiFetch("/api/user/refresh/logout", { method: "POST" });

export const refreshUser = async () => {
  try {
    const csrf = getCsrfToken("csrf_refresh_token");
    // or "csrf_access_token" depending on what your backend expects

    const res = await fetch("/api/user/refresh", {
      method: "POST",
      credentials: "include", // send refresh cookie
      headers: {
        "Content-Type": "application/json",
        "X-CSRF-TOKEN": csrf ?? "", // add csrf header here
      },
    });

    return await res.json();
  } catch (err) {
    console.error("Error refreshing token:", err);
    return null;
  }
};
