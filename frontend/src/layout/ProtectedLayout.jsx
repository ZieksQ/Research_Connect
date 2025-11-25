import React, { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const ProtectedLayout = () => {
  const navigate = useNavigate();
  const { userInfo } = useAuth();

  useEffect(() => {
    if (userInfo && userInfo.not_logged_in) {
      navigate("/login");
    }
  }, [userInfo, navigate]);

  if (!userInfo || userInfo === null) {
    return (
      <section className="fixed content-position-center">
        <span className="loading loading-ring loading-xl"></span>
      </section>
    )
  }

  return <Outlet />;
};

export default ProtectedLayout;
