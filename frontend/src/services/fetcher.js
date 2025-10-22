// reusable api fetcher function
// it works like a normal fetch api 
// but it automatically requires credentials and headers content-type as application/json
// you may include other headers 
// then this returns data so you can do other validation on your handler code

export const apiFetch = async (url, options = {}) => {
  try {
    const res = await fetch(url, {
      credentials: "include",
      headers: { "Content-type": "application/json" },
      ...options,
    });

    const data = await res.json();
    return data;
  } catch (err) {
    console.error(err);
    return;
  }
};
