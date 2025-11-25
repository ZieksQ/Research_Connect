import React, { createContext, useCallback, useEffect, useState } from "react";
import { getUserData } from "../services/user";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUserData = useCallback(async () => {
    setLoading(true);
    const data = await getUserData();
    setUserInfo(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  useEffect(() => {
    console.log(userInfo);
  }, [userInfo]);

  return (
    <AuthContext.Provider value={{ userInfo, setUserInfo, refreshUser: fetchUserData, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
