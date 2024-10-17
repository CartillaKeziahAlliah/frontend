import React from "react";
import { Outlet, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import Sidebar from "./components/sidebar/sidebar";

//please ayaw hilabti
const ProtectedRoute = () => {
  const { user, loading, logout } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <div style={{ display: "flex", width: "100%" }}>
      <Sidebar user={user} logout={logout} />
      <div
        style={{
          flex: 1,
          height: "99vh",
          overflowY: "scroll",
          overflowX: "hidden",
        }}
      >
        <Outlet />
      </div>
    </div>
  );
};

export default ProtectedRoute;
