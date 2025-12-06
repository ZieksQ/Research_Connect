import React, { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const PublicLayout = () => {
  const navigate = useNavigate();
  const { userInfo, loading } = useAuth();

  useEffect(() => {
    // If user is logged in (userInfo exists and doesn't have not_logged_in flag), redirect to home
    if (userInfo && !userInfo.not_logged_in) {
      navigate("/home", { replace: true });
    }
  }, [userInfo, navigate]);

  // Only show loading during initial auth check
  if (loading) {
    return (
      <section className="fixed inset-0 flex flex-col items-center justify-center">
        <span className="loading loading-infinity loading-lg text-custom-blue"></span>
      </section>
    );
  }

  // If user is logged in, don't render anything (will redirect)
  if (userInfo && !userInfo.not_logged_in) {
    return null;
  }

  return <Outlet />;
};

export default PublicLayout;
