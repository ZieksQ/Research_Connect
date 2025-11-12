// reusable api fetcher function
// it works like a normal fetch api 
// but it automatically requires credentials and headers content-type as application/json
// you may include other headers 
// then this returns data so you can do other validation on your handler code

import { refreshUser } from "./auth";

export const apiFetch = async (url, options = {}) => {
  try {
    const headers = options.headers || {};

    // Only set Content-Type if body is NOT FormData
    if (!(options.body instanceof FormData)) {
      headers["Content-Type"] = "application/json";
    }

    let res = await fetch(url, {
      credentials: "include", // send cookies
      ...options,
      headers,
    });

    let data = await res.json();

     // If token expired — refresh & retry once
    if (data?.token_expired) {
      console.warn("Access token expired. Refreshing...");

      const refresh = await refreshUser();
      console.log("Refresh response:", refresh);

      if (refresh.ok) {
        console.log("Token refreshed! Retrying request...");
        res = await fetch(url, {
          credentials: "include",
          ...options,
          headers,
        });
        data = await res.json();
      } else {
        console.error("Token refresh failed.");
      }
    }
    
    console.log(data);

    return data;
  } catch (err) {
    console.error("apiFetch error:", err);
    return;
  }
};
