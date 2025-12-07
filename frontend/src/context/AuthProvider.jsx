import React, { createContext, useCallback, useEffect, useState } from "react";
import { getUserData } from "../services/user";

export const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(false); // Start as false, not loading
  const [hasChecked, setHasChecked] = useState(false);

  const fetchUserData = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getUserData();
      setUserInfo(data);
      setHasChecked(true);
    } catch (error) {
      console.error("Error fetching user data:", error);
      setUserInfo(null);
      setHasChecked(true);
    } finally {
      setLoading(false);
    }
  }, []); // No dependencies needed since it only uses setState functions

  // Don't auto-fetch on mount - let components request auth when needed
  // This prevents unnecessary API calls on public pages like landing page

  useEffect(() => {
    // console.log(userInfo);
  }, [userInfo]);

  return (
    <AuthContext.Provider value={{ userInfo, setUserInfo, refreshUser: fetchUserData, loading, hasChecked }}>
      {children}
    </AuthContext.Provider>
  );
};
