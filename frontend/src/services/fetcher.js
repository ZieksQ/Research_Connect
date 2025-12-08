// reusable api fetcher function
// it works like a normal fetch api
// but it automatically requires credentials and headers content-type as application/json
// you may include other headers
// then this returns data so you can do other validation on your handler code

import { refreshUser } from "./auth";

// Guard to prevent multiple simultaneous refresh attempts
let isRefreshing = false;
let refreshPromise = null;

// Function to get CSRF token from cookie (Flask-JWT-Extended sets csrf_access_token cookie)
const getCsrfToken = (cookieName = "csrf_access_token") => {
  const cookies = document.cookie.split(";");
  for (let cookie of cookies) {
    const [name, ...rest] = cookie.trim().split("=");
    const value = rest.join("="); // handles "=" in cookie values
    if (name === cookieName) return decodeURIComponent(value);
  }
  return null;
};

export const apiFetch = async (url, options = {}) => {
  try {
    const headers = options.headers || {};

    // Only set Content-Type if body is NOT FormData
    if (!(options.body instanceof FormData)) {
      headers["Content-Type"] = "application/json";
    }

    // Add CSRF token for state-changing requests (Flask-JWT-Extended CSRF protection)
    if (options.method && options.method.toUpperCase() !== "GET") {
      let csrfToken;

      // Use refresh token CSRF for refresh/logout endpoints
      if (url.includes("/api/user/refresh")) {
        csrfToken = getCsrfToken("csrf_refresh_token");
      } else {
        csrfToken = getCsrfToken("csrf_access_token");
      }

      if (csrfToken) {
        headers["X-CSRF-TOKEN"] = csrfToken;
      } else {
        console.warn(`CSRF token not found for ${url}`);
      }
    }
    
    let res = await fetch(url, {
      credentials: "include", // send cookies
      ...options,
      headers,
    });

    let data = await res.json();

    // If not logged in OR token expired — try to refresh
    if (data?.not_logged_in || data?.token_expired) {
      console.warn(data?.token_expired ? "Access token expired. Refreshing..." : "No access token. Attempting refresh...");

      // Use the existing refresh promise if one is in progress, otherwise create a new one
      if (!isRefreshing) {
        isRefreshing = true;
        refreshPromise = refreshUser().finally(() => {
          isRefreshing = false;
          refreshPromise = null;
        });
      }

      const refresh = await refreshPromise;

      if (refresh?.ok) {
        console.log("Token refreshed successfully! Retrying request...");
        
        // Get the NEW CSRF token after refresh
        const newCsrfToken = getCsrfToken("csrf_access_token");
        if (newCsrfToken && options.method && options.method.toUpperCase() !== "GET") {
          headers["X-CSRF-TOKEN"] = newCsrfToken;
        }
        
        res = await fetch(url, {
          credentials: "include",
          ...options,
          headers, // Use updated headers with new CSRF token
        });
        data = await res.json();
      } else {
        console.error("Token refresh failed. User needs to log in.");
        return data; // Return the not_logged_in response
      }
    }

    console.log(data);

    return data;
  } catch (err) {
    console.error("API Fetch Error:", err);
    return {
      ok: false,
      message: "Network error. Please check your connection.",
    };
  }
};
