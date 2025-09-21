const USERPREFEX = "/user";
const REGISTER = "/register";
const LOGIN = "/login";
const LOGOUT = "/logout";
const REFRESH = "/REFRESH";

export const userSugnUp = async (datatoSend) => {
  try {
    const response = await fetch(`${USERPREFEX}${REGISTER}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(datatoSend),
    });

    const data = await response.json();

    if (!data.ok) {
      console.error("Registering user error");
      return data.message;
    }

    return data;
  } catch (error) {
    console.error(`Error: ${error}`);
  }
};

export const userLogIn = async (datatoSend) => {
  try {
    const response = await fetch(`${USERPREFEX}${LOGIN}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(datatoSend),
      credentials: "include",
    });

    const data = await response.json();

    if (!data.ok) {
      console.error("User log in error");
      return data.message;
    }

    return data;
  } catch (error) {
    console.error(`Error: ${error}`);
  }
};

export const userLogout = async () => {
  try {
    const response = await fetch(`${USERPREFEX}${LOGOUT}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });

    const data = await response.json();

    if (!data.ok) {
      console.error("User log out error");
      return data.message;
    }

    return data;
  } catch (error) {
    console.error(`Error: ${error}`);
  }
};

export const refreshToken = async () => {
  try {
    const response = await fetch(`${USERPREFEX}${LOGOUT}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });

    const data = await response.json();

    if (!data.ok) {
      console.error("Refresh access token error");
      return data.message;
    }

    return data;
  } catch (error) {
    console.error(`Error: ${error}`);
  }
};